from django.contrib import admin
from .models import Guest, Reservation


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):

    list_display = (
        "guest_id",
        "first_name",
        "last_name",
        "phone",
        "email",
        "identity_type",
        "city",
        "created_at",
    )

    list_filter = (
        "identity_type",
        "city",
    )

    search_fields = (
        "guest_id",
        "first_name",
        "last_name",
        "phone",
        "email",
        "identity_number",
        "company_name",
        "gst_number",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):

    list_display = (
        "reservation_number",
        "hotel",
        "guest",
        "room",
        "check_in",
        "check_out",
        "adults",
        "children",
        "total_amount",
        "advance_amount",
        "status",
        "booking_source",
    )

    list_filter = (
        "hotel",
        "status",
        "booking_source",
        "check_in",
        "check_out",
    )

    search_fields = (
        "reservation_number",
        "guest__first_name",
        "guest__last_name",
        "guest__phone",
        "guest__email",
        "room__room_number",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    date_hierarchy = "check_in"

    list_per_page = 25