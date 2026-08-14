from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from django.db.models import Q

from .models import Guest, Reservation
from rooms.models import Room


class GuestSerializer(serializers.ModelSerializer):

    guest_name = serializers.SerializerMethodField()
    visits = serializers.SerializerMethodField()

    class Meta:

        model = Guest

        fields = [
            "id",
            "guest_id",

            "guest_name",

            "first_name",
            "last_name",

            "phone",
            "email",

            "date_of_birth",

            "identity_type",
            "identity_number",

            "company_name",
            "gst_number",

            "address",
            "pincode",
            "city",
            "status",

            "visits",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "guest_id",
            "guest_name",
            "visits",
            "created_at",
            "updated_at",
        ]


    def get_guest_name(self, obj):

        return " ".join(
            filter(
                None,
                [
                    obj.first_name,
                    obj.last_name
                ]
            )
        )


    def get_visits(self, obj):

        return obj.reservations.count()


class ReservationSerializer(serializers.ModelSerializer):

    guest_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()

    identity_type = serializers.CharField(
        source="guest.identity_type",
        read_only=True
    )

    identity_number = serializers.CharField(
        source="guest.identity_number",
        read_only=True
    )

    address = serializers.CharField(
        source="guest.address",
        read_only=True
    )

    room_number = serializers.CharField(
        source="room.room_number",
        read_only=True
    )

    room_type = serializers.CharField(
        source="room.room_type.name",
        read_only=True
    )

    room_type_id = serializers.IntegerField(
        source="room.room_type.id",
        read_only=True
    )

    hotel_name = serializers.CharField(
        source="hotel.name",
        read_only=True
    )

    balance_amount = serializers.ReadOnlyField()

    class Meta:
        model = Reservation

        fields = [
            "id",
            "reservation_number",

            "hotel",
            "hotel_name",

            "guest",
            "guest_name",
            "phone",
            "email",

            "identity_type",
            "identity_number",
            "address",

            "room",
            "room_number",
            "room_type",
            "room_type_id",

            "check_in",
            "check_out",

            "adults",
            "children",
            "number_of_rooms",

            "room_rate",
            "total_amount",
            "advance_amount",
            "balance_amount",

            "payment_status",
            "status",

            "booking_source",
            "special_requests",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "reservation_number",
            "balance_amount",
            "hotel_name",
            "guest_name",
            "phone",
            "email",
            "identity_type",
            "identity_number",
            "address",
            "room_number",
            "room_type",
            "room_type_id",
        ]

    def get_guest_name(self, obj):

        if not obj.guest:
            return ""

        name = " ".join(
            filter(
                None,
                [
                    obj.guest.first_name,
                    obj.guest.last_name,
                ]
            )
        )

        return name

    def get_phone(self, obj):

        if obj.guest:
            return obj.guest.phone or ""

        return ""

    def get_email(self, obj):

        if obj.guest:
            return obj.guest.email or ""

        return ""

    def validate(self, attrs):

        room = attrs.get("room")
        hotel = attrs.get("hotel")
        check_in = attrs.get("check_in")
        check_out = attrs.get("check_out")

        # --------------------------------
        # Check dates
        # --------------------------------

        if check_in and check_out:

            if check_out <= check_in:
                raise serializers.ValidationError({
                    "check_out":
                        "Check-out must be after check-in."
                })

        # --------------------------------
        # Room belongs to selected hotel
        # --------------------------------

        if room and hotel:

            if room.hotel_id != hotel.id:
                raise serializers.ValidationError({
                    "room":
                        "Selected room does not belong to this hotel."
                })

        # --------------------------------
        # Room type belongs to hotel
        # --------------------------------

        if room and hotel:

            if room.room_type.hotel_id != hotel.id:
                raise serializers.ValidationError({
                    "room":
                        "Selected room type does not belong to this hotel."
                })

        # --------------------------------
        # Check room availability
        # --------------------------------

        if room and check_in and check_out:

            overlapping = Reservation.objects.filter(
                room=room,
                check_in__lt=check_out,
                check_out__gt=check_in,
            ).exclude(
                status__in=[
                    "cancelled",
                    "checked_out",
                    "no_show",
                ]
            )

            if self.instance:
                overlapping = overlapping.exclude(
                    pk=self.instance.pk
                )

            if overlapping.exists():

                raise serializers.ValidationError({
                    "room":
                        "This room is already reserved for the selected dates."
                })

        return attrs

    def create(self, validated_data):

        year = timezone.now().year

        last_reservation = (
            Reservation.objects
            .filter(
                reservation_number__startswith=f"RES{year}"
            )
            .order_by("-id")
            .first()
        )

        if last_reservation:

            try:
                last_number = int(
                    last_reservation.reservation_number[-4:]
                )

            except (ValueError, TypeError):
                last_number = 0

        else:
            last_number = 0

        next_number = last_number + 1

        validated_data["reservation_number"] = (
            f"RES{year}{next_number:04d}"
        )

        return Reservation.objects.create(
            **validated_data
        )