from rest_framework import serializers

from .models import RoomType, Room


class RoomTypeSerializer(
    serializers.ModelSerializer
):

    hotel_name = serializers.CharField(
        source="hotel.name",
        read_only=True
    )

    status = serializers.CharField(
        source="hotel.status",
        read_only=True
    )

    total_rooms = serializers.SerializerMethodField()

    class Meta:
        model = RoomType

        fields = [
            "id",

            "hotel",
            "hotel_name",

            "name",

            "description",

            "capacity",

            "base_price",

            "amenities",

            "total_rooms",

            "status",

            "created_at",
            "updated_at",
        ]

    def get_total_rooms(self, obj):

        return obj.rooms.count()

class RoomSerializer(
    serializers.ModelSerializer
):

    hotel_name = serializers.CharField(
        source="hotel.name",
        read_only=True
    )

    room_type_name = serializers.CharField(
        source="room_type.name",
        read_only=True
    )

    capacity = serializers.IntegerField(
        source="room_type.capacity",
        read_only=True
    )

    class Meta:
        model = Room

        fields = [
            "id",

            "hotel",
            "hotel_name",

            "room_type",
            "room_type_name",

            "room_number",
            "floor",

            "capacity",

            "status",
            "price",
            "notes",

            "created_at",
            "updated_at",
        ]