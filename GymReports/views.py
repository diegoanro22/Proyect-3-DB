from django.http import JsonResponse
from django.db import connection
from django.views.decorators.http import require_GET

def dictfetchall(cursor):
    """Retorna todas las filas del cursor como una lista de diccionarios"""
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

@require_GET
def get_salas(request):
    """Devuelve todas las salas disponibles"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id_sala as id, nombre_sala as nombre, capacidad 
            FROM salas
            ORDER BY nombre_sala
        """)
        salas = dictfetchall(cursor)
    
    return JsonResponse(salas, safe=False)

@require_GET
def get_equipos_data(request):
    """Devuelve los datos de equipos con filtros opcionales"""
    estado = request.GET.get('estado', '')
    sala = request.GET.get('sala', '')
    modelo = request.GET.get('modelo', '')
    tipo_ejercicio = request.GET.get('tipo_ejercicio', '')
    fecha_adquisicion_desde = request.GET.get('fecha_adquisicion_desde', '')
    fecha_adquisicion_hasta = request.GET.get('fecha_adquisicion_hasta', '')
    
    query = """
        SELECT 
            e.id_equipo, 
            e.nombre_equipo as nombre, 
            s.id_sala,
            s.nombre_sala as sala, 
            e.estado, 
            e.modelo,
            COALESCE(ej.tipo_ejercicio, 'No especificado') as tipo_ejercicio, 
            e.fecha_adquisicion,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_adquisicion)) * 12 +
            EXTRACT(MONTH FROM AGE(CURRENT_DATE, e.fecha_adquisicion)) as antiguedad_meses
        FROM equipos e
        LEFT JOIN salas s ON e.id_sala = s.id_sala
        LEFT JOIN ejercicios ej ON ej.id_equipo = e.id_equipo
        WHERE 1=1
    """
    
    params = []
    
    if estado:
        query += " AND e.estado = %s"
        params.append(estado)
    
    if sala:
        query += " AND s.id_sala = %s"
        params.append(sala)
    
    if tipo_ejercicio:
        query += " AND ej.tipo_ejercicio = %s"
        params.append(tipo_ejercicio)
    
    if fecha_adquisicion_desde:
        query += " AND e.fecha_adquisicion >= %s"
        params.append(fecha_adquisicion_desde)
    
    if fecha_adquisicion_hasta:
        query += " AND e.fecha_adquisicion <= %s"
        params.append(fecha_adquisicion_hasta)
    
    query += """
        GROUP BY 
            e.id_equipo, 
            e.nombre_equipo, 
            s.id_sala, 
            e.modelo,
            s.nombre_sala, 
            e.estado, 
            ej.tipo_ejercicio, 
            e.fecha_adquisicion
        ORDER BY e.fecha_adquisicion DESC
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        equipos = dictfetchall(cursor)
    
    # Agregamos información de uso
    for equipo in equipos:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT COUNT(*) as uso_total
                FROM registros_entrenamiento re
                JOIN rutina_ejercicios rex ON re.id_rutina = rex.id_rutina
                JOIN ejercicios ej ON rex.id_ejercicio = ej.id_ejercicio
                WHERE ej.id_equipo = %s
            """, [equipo['id_equipo']])
            
            uso = cursor.fetchone()
            equipo['uso_total'] = uso[0] if uso else 0
    
    return JsonResponse(equipos, safe=False)

@require_GET
def get_resumen_estados_equipos(request):
    """Devuelve resumen de estados de equipos para gráficos"""
    sala = request.GET.get('sala', '')
    
    query = """
        SELECT 
            e.estado,
            COUNT(*) as cantidad
        FROM equipos e
    """
    
    params = []
    
    if sala:
        query += " WHERE e.id_sala = %s"
        params.append(sala)
    
    query += """
        GROUP BY e.estado
        ORDER BY COUNT(*) DESC
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        resumen = dictfetchall(cursor)
    
    return JsonResponse(resumen, safe=False)

@require_GET
def get_equipos_por_sala(request):
    """Devuelve la cantidad de equipos activos por sala"""
    query = """
        SELECT 
            s.nombre_sala as sala,
            COUNT(*) as cantidad
        FROM equipos e
        JOIN salas s ON e.id_sala = s.id_sala
        WHERE e.estado IN ('Bueno', 'Regular')
        GROUP BY s.nombre_sala
        ORDER BY COUNT(*) DESC
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query)
        resumen = dictfetchall(cursor)
    
    return JsonResponse(resumen, safe=False)

@require_GET
def get_frecuencia_visitas(request):
    """Devuelve la frecuencia de visitas de socios con filtros opcionales"""
    nombre_socio = request.GET.get('nombreSocio', '')
    fecha_inicio = request.GET.get('fechaInicio', '')
    fecha_fin = request.GET.get('fechaFin', '')
    tipo_actividad = request.GET.get('tipoActividad', '')
    plan_membresia = request.GET.get('planMembresia', '')
    
    # Base query para socios
    query = """
        SELECT 
            s.id_socio,
            s.nombre,
            s.apellido,
            s.email,
            pm.nombre_plan as plan,
            
            -- Conteo de rutinas
            COALESCE(
                (SELECT COUNT(*) 
                FROM registros_entrenamiento re 
                WHERE re.id_socio = s.id_socio
    """
    
    # Filtro por fecha para rutinas
    if fecha_inicio:
        query += " AND re.fecha_hora_inicio >= %s"
    
    if fecha_fin:
        query += " AND re.fecha_hora_inicio <= %s"
    
    query += """
                ), 0) as entrenamientos_count,
                
            -- Conteo de clases
            COALESCE(
                (SELECT COUNT(*) 
                FROM socios_clases sc
                JOIN clases_grupales cg ON sc.id_clase = cg.id_clase
                WHERE sc.id_socio = s.id_socio
                AND sc.asistio = true
    """
    
    # Filtro por fecha para clases
    if fecha_inicio:
        query += " AND cg.fecha_hora_inicio >= %s"
    
    if fecha_fin:
        query += " AND cg.fecha_hora_inicio <= %s"
    
    query += """
                ), 0) as clases_count,
                
            -- Última fecha de visita (el mayor entre la última rutina y la última clase)
            GREATEST(
                COALESCE(
                    (SELECT MAX(re.fecha_hora_inicio) 
                    FROM registros_entrenamiento re 
                    WHERE re.id_socio = s.id_socio),
                    '1900-01-01'::timestamp
                ),
                COALESCE(
                    (SELECT MAX(cg.fecha_hora_inicio) 
                    FROM socios_clases sc
                    JOIN clases_grupales cg ON sc.id_clase = cg.id_clase
                    WHERE sc.id_socio = s.id_socio
                    AND sc.asistio = true),
                    '1900-01-01'::timestamp
                )
            ) as ultima_visita
            
        FROM socios s
        JOIN planes_membresia pm ON s.id_plan = pm.id_plan
        WHERE s.activo = true
    """
    
    params = []
    
    # Filtro por nombre, apellido o email
    if nombre_socio:
        query += """ 
            AND (
                s.nombre ILIKE %s 
                OR s.apellido ILIKE %s 
                OR s.email ILIKE %s
            )
        """
        search_term = f'%{nombre_socio}%'
        params.extend([search_term, search_term, search_term])
    
    # Filtro por plan de membresía
    if plan_membresia:
        query += " AND s.id_plan = %s"
        params.append(plan_membresia)
    
    # Agregar GROUP BY con todas las columnas no agregadas
    query += """
        GROUP BY s.id_socio, s.nombre, s.apellido, s.email, pm.nombre_plan
    """
    
    # Agregar parámetros de fecha para las subconsultas de rutinas y clases
    if fecha_inicio:
        params.append(fecha_inicio)
    if fecha_fin:
        params.append(fecha_fin)
    if fecha_inicio:
        params.append(fecha_inicio)
    if fecha_fin:
        params.append(fecha_fin)
    
    # Cláusula HAVING para filtrar por tipo de actividad si es necesario
    if tipo_actividad:
        if tipo_actividad == 'rutina':
            query += " HAVING COALESCE((SELECT COUNT(*) FROM registros_entrenamiento re WHERE re.id_socio = s.id_socio"
            if fecha_inicio:
                query += " AND re.fecha_hora_inicio >= %s"
                params.append(fecha_inicio)
            if fecha_fin:
                query += " AND re.fecha_hora_inicio <= %s"
                params.append(fecha_fin)
            query += "), 0) > 0"
        elif tipo_actividad == 'clase':
            query += " HAVING COALESCE((SELECT COUNT(*) FROM socios_clases sc JOIN clases_grupales cg ON sc.id_clase = cg.id_clase WHERE sc.id_socio = s.id_socio AND sc.asistio = true"
            if fecha_inicio:
                query += " AND cg.fecha_hora_inicio >= %s"
                params.append(fecha_inicio)
            if fecha_fin:
                query += " AND cg.fecha_hora_inicio <= %s"
                params.append(fecha_fin)
            query += "), 0) > 0"
    else:
        # Si no hay filtro por tipo de actividad, asegurarse de que haya al menos una visita
        query += " HAVING (COALESCE((SELECT COUNT(*) FROM registros_entrenamiento re WHERE re.id_socio = s.id_socio"
        if fecha_inicio:
            query += " AND re.fecha_hora_inicio >= %s"
            params.append(fecha_inicio)
        if fecha_fin:
            query += " AND re.fecha_hora_inicio <= %s"
            params.append(fecha_fin)
        query += "), 0) + COALESCE((SELECT COUNT(*) FROM socios_clases sc JOIN clases_grupales cg ON sc.id_clase = cg.id_clase WHERE sc.id_socio = s.id_socio AND sc.asistio = true"
        if fecha_inicio:
            query += " AND cg.fecha_hora_inicio >= %s"
            params.append(fecha_inicio)
        if fecha_fin:
            query += " AND cg.fecha_hora_inicio <= %s"
            params.append(fecha_fin)
        query += "), 0)) > 0"
    
    # Ordenar por total de visitas (descendente)
    query += """
        ORDER BY (
            COALESCE((SELECT COUNT(*) FROM registros_entrenamiento re WHERE re.id_socio = s.id_socio), 0) + 
            COALESCE((SELECT COUNT(*) FROM socios_clases sc WHERE sc.id_socio = s.id_socio AND sc.asistio = true), 0)
        ) DESC
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        socios = dictfetchall(cursor)
    
    # Calcular el total de visitas para cada socio
    for socio in socios:
        socio['totalVisitas'] = socio['entrenamientos_count'] + socio['clases_count']
        # Formatear la fecha de última visita para visualización
        if socio['ultima_visita'] and socio['ultima_visita'] != '1900-01-01 00:00:00':
            socio['fechaUltimaVisita'] = socio['ultima_visita'].strftime('%Y-%m-%d')
        else:
            socio['fechaUltimaVisita'] = 'N/A'
        # Eliminar el campo de fecha completa
        del socio['ultima_visita']
    
    return JsonResponse(socios, safe=False)

@require_GET
def get_planes_membresia(request):
    """Devuelve todos los planes de membresía disponibles"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id_plan as id, nombre_plan as nombre, precio_mensual
            FROM planes_membresia
            ORDER BY precio_mensual
        """)
        planes = dictfetchall(cursor)
    
    return JsonResponse(planes, safe=False)