"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.jwt_login, name='login'),
    path('api/admin/login/', views.admin_jwt_login, name='admin_login'),
    path('api/admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('api/admin/users/', views.admin_users, name='admin_users'),
    path('api/admin/users/<int:id>/', views.admin_user_detail, name='admin_user_detail'),
    path('api/admin/vehicles/', views.admin_vehicles, name='admin_vehicles'),
    path('api/admin/vehicles/<int:id>/', views.admin_vehicle_detail, name='admin_vehicle_detail'),
    path('api/admin/fleets/', views.admin_fleets, name='admin_fleets'),
    path('api/admin/bookings/', views.admin_bookings, name='admin_bookings'),
    path('api/admin/bookings/<int:id>/action/', views.admin_booking_action, name='admin_booking_action'),
]