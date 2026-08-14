from django.contrib import admin
from .models import RoomType, Room


@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "capacity",
        "base_price",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "amenities",
    )

    list_filter = (
        "capacity",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):

    list_display = (
        "room_number",
        "hotel",
        "room_type",
        "floor",
        "price",
        "status",
        "created_at",
    )

    list_filter = (
        "hotel",
        "room_type",
        "status",
        "floor",
    )

    search_fields = (
        "room_number",
        "hotel__name",
        "room_type__name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25