from rest_framework import serializers
from .models import Hotel


class HotelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hotel
        fields = [
            "id",
            "code",
            "name",
            "address",
            "city",
            "state",
            "country",
            "pincode",
            "phone",
            "email",
            "description",
            "status",
        ]