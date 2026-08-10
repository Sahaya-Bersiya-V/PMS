# from django.contrib import admin
# from .models import Room, RoomType


# @admin.register(Room)
# class RoomAdmin(admin.ModelAdmin):

#     list_display = (
#         "hotel",
#         "room_number",
#         "room_type",
#         "floor",
#         "capacity",
#         "price_per_night",
#         "status",
#     )

#     list_filter = (
#         "hotel",
#         "room_type",
#         "status",
#     )

#     search_fields = (
#         "room_number",
#         "hotel__name",
#     )


# @admin.register(RoomType)
# class RoomTypeAdmin(admin.ModelAdmin):

#     list_display = (
#         "hotel",
#         "name",
#     )

#     list_filter = (
#         "hotel",
#     )