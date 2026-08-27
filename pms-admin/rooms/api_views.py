from rest_framework.views import APIView
from rest_framework.response import Response
from .services import update_cleaning_rooms
from .models import RoomType, Room
from .serializers import (
    RoomTypeSerializer,
    RoomSerializer
)


class RoomTypeListAPIView(APIView):

    def get(self, request):

        hotel_id = request.GET.get("hotel")

        room_types = RoomType.objects.select_related(
            "hotel"
        ).all()

        if hotel_id:

            room_types = room_types.filter(
                hotel_id=hotel_id
            )

        serializer = RoomTypeSerializer(
            room_types,
            many=True,
            context={
        "request": request
    }
        )

        return Response(serializer.data)


class RoomListAPIView(APIView):

    def get(self, request):

        # Automatically release rooms whose
        # cleaning period has finished.
        update_cleaning_rooms()

        rooms = Room.objects.select_related(
            "hotel",
            "room_type"
        ).all()

        hotel_id = request.GET.get("hotel")

        if hotel_id:
            rooms = rooms.filter(
                hotel_id=hotel_id
            )

        status_filter = request.GET.get("status")

        if status_filter:
            rooms = rooms.filter(
                status=status_filter
            )

        search = request.GET.get(
            "search",
            ""
        ).strip()

        if search:
            rooms = rooms.filter(
                room_number__icontains=search
            )

        serializer = RoomSerializer(
            rooms,
            many=True
        )

        return Response(serializer.data)