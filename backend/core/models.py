from django.db import models
from django.contrib.auth.models import User

class EmployeeProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.employee_id} - {self.user.username}"


class Fleet(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    CONDITION_CHOICES = [
        ('Good',         'Good'),
        ('Fair',         'Fair'),
        ('Under Repair', 'Under Repair'),
        ('Out of Service', 'Out of Service'),
    ]

    fleet        = models.ForeignKey(Fleet, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicles')
    name         = models.CharField(max_length=100)
    plate_number = models.CharField(max_length=20, unique=True)
    model        = models.CharField(max_length=100, blank=True)
    year         = models.IntegerField(null=True, blank=True)
    condition    = models.CharField(max_length=50, choices=CONDITION_CHOICES, default='Good')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.plate_number})"


class VehicleBooking(models.Model):
    STATUS_CHOICES = [
        ('Pending',   'Pending'),
        ('Approved',  'Approved'),
        ('Rejected',  'Rejected'),
        ('Ongoing',   'Ongoing'),
        ('Returned',  'Returned'),
    ]

    vehicle      = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='bookings')
    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    purpose      = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime   = models.DateTimeField()
    actual_return  = models.DateTimeField(null=True, blank=True)
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    admin_notes    = models.TextField(blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} -> {self.vehicle.plate_number} ({self.start_datetime})"