from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Hotel
from .serializers import HotelSerializer


class HotelListAPIView(APIView):

    def get(self, request):
        hotels = Hotel.objects.all().order_by("name")

        serializer = HotelSerializer(
            hotels,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = HotelSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )