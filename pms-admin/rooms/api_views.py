from rest_framework.views import APIView
from rest_framework.response import Response

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
            many=True
        )

        return Response(serializer.data)


class RoomListAPIView(APIView):

    def get(self, request):

        hotel_id = request.GET.get("hotel")

        rooms = Room.objects.select_related(
            "hotel",
            "room_type"
        ).all()

        if hotel_id:

            rooms = rooms.filter(
                hotel_id=hotel_id
            )

        serializer = RoomSerializer(
            rooms,
            many=True
        )

        return Response(serializer.data)