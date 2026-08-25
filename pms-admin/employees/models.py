from django.db import models
from django.contrib.auth.models import User, Group

class RoleExtension(models.Model):
    """Extends Django's built-in Group to store extra fields like description and status."""
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name="extension")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.group.name


class Employee(models.Model):
    DEPARTMENT_CHOICES = [
        ("front_office", "Front Office"),
        ("housekeeping", "Housekeeping"),
        ("accounts", "Accounts"),
        ("management", "Management"),
        ("maintenance", "Maintenance"),
        ("other", "Other"),
    ]

    EMPLOYMENT_STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("on_leave", "On Leave"),
    ]

    hotel = models.ForeignKey(
        "hotels.Hotel",
        on_delete=models.CASCADE,
        related_name="employees"
    )

    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employee"
    )

    # Link Employee to a Role (Django Group)
    role = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees"
    )

    employee_id = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    designation = models.CharField(max_length=100)
    joining_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=30, choices=EMPLOYMENT_STATUS_CHOICES, default="active")
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["first_name"]

    def __str__(self):
        return f"{self.employee_id} - {self.first_name} {self.last_name}"