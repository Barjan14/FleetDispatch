from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Driver, Fleet, AdminUser

@api_view(['POST'])
def user_login(request):
    """User login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=HTTP_401_UNAUTHORIZED)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }
    }, status=HTTP_200_OK)

@api_view(['POST'])
def admin_login(request):
    """Admin login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=HTTP_401_UNAUTHORIZED)
    
    # Check if user is admin
    try:
        admin_user = AdminUser.objects.get(user=user)
    except AdminUser.DoesNotExist:
        return Response({'error': 'User is not an admin'}, status=HTTP_401_UNAUTHORIZED)
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'token': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_super_admin': admin_user.is_super_admin,
        }
    }, status=HTTP_200_OK)

@api_view(['GET'])
def admin_dashboard(request):
    """Admin dashboard data endpoint"""
    if not request.user.is_authenticated:
        return Response({'error': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
    
    try:
        admin_user = AdminUser.objects.get(user=request.user)
    except AdminUser.DoesNotExist:
        return Response({'error': 'User is not an admin'}, status=HTTP_401_UNAUTHORIZED)
    
    # Get dashboard statistics
    total_drivers = Driver.objects.count()
    total_vehicles = Fleet.objects.count()
    active_vehicles = Fleet.objects.filter(status='in_use').count()
    maintenance_vehicles = Fleet.objects.filter(status='maintenance').count()
    
    return Response({
        'total_drivers': total_drivers,
        'total_vehicles': total_vehicles,
        'active_vehicles': active_vehicles,
        'maintenance_vehicles': maintenance_vehicles,
    }, status=HTTP_200_OK)

@api_view(['GET'])
def user_dashboard(request):
    """User dashboard data endpoint"""
    if not request.user.is_authenticated:
        return Response({'error': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
    
    # Get user dashboard statistics
    return Response({
        'message': 'Welcome to user dashboard',
        'user': request.user.username,
    }, status=HTTP_200_OK)
