from django.contrib import admin
from .models import PMSSettings


@admin.register(PMSSettings)
class PMSSettingsAdmin(admin.ModelAdmin):

    list_display = (
        "hotel",
        "currency",
        "tax_percentage",
        "check_in_time",
        "check_out_time",
        "updated_at",
    )

    list_filter = (
        "currency",
    )

    search_fields = (
        "hotel__name",
        "hotel__code",
        "hotel_email",
        "hotel_phone",
    )

    readonly_fields = (
        "updated_at",
    )