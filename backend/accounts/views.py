from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import user_passes_test
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# 👤 USER LOGIN
def user_login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user and not user.is_superuser:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'accounts/login.html', {
                'error': 'Invalid credentials or not a user account'
            })

    return render(request, 'accounts/login.html')


# 👑 ADMIN LOGIN
def admin_login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user and user.is_superuser:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'accounts/admin_login.html', {
                'error': 'Invalid admin credentials'
            })

    return render(request, 'accounts/admin_login.html')


# 🚪 LOGOUT
def logout_view(request):
    logout(request)
    return redirect('login')


# 🧑‍💻 DASHBOARD
@login_required
def dashboard(request):
    if request.user.is_superuser:
        return render(request, 'accounts/admin_dashboard.html')
    return render(request, 'accounts/user_dashboard.html')


def is_admin(user):
    return user.is_superuser

@user_passes_test(is_admin)
def admin_dashboard(request):
    return render(request, 'accounts/admin_dashboard.html')

@login_required
def dashboard(request):
    if request.user.is_superuser:
        return redirect('admin_dashboard')
    return render(request, 'accounts/user_dashboard.html')


@api_view(['POST'])
def jwt_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': 'admin' if user.is_superuser else 'user',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })
    
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        'message': f'Hello {request.user.username}',
        'role': 'admin' if request.user.is_superuser else 'user'
    })


# 📊 USER PROFILE / DASHBOARD API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get user profile and dashboard data"""
    if request.user.is_superuser:
        return Response({'error': 'Admin users should use admin-dashboard endpoint'}, status=403)
    
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'stats': {
            'activeFleets': 3,
            'totalTrips': 45,
            'totalDistance': 2500,
            'fuelExpense': 750.50
        }
    })


# 👑 ADMIN DASHBOARD API
@api_view(['POST'])
def admin_jwt_login(request):
    """Admin login with JWT"""
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None and user.is_superuser:
        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'admin': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        })
    
    return Response({'error': 'Invalid admin credentials'}, status=401)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_data(request):
    """Get admin dashboard data"""
    if not request.user.is_superuser:
        return Response({'error': 'Only admins can access this endpoint'}, status=403)
    
    from django.contrib.auth.models import User
    
    total_users = User.objects.filter(is_superuser=False).count()
    admin_count = User.objects.filter(is_superuser=True).count()
    
    return Response({
        'admin': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        },
        'stats': {
            'totalUsers': total_users,
            'totalFleets': 45,
            'totalTrips': 2340,
            'totalRevenue': 45600.75,
            'activeVehicles': 180,
            'systemStatus': 'Online'
        },
        'users': [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'created_at': user.date_joined.isoformat()
            }
            for user in User.objects.filter(is_superuser=False)[:20]
        ],
        'fleets': [
            {
                'id': 1,
                'name': 'Fleet A',
                'owner': 'Company A',
                'vehicle_count': 15
            },
            {
                'id': 2,
                'name': 'Fleet B',
                'owner': 'Company B',
                'vehicle_count': 22
            }
        ]
    })

    