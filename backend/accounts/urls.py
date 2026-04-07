from django.urls import path
from . import views
from .views import jwt_login, admin_jwt_login, protected_view, user_profile, admin_dashboard_data

urlpatterns = [
    path('login/', views.user_login_view, name='login'),
    path('admin-login/', views.admin_login_view, name='admin_login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('logout/', views.logout_view, name='logout'),
    # API Endpoints
    path('api/login/', jwt_login, name='api_login'),
    path('api/admin-login/', admin_jwt_login, name='api_admin_login'),
    path('api/protected/', protected_view, name='api_protected'),
    path('api/user-profile/', user_profile, name='api_user_profile'),
    path('api/admin-dashboard/', admin_dashboard_data, name='api_admin_dashboard'),
]