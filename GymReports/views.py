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