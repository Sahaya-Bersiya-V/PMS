from django.contrib import admin
from .models import Hotel


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "code",
        "city",
        "state",
        "phone",
        "email",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "state",
        "city",
    )

    search_fields = (
        "name",
        "code",
        "city",
        "state",
        "phone",
        "email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )