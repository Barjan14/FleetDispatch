from django.urls import path
from core.views import (
    jwt_login,                  # ✅ now exists in core/views.py
    admin_jwt_login,            # ✅ now exists in core/views.py
    admin_dashboard,
    admin_users, admin_user_detail,
    admin_vehicles, admin_vehicle_detail,
    admin_fleets,
    admin_bookings, admin_booking_action,
    check_vehicle_availability,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/login/',                                jwt_login,                  name='api_login'),
    path('api/admin-login/',                          admin_jwt_login,            name='api_admin_login'),
    path('api/admin-dashboard/',                      admin_dashboard,            name='api_admin_dashboard'),
    path('api/admin-users/',                          admin_users,                name='api_admin_users'),
    path('api/admin-users/<int:id>/',                 admin_user_detail,          name='api_admin_user_detail'),
    path('api/admin-vehicles/',                       admin_vehicles,             name='api_admin_vehicles'),
    path('api/admin-vehicles/<int:id>/',              admin_vehicle_detail,       name='api_admin_vehicle_detail'),
    path('api/admin-vehicles/<int:id>/availability/', check_vehicle_availability, name='api_vehicle_availability'),
    path('api/admin-fleets/',                         admin_fleets,               name='api_admin_fleets'),
    path('api/admin-bookings/',                       admin_bookings,             name='api_admin_bookings'),
    path('api/admin-bookings/<int:id>/',              admin_booking_action,       name='api_admin_booking_action'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)