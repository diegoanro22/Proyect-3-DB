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
