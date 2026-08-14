from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):

    list_display = (
        "employee_id",
        "first_name",
        "last_name",
        "hotel",
        "department",
        "designation",
        "phone",
        "joining_date",
        "status",
    )

    list_filter = (
        "hotel",
        "department",
        "status",
        "joining_date",
    )

    search_fields = (
        "employee_id",
        "first_name",
        "last_name",
        "phone",
        "email",
        "designation",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25