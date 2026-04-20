from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Vehicle, Fleet, EmployeeProfile, VehicleBooking


class EmployeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeProfile
        fields = ['employee_id', 'department', 'phone']


class UserSerializer(serializers.ModelSerializer):
    profile = EmployeeProfileSerializer(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff', 'profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password')

        # ✅ create_user hashes the password properly
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        EmployeeProfile.objects.update_or_create(user=user, defaults=profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # ✅ only update password if a new one was provided
        if password:
            instance.set_password(password)

        instance.save()

        if profile_data:
            EmployeeProfile.objects.update_or_create(user=instance, defaults=profile_data)

        return instance

class VehicleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Vehicle
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return f'http://localhost:8000{obj.image.url}'
        return None
        
class FleetSerializer(serializers.ModelSerializer):
    vehicle_count = serializers.SerializerMethodField()

    class Meta:
        model = Fleet
        fields = ['id', 'name', 'vehicle_count']

    def get_vehicle_count(self, obj):
        return obj.vehicles.count()


class BookingSerializer(serializers.ModelSerializer):
    user_name        = serializers.CharField(source='user.username', read_only=True)
    employee_id      = serializers.CharField(source='user.profile.employee_id', read_only=True)
    vehicle_name     = serializers.CharField(source='vehicle.name', read_only=True)
    vehicle_plate    = serializers.CharField(source='vehicle.plate_number', read_only=True)

    class Meta:
        model = VehicleBooking
        fields = '__all__'