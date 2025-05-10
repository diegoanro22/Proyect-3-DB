"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView 
from GymReports import views as reportes_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    
    # APIs para datos de reportes
    path('api/salas/', reportes_views.get_salas, name='api_salas'),
    path('api/equipos/', reportes_views.get_equipos_data, name='api_equipos'),
    path('api/estados-equipos/', reportes_views.get_resumen_estados_equipos, name='api_estados_equipos'),
    path('api/equipos-por-sala/', reportes_views.get_equipos_por_sala, name='api_equipos_por_sala'),
    
    # APIs para Reporte 2: Progreso Físico (Mediciones Corporales)
    path('api/socios/', reportes_views.get_socios, name='api_socios'),
    path('api/mediciones-corporales/', reportes_views.get_mediciones_corporales, name='api_mediciones_corporales'),
    path('api/progreso-mediciones/', reportes_views.get_progreso_mediciones, name='api_progreso_mediciones'),
    
    # APIs para Reporte 3: Uso de Rutinas y Calorías Quemadas
    path('api/rutinas/', reportes_views.get_rutinas, name='api_rutinas'),
    path('api/registros-rutinas/', reportes_views.get_registros_rutinas, name='api_registros_rutinas'),
    path('api/calorias-por-rutina/', reportes_views.get_calorias_por_rutina, name='api_calorias_por_rutina'),
    path('api/tendencia-calorias-semanal/', reportes_views.get_tendencia_calorias_semanal, name='api_tendencia_calorias_semanal'),

    
    # APIs para Reporte 5: 
    path('api/frecuencia-visitas/', reportes_views.get_frecuencia_visitas, name='api_frecuencia_visitas'),
    path('api/planes-membresia/', reportes_views.get_planes_membresia, name='api_planes_membresia'),
]
