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


#############
# Reporte 1 #
#############

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


#############
# Reporte 2 #
#############

@require_GET
def get_socios(request):
    """Devuelve lista de socios con filtros opcionales"""
    nombre = request.GET.get('nombre', '')
    rango_edad = request.GET.get('rango_edad', '')
    plan = request.GET.get('plan', '')

    query = """
        SELECT 
            s.id_socio as id,
            s.nombre,
            s.apellido,
            p.nombre_plan as plan_membresia,
            s.fecha_nacimiento,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) as edad
        FROM socios s
        LEFT JOIN planes_membresia p ON s.id_plan = p.id_plan
        WHERE 1=1
    """

    params = []

    if nombre:
        query += " AND (LOWER(s.nombre) LIKE %s OR LOWER(s.apellido) LIKE %s)"
        params.extend([f'%{nombre.lower()}%', f'%{nombre.lower()}%'])

    if rango_edad:
        if rango_edad == '46+':
            query += " AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) >= 46"
        else:
            min_edad, max_edad = rango_edad.split('-')
            query += """ AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) >= %s 
                         AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) <= %s"""
            params.extend([min_edad, max_edad])

    if plan:
        query += " AND LOWER(p.nombre_plan) = %s"
        params.append(plan.lower())

    query += " ORDER BY s.apellido, s.nombre"

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        socios = dictfetchall(cursor)

    return JsonResponse(socios, safe=False)


@require_GET
def get_mediciones_corporales(request):
    """Devuelve mediciones corporales con filtros opcionales"""
    socio = request.GET.get('socio', '')
    fecha_inicio = request.GET.get('fecha_inicio', '')
    fecha_fin = request.GET.get('fecha_fin', '')
    rango_edad = request.GET.get('rango_edad', '')
    plan = request.GET.get('plan', '')

    query = """
        SELECT 
            m.id_medicion,
            m.id_socio,
            s.nombre,
            s.apellido,
            p.nombre_plan as plan_membresia,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) as edad,
            m.fecha_medicion,
            m.peso_kg,
            m.altura_cm,
            ROUND((m.peso_kg / POWER((m.altura_cm / 100), 2))::numeric, 1) as imc,
            m.porcentaje_grasa,
            m.porcentaje_musculo,
            m.circunferencia_cintura_cm
        FROM mediciones_corporales m
        JOIN socios s ON m.id_socio = s.id_socio
        LEFT JOIN planes_membresia p ON s.id_plan = p.id_plan
        WHERE 1=1
    """

    params = []

    if socio:
        query += " AND (LOWER(s.nombre) LIKE %s OR LOWER(s.apellido) LIKE %s)"
        params.extend([f'%{socio.lower()}%', f'%{socio.lower()}%'])

    if fecha_inicio:
        query += " AND m.fecha_medicion >= %s"
        params.append(fecha_inicio)

    if fecha_fin:
        query += " AND m.fecha_medicion <= %s"
        params.append(fecha_fin)

    if rango_edad:
        if rango_edad == '46+':
            query += " AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) >= 46"
        else:
            min_edad, max_edad = rango_edad.split('-')
            query += """ AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) >= %s 
                      AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) <= %s"""
            params.extend([min_edad, max_edad])

    if plan:
        query += " AND LOWER(p.nombre_plan) = %s"
        params.append(plan.lower())

    query += " ORDER BY m.fecha_medicion DESC"

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        mediciones = dictfetchall(cursor)

    return JsonResponse(mediciones, safe=False)


@require_GET
def get_progreso_mediciones(request):
    """Devuelve el progreso de mediciones para gráficos"""
    socio = request.GET.get('socio', '')
    tipo_medicion = request.GET.get('tipo_medicion', 'peso')
    fecha_inicio = request.GET.get('fecha_inicio', '')
    fecha_fin = request.GET.get('fecha_fin', '')
    rango_edad = request.GET.get('rango_edad', '')
    plan = request.GET.get('plan', '')

    columna_medicion = "peso_kg"
    if tipo_medicion == 'grasa':
        columna_medicion = "porcentaje_grasa"
    elif tipo_medicion == 'musculo':
        columna_medicion = "porcentaje_musculo"
    elif tipo_medicion == 'cintura':
        columna_medicion = "circunferencia_cintura_cm"

    query = f"""
        SELECT 
            s.id_socio,
            CONCAT(s.nombre, ' ', s.apellido) as nombre_completo,
            p.nombre_plan as plan_membresia,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) as edad,
            m.fecha_medicion,
            m.{columna_medicion} as valor_medicion,
            ROUND((m.peso_kg / POWER((m.altura_cm / 100), 2))::numeric, 1) as imc
        FROM socios s
        JOIN mediciones_corporales m ON s.id_socio = m.id_socio
        LEFT JOIN planes_membresia p ON s.id_plan = p.id_plan
        WHERE 1=1
    """

    params = []

    if socio:
        query += " AND (LOWER(s.nombre) LIKE %s OR LOWER(s.apellido) LIKE %s)"
        params.extend([f'%{socio.lower()}%', f'%{socio.lower()}%'])

    if fecha_inicio:
        query += " AND m.fecha_medicion >= %s"
        params.append(fecha_inicio)

    if fecha_fin:
        query += " AND m.fecha_medicion <= %s"
        params.append(fecha_fin)

    if rango_edad:
        if rango_edad == '46+':
            query += " AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) >= 46"
        else:
            min_edad, max_edad = rango_edad.split('-')
            query += """ AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) >= %s 
                      AND EXTRACT(YEAR FROM AGE(CURRENT_DATE, s.fecha_nacimiento)) <= %s"""
            params.extend([min_edad, max_edad])

    if plan:
        query += " AND LOWER(p.nombre_plan) = %s"
        params.append(plan.lower())

    query += " ORDER BY s.id_socio, m.fecha_medicion"

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        mediciones = dictfetchall(cursor)

    socios = {}
    for medicion in mediciones:
        id_socio = medicion['id_socio']
        if id_socio not in socios:
            socios[id_socio] = {
                'nombre': medicion['nombre_completo'],
                'plan_membresia': medicion['plan_membresia'],
                'edad': medicion['edad'],
                'mediciones': []
            }

        socios[id_socio]['mediciones'].append({
            'fecha': medicion['fecha_medicion'],
            'valor': float(medicion['valor_medicion']) if medicion['valor_medicion'] is not None else None,
            'imc': float(medicion['imc']) if medicion['imc'] is not None else None
        })

    return JsonResponse(list(socios.values()), safe=False)




#############
# Reporte 3 #
#############

@require_GET
def get_rutinas(request):
    """Devuelve todas las rutinas disponibles"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT r.id_rutina as id, r.nombre_rutina as nombre, r.nivel_dificultad, 
                   r.duracion_estimada_min as duracion_minutos, 
                   e.nombre || ' ' || e.apellido as entrenador
            FROM rutinas r
            JOIN entrenadores e ON r.id_entrenador_creador = e.id_entrenador
            ORDER BY r.nombre_rutina
        """)
        rutinas = dictfetchall(cursor)

    return JsonResponse(rutinas, safe=False)

@require_GET
def get_registros_rutinas(request):
    """Devuelve los registros de entrenamiento con rutinas y calorías quemadas"""
    id_rutina = request.GET.get('rutina', '')
    nivel_dificultad = request.GET.get('nivel', '')
    nombre_socio = request.GET.get('socio', '')
    fecha_inicio = request.GET.get('fecha_inicio', '')
    fecha_fin = request.GET.get('fecha_fin', '')
    
    query = """
        SELECT 
            re.id_registro,
            s.nombre || ' ' || s.apellido as socio,
            r.nombre_rutina as rutina,
            r.nivel_dificultad as nivel,
            re.fecha_hora_inicio::date as fecha,
            EXTRACT(EPOCH FROM (re.fecha_hora_fin - re.fecha_hora_inicio))/60 as duracion_real_minutos,
            re.calorias_quemadas,
            EXTRACT(WEEK FROM re.fecha_hora_inicio) as semana,
            EXTRACT(MONTH FROM re.fecha_hora_inicio) as mes,
            EXTRACT(YEAR FROM re.fecha_hora_inicio) as año
        FROM registros_entrenamiento re
        JOIN socios s ON re.id_socio = s.id_socio
        JOIN rutinas r ON re.id_rutina = r.id_rutina
        WHERE 1=1
        AND s.activo = true
    """
    
    params = []
    
    if id_rutina:
        query += " AND r.id_rutina = %s"
        params.append(id_rutina)
    
    if nivel_dificultad:
        query += " AND r.nivel_dificultad = %s"
        params.append(nivel_dificultad)
    
    if nombre_socio:
        query += " AND (LOWER(s.nombre) LIKE %s OR LOWER(s.apellido) LIKE %s)"
        search_term = f"%{nombre_socio.lower()}%"
        params.append(search_term)
        params.append(search_term)
    
    if fecha_inicio:
        query += " AND re.fecha_hora_inicio::date >= %s"
        params.append(fecha_inicio)
    
    if fecha_fin:
        query += " AND re.fecha_hora_inicio::date <= %s"
        params.append(fecha_fin)
    
    query += " ORDER BY re.fecha_hora_inicio DESC"
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        registros = dictfetchall(cursor)
    
    return JsonResponse(registros, safe=False)

@require_GET
def get_calorias_por_rutina(request):
    """Devuelve el promedio de calorías quemadas por rutina"""
    id_rutina = request.GET.get('rutina', '')
    nivel_dificultad = request.GET.get('nivel', '')
    nombre_socio = request.GET.get('socio', '')
    fecha_inicio = request.GET.get('fecha_inicio', '')
    fecha_fin = request.GET.get('fecha_fin', '')
    
    query = """
        SELECT 
            r.nombre_rutina as rutina,
            ROUND(AVG(re.calorias_quemadas)) as promedio_calorias
        FROM registros_entrenamiento re
        JOIN socios s ON re.id_socio = s.id_socio
        JOIN rutinas r ON re.id_rutina = r.id_rutina
        WHERE 1=1
        AND s.activo = true
    """
    
    params = []
    
    if id_rutina:
        query += " AND r.id_rutina = %s"
        params.append(id_rutina)
    
    if nivel_dificultad:
        query += " AND r.nivel_dificultad = %s"
        params.append(nivel_dificultad)
    
    if nombre_socio:
        query += " AND (LOWER(s.nombre) LIKE %s OR LOWER(s.apellido) LIKE %s)"
        search_term = f"%{nombre_socio.lower()}%"
        params.append(search_term)
        params.append(search_term)
    
    if fecha_inicio:
        query += " AND re.fecha_hora_inicio::date >= %s"
        params.append(fecha_inicio)
    
    if fecha_fin:
        query += " AND re.fecha_hora_inicio::date <= %s"
        params.append(fecha_fin)
    
    query += " GROUP BY r.nombre_rutina ORDER BY promedio_calorias DESC"
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        promedios = dictfetchall(cursor)
    
    return JsonResponse(promedios, safe=False)

@require_GET
def get_tendencia_calorias_semanal(request):
    """Devuelve la tendencia de calorías quemadas semana a semana"""
    id_rutina = request.GET.get('rutina', '')
    nivel_dificultad = request.GET.get('nivel', '')
    nombre_socio = request.GET.get('socio', '')
    fecha_inicio = request.GET.get('fecha_inicio', '')
    fecha_fin = request.GET.get('fecha_fin', '')
    
    query = """
        SELECT 
            EXTRACT(YEAR FROM re.fecha_hora_inicio) || '-W' || LPAD(EXTRACT(WEEK FROM re.fecha_hora_inicio)::text, 2, '0') as semana,
            ROUND(AVG(re.calorias_quemadas)) as promedio_calorias,
            MIN(re.fecha_hora_inicio) as fecha_semana
        FROM registros_entrenamiento re
        JOIN socios s ON re.id_socio = s.id_socio
        JOIN rutinas r ON re.id_rutina = r.id_rutina
        WHERE 1=1
        AND s.activo = true
    """
    
    params = []
    
    if id_rutina:
        query += " AND r.id_rutina = %s"
        params.append(id_rutina)
    
    if nivel_dificultad:
        query += " AND r.nivel_dificultad = %s"
        params.append(nivel_dificultad)
    
    if nombre_socio:
        query += " AND (LOWER(s.nombre) LIKE %s OR LOWER(s.apellido) LIKE %s)"
        search_term = f"%{nombre_socio.lower()}%"
        params.append(search_term)
        params.append(search_term)
    
    if fecha_inicio:
        query += " AND re.fecha_hora_inicio::date >= %s"
        params.append(fecha_inicio)
    
    if fecha_fin:
        query += " AND re.fecha_hora_inicio::date <= %s"
        params.append(fecha_fin)
    
    query += " GROUP BY semana ORDER BY MIN(re.fecha_hora_inicio)"
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        tendencia = dictfetchall(cursor)
    
    return JsonResponse(tendencia, safe=False)





#############
# Reporte 4 #
#############

@require_GET
def get_equipos_disponibles(request):
    """Devuelve todos los equipos disponibles"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT id_equipo as id, nombre_equipo as nombre, marca, modelo
            FROM equipos
            ORDER BY nombre_equipo
        """)
        equipos = dictfetchall(cursor)

    return JsonResponse(equipos, safe=False)


@require_GET
def get_marcas_equipos(request):
    """Devuelve todas las marcas de equipos disponibles"""
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT DISTINCT marca 
            FROM equipos
            ORDER BY marca
        """)
        marcas = [row[0] for row in cursor.fetchall()]

    return JsonResponse(marcas, safe=False)


@require_GET
def get_uso_equipos(request):
    """Devuelve los datos de uso de equipos con filtros opcionales"""
    nombre_equipo = request.GET.get('nombreEquipo', '')
    marca = request.GET.get('marca', '')
    modelo = request.GET.get('modelo', '')
    sala = request.GET.get('sala', '')
    fecha_inicio_rutina = request.GET.get('fechaInicioRutina', '')
    fecha_fin_rutina = request.GET.get('fechaFinRutina', '')
    tipo_ejercicio = request.GET.get('tipoEjercicio', '')

    query = """
        SELECT 
            e.id_equipo,
            e.nombre_equipo as nombre,
            e.marca,
            e.modelo,
            s.nombre_sala as sala,
            COUNT(DISTINCT re.id_registro) as usos,
            SUM(COALESCE(re.fecha_hora_fin - re.fecha_hora_inicio, '0 minutes')::interval) as duracion_total,
            ROUND(AVG(EXTRACT(EPOCH FROM (re.fecha_hora_fin - re.fecha_hora_inicio))/60)) as duracion_media,
            COUNT(DISTINCT re.id_rutina) as rutinas_unicas
        FROM equipos e
        JOIN salas s ON e.id_sala = s.id_sala
        LEFT JOIN ejercicios ej ON ej.id_equipo = e.id_equipo
        LEFT JOIN rutina_ejercicios rex ON ej.id_ejercicio = rex.id_ejercicio
        LEFT JOIN registros_entrenamiento re ON rex.id_rutina = re.id_rutina
        WHERE 1=1
    """

    params = []

    if nombre_equipo:
        query += " AND e.nombre_equipo ILIKE %s"
        params.append(f'%{nombre_equipo}%')

    if marca:
        query += " AND e.marca = %s"
        params.append(marca)
        
    if modelo:
        query += " AND e.modelo ILIKE %s"
        params.append(f'%{modelo}%')

    if sala:
        query += " AND s.id_sala = %s"
        params.append(sala)
        
    if tipo_ejercicio:
        query += " AND ej.tipo_ejercicio = %s"
        params.append(tipo_ejercicio)

    if fecha_inicio_rutina:
        query += " AND re.fecha_hora_inicio::date >= %s"
        params.append(fecha_inicio_rutina)

    if fecha_fin_rutina:
        query += " AND re.fecha_hora_inicio::date <= %s"
        params.append(fecha_fin_rutina)

    query += """
        GROUP BY 
            e.id_equipo,
            e.nombre_equipo,
            e.marca,
            e.modelo,
            s.nombre_sala
        ORDER BY usos DESC
    """

    with connection.cursor() as cursor:
        cursor.execute(query, params)
        equipos_uso = dictfetchall(cursor)
        
        # Formatear la duración total a minutos
        for equipo in equipos_uso:
            if equipo['duracion_total']:
                # Extraer los minutos totales de la duración
                with connection.cursor() as cursor_duracion:
                    cursor_duracion.execute(
                        "SELECT EXTRACT(EPOCH FROM %s::interval)/60",
                        [equipo['duracion_total']]
                    )
                    minutos_totales = cursor_duracion.fetchone()[0]
                    equipo['duracion_total'] = round(minutos_totales)
            else:
                equipo['duracion_total'] = 0

    return JsonResponse(equipos_uso, safe=False)


@require_GET
def get_uso_equipos_por_sala(request):
    """Devuelve estadísticas de uso de equipos agrupados por sala"""
    fecha_inicio = request.GET.get('fechaInicio', '')
    fecha_fin = request.GET.get('fechaFin', '')
    
    query = """
        SELECT 
            s.nombre_sala as sala,
            COUNT(DISTINCT re.id_registro) as usos_totales,
            ROUND(AVG(EXTRACT(EPOCH FROM (re.fecha_hora_fin - re.fecha_hora_inicio))/60)) as duracion_media
        FROM salas s
        JOIN equipos e ON s.id_sala = e.id_sala
        JOIN ejercicios ej ON e.id_equipo = ej.id_equipo
        JOIN rutina_ejercicios rex ON ej.id_ejercicio = rex.id_ejercicio
        JOIN registros_entrenamiento re ON rex.id_rutina = re.id_rutina
        WHERE re.fecha_hora_fin IS NOT NULL
    """
    
    params = []
    
    if fecha_inicio:
        query += " AND re.fecha_hora_inicio::date >= %s"
        params.append(fecha_inicio)
        
    if fecha_fin:
        query += " AND re.fecha_hora_inicio::date <= %s"
        params.append(fecha_fin)
        
    query += """
        GROUP BY s.nombre_sala
        ORDER BY usos_totales DESC
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, params)
        uso_por_sala = dictfetchall(cursor)
        
    return JsonResponse(uso_por_sala, safe=False)


@require_GET
def get_top_equipos_usados(request):
    """Devuelve los equipos más utilizados"""
    limite = request.GET.get('limite', '10')
    
    query = """
        SELECT 
            e.nombre_equipo as nombre,
            e.marca,
            s.nombre_sala as sala,
            COUNT(DISTINCT re.id_registro) as usos_totales
        FROM equipos e
        JOIN salas s ON e.id_sala = s.id_sala
        JOIN ejercicios ej ON e.id_equipo = ej.id_equipo
        JOIN rutina_ejercicios rex ON ej.id_ejercicio = rex.id_ejercicio
        JOIN registros_entrenamiento re ON rex.id_rutina = re.id_rutina
        GROUP BY e.nombre_equipo, e.marca, s.nombre_sala
        ORDER BY usos_totales DESC
        LIMIT %s
    """
    
    with connection.cursor() as cursor:
        cursor.execute(query, [limite])
        top_equipos = dictfetchall(cursor)
        
    return JsonResponse(top_equipos, safe=False)




#############
# Reporte 5 #
#############

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
        socio['totalVisitas'] = socio['entrenamientos_count'] + \
            socio['clases_count']
        # Formatear la fecha de última visita para visualización
        if socio['ultima_visita'] and socio['ultima_visita'] != '1900-01-01 00:00:00':
            socio['fechaUltimaVisita'] = socio['ultima_visita'].strftime(
                '%Y-%m-%d')
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
