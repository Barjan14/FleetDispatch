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
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'role': 'admin' if user.is_superuser else 'user'
        })
    
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({
        'message': f'Hello {request.user.username}',
        'role': 'admin' if request.user.is_superuser else 'user'
    })

    