from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone

from .models import Vehicle, Fleet, EmployeeProfile, VehicleBooking
from .serializers import (
    VehicleSerializer, UserSerializer,
    FleetSerializer, BookingSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def jwt_login(request):
    """User login — rejects admins/superusers"""
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None and not user.is_superuser:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': 'user',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })

    if user and user.is_superuser:
        return Response({'error': 'Use the admin login endpoint'}, status=403)

    return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_jwt_login(request):
    """Admin login — rejects regular users"""
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None and user.is_superuser:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': 'admin',
            'admin': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })

    if user and not user.is_superuser:
        return Response({'error': 'Use the user login endpoint'}, status=403)

    return Response({'error': 'Invalid admin credentials'}, status=401)


# ─── DASHBOARD ───────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    return Response({
        "admin": {
            "id":    request.user.id,
            "name":  request.user.username,
            "email": request.user.email,
        },
        "stats": {
            "totalVehicles":   Vehicle.objects.count(),
            "totalUsers":      User.objects.count(),
            "totalFleets":     Fleet.objects.count(),
            "totalBookings":   VehicleBooking.objects.count(),
            "pendingBookings": VehicleBooking.objects.filter(status='Pending').count(),
            "ongoingBookings": VehicleBooking.objects.filter(status='Ongoing').count(),
        }
    })


# ─── USERS ───────────────────────────────────────────────────
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_users(request):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    if request.method == 'GET':
        users = User.objects.all().select_related('profile')
        return Response(UserSerializer(users, many=True).data)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_user_detail(request, id):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ─── VEHICLES ────────────────────────────────────────────────
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_vehicles(request):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    if request.method == 'GET':
        return Response(VehicleSerializer(Vehicle.objects.all(), many=True).data)

    serializer = VehicleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_vehicle_detail(request, id):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    try:
        vehicle = Vehicle.objects.get(id=id)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found"}, status=404)

    if request.method == 'PUT':
        serializer = VehicleSerializer(vehicle, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    vehicle.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ─── FLEETS ──────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_fleets(request):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    return Response(FleetSerializer(Fleet.objects.all(), many=True).data)


# ─── BOOKINGS ────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_bookings(request):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    bookings = VehicleBooking.objects.all()\
        .select_related('user', 'vehicle', 'user__profile')\
        .order_by('-created_at')
    return Response(BookingSerializer(bookings, many=True).data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_booking_action(request, id):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    try:
        booking = VehicleBooking.objects.get(id=id)
    except VehicleBooking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    new_status  = request.data.get('status')
    admin_notes = request.data.get('admin_notes', booking.admin_notes)

    if new_status == 'Approved':
        conflict = VehicleBooking.objects.filter(
            vehicle=booking.vehicle,
            status__in=['Approved', 'Ongoing'],
            start_datetime__lt=booking.end_datetime,
            end_datetime__gt=booking.start_datetime,
        ).exclude(id=booking.id).exists()
        if conflict:
            return Response({"error": "Vehicle already booked for that time slot."}, status=400)

    if new_status == 'Returned':
        booking.actual_return        = timezone.now()
        booking.vehicle.is_available = True
        booking.vehicle.save()

    if new_status == 'Ongoing':
        booking.vehicle.is_available = False
        booking.vehicle.save()

    booking.status      = new_status
    booking.admin_notes = admin_notes
    booking.save()

    return Response(BookingSerializer(booking).data)


# ─── AVAILABILITY ────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_vehicle_availability(request, id):
    if not request.user.is_superuser:
        return Response({'error': 'Admin only'}, status=403)

    bookings = VehicleBooking.objects.filter(
        vehicle_id=id,
        status__in=['Approved', 'Ongoing']
    ).order_by('start_datetime')
    return Response(BookingSerializer(bookings, many=True).data)