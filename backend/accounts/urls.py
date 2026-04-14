from django.urls import path
from .views import user_login, admin_login, admin_dashboard, user_dashboard

urlpatterns = [
    path('api/login/', user_login, name='user_login'),
    path('api/admin-login/', admin_login, name='admin_login'),
    path('api/admin-dashboard/', admin_dashboard, name='admin_dashboard'),
    path('api/user-dashboard/', user_dashboard, name='user_dashboard'),
]
