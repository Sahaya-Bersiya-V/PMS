from django.shortcuts import render,get_object_or_404
from django.db import transaction
from django.db.models import Q, Sum
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import time
from hotels.models import Hotel
from rooms.models import Room, RoomType
from datetime import timedelta
from .models import Guest, Reservation
from .serializers import (
    GuestSerializer,
    ReservationSerializer
)
from billing.models import Invoice, Payment,Refund
from django.core.paginator import Paginator


def normalize_datetime(value):
    """
    Convert incoming datetime strings to timezone-aware datetime objects.
    If value is already a datetime, return it as-is after making it aware.
    """

    if not value:
        return value

    # Already a datetime object
    if hasattr(value, "tzinfo"):
        if timezone.is_naive(value):
            return timezone.make_aware(value)

        return value

    # Convert string to datetime
    parsed = parse_datetime(str(value))

    if parsed is None:
        raise ValueError(
            f"Invalid datetime value: {value}"
        )

    # Make naive datetime timezone-aware
    if timezone.is_naive(parsed):
        parsed = timezone.make_aware(parsed)

    return parsed
def reservation_ui_detail(request, pk):

    reservation = get_object_or_404(
        Reservation.objects.select_related(
            "hotel",
            "guest",
            "room",
            "room__room_type",
        ),
        pk=pk
    )

    context = {
        "reservation": reservation,
    }

    return render(
        request,
        "reservations/reservation_detail.html",
        context
    )
# =========================================================
# GUEST SEARCH
# =========================================================

class GuestListView(APIView):

    def get(self, request):

        search = request.GET.get(
            "search",
            ""
        ).strip()

        guests = Guest.objects.all()

        if search:

            guests = guests.filter(

                Q(
                    first_name__icontains=search
                )

                |

                Q(
                    last_name__icontains=search
                )

                |

                Q(
                    phone__icontains=search
                )

                |

                Q(
                    email__icontains=search
                )

                |

                Q(
                    guest_id__icontains=search
                )

                |

                Q(
                    identity_number__icontains=search
                )

                |

                Q(
                    city__icontains=search
                )

            )

        guests = guests.order_by(
            "first_name"
        )

        serializer = GuestSerializer(
            guests,
            many=True
        )

        return Response(
            serializer.data
        )


def create_invoice_for_reservation(reservation):
    """
    Create or update the invoice for a reservation.

    Billing calculation:
        Subtotal = room rate × number of nights
        Taxable Amount = subtotal - discount
        Tax = 18% of taxable amount
        Grand Total = taxable amount + tax
    """

    from decimal import Decimal
    from django.utils import timezone

    # -----------------------------------------
    # BILLING CALCULATION
    # -----------------------------------------

    room_rate = Decimal(
        str(reservation.room_rate or 0)
    )

    # Calculate number of nights
    # -----------------------------------------
# CALCULATE NUMBER OF NIGHTS
# -----------------------------------------

    check_in = normalize_datetime(
        reservation.check_in
    )

    check_out = normalize_datetime(
        reservation.check_out
    )

    if check_in and check_out:

        difference = check_out - check_in

        nights = max(
            0,
            difference.days
        )

    else:

        nights = 0

    # Prevent zero-night calculation
    if nights <= 0:
        nights = 1

    subtotal = (
        room_rate * Decimal(nights)
    )
    # -----------------------------------------
    # DISCOUNT
    # -----------------------------------------
    discount_amount = Decimal("0.00")

    # Your current Reservation model does not
    # appear to store discount separately.
    # Therefore use zero unless you add a
    # discount field to Reservation.
    
    taxable_amount = max(
        Decimal("0.00"),
        subtotal - discount_amount
    )

    # -----------------------------------------
    # TAX - 18%
    # -----------------------------------------

    tax_amount = (
        taxable_amount * Decimal("0.18")
    ).quantize(
        Decimal("0.01")
    )

    # -----------------------------------------
    # GRAND TOTAL
    # -----------------------------------------

    total_amount = (
        taxable_amount + tax_amount
    ).quantize(
        Decimal("0.01")
    )

    # -----------------------------------------
    # INVOICE NUMBER
    # -----------------------------------------

    invoice_number = (
        f"INV{reservation.reservation_number.replace('RES', '')}"
    )

    # -----------------------------------------
    # CREATE / GET INVOICE
    # -----------------------------------------

    invoice, created = Invoice.objects.get_or_create(
        reservation=reservation,
        defaults={
            "invoice_number": invoice_number,
            "guest": reservation.guest,

            "subtotal": subtotal,

            "tax_amount": tax_amount,

            "discount_amount": discount_amount,

            "total_amount": total_amount,

            "paid_amount": (
                reservation.advance_amount
            ),

            "status": (
                "paid"
                if reservation.payment_status == "paid"
                else "partially_paid"
                if reservation.advance_amount > 0
                else "unpaid"
            ),
        }
    )

    # -----------------------------------------
    # UPDATE EXISTING INVOICE
    # -----------------------------------------

    if not created:

        invoice.guest = reservation.guest

        invoice.subtotal = subtotal

        invoice.tax_amount = tax_amount

        invoice.discount_amount = discount_amount

        invoice.total_amount = total_amount

        if reservation.payment_status == "paid":

            invoice.paid_amount = total_amount

            invoice.status = "paid"

        else:

            invoice.paid_amount = (
                reservation.advance_amount
            )

            invoice.status = (
                "partially_paid"
                if reservation.advance_amount > 0
                else "unpaid"
            )

        invoice.save()

    # -----------------------------------------
    # CREATE PAYMENT
    # -----------------------------------------

    if reservation.payment_status == "paid":

        payment = Payment.objects.filter(
            invoice=invoice,
            status="successful"
        ).first()

        if not payment:

            payment = Payment.objects.create(
                invoice=invoice,
                amount=invoice.total_amount,
                payment_method="cash",
                status="successful",
                notes=(
                    "Cash payment received "
                    "during reservation"
                )
            )

        # -----------------------------------------
        # TRANSACTION ID
        # -----------------------------------------

        if not payment.transaction_id:

            payment.transaction_id = (
                f"TXN{timezone.now().year}"
                f"{payment.id:04d}"
            )

            payment.save(
                update_fields=[
                    "transaction_id"
                ]
            )

    return invoice


def create_refund_for_reservation(reservation):
    """
    Create a refund request when a paid reservation is cancelled.
    """

    # Only paid reservations can have refunds
    if reservation.payment_status != "paid":
        return None

    # Get the invoice
    try:
        invoice = reservation.invoice
    except Invoice.DoesNotExist:
        invoice = create_invoice_for_reservation(
            reservation
        )

    # Prevent duplicate refund requests
    existing_refund = Refund.objects.filter(
        invoice=invoice
    ).first()

    if existing_refund:
        return existing_refund

    # Refund the amount actually paid
    refund_amount = invoice.paid_amount

    if refund_amount <= 0:
        return None

    # -----------------------------------------
    # CREATE REFUND
    # -----------------------------------------

    refund = Refund.objects.create(
        refund_number="TEMP",
        invoice=invoice,
        amount=refund_amount,
        reason="Room reservation cancelled",
        status="pending"
    )

    # -----------------------------------------
    # GENERATE REFUND NUMBER
    # -----------------------------------------

    refund.refund_number = (
        f"REF{timezone.now().year}{refund.id:04d}"
    )

    refund.save(
        update_fields=["refund_number"]
    )

    return refund
# =========================================================
# RESERVATION LIST + CREATE
# =========================================================

class ReservationListCreateView(APIView):

    def get(self, request):

        reservations = Reservation.objects.select_related(
            "hotel",
            "guest",
            "room",
            "room__room_type",
        ).all()

        # -----------------------------
        # Search
        # -----------------------------

        search = request.GET.get(
            "search",
            ""
        ).strip()

        if search:

            reservations = reservations.filter(
                Q(reservation_number__icontains=search)
                |
                Q(guest__first_name__icontains=search)
                |
                Q(guest__last_name__icontains=search)
                |
                Q(guest__phone__icontains=search)
                |
                Q(room__room_number__icontains=search)
            )

        # -----------------------------
        # Hotel
        # -----------------------------

        hotel = request.GET.get("hotel")

        if hotel:
            reservations = reservations.filter(
                hotel_id=hotel
            )

        # -----------------------------
        # Status
        # -----------------------------

        reservation_status = request.GET.get(
            "status"
        )

        if reservation_status:

            reservations = reservations.filter(
                status=reservation_status
            )

        # -----------------------------
        # Payment
        # -----------------------------

        payment = request.GET.get(
            "payment"
        )

        if payment:

            reservations = reservations.filter(
                payment_status=payment
            )

        # -----------------------------
        # Check-in date
        # -----------------------------

        check_in = request.GET.get(
            "check_in"
        )

        if check_in:

            reservations = reservations.filter(
                check_in__date__gte=check_in
            )

        # -----------------------------
        # Check-out date
        # -----------------------------

        check_out = request.GET.get(
            "check_out"
        )

        if check_out:

            reservations = reservations.filter(
                check_out__date__lte=check_out
            )

        serializer = ReservationSerializer(
            reservations,
            many=True
        )

        return Response(
            serializer.data
        )

    # =================================
    # CREATE RESERVATION
    # =================================

    @transaction.atomic
    def post(self, request):

        data = request.data.copy()

        # --------------------------------
        # Guest
        # --------------------------------

        guest_data = data.pop("guest", None)

        if not guest_data:
            return Response(
                {
                    "error": "Guest information is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # --------------------------------
        # FIND EXISTING GUEST
        # --------------------------------

        guest_id = guest_data.get("id")

        phone = str(
            guest_data.get("phone") or ""
        ).strip()

        identity_type = str(
            guest_data.get("identity_type") or ""
        ).strip()

        identity_number = str(
            guest_data.get("identity_number") or ""
        ).strip()


        guest = None


        # 1. Existing guest ID
        if guest_id:
            try:
                guest = Guest.objects.get(
                    pk=guest_id
                )
            except Guest.DoesNotExist:
                guest = None


        # 2. Search by phone
        if not guest and phone:
            guest = Guest.objects.filter(
                phone=phone
            ).first()


        # 3. Search by identity
        if (
            not guest
            and identity_type
            and identity_number
        ):
            guest = Guest.objects.filter(
                identity_type=identity_type,
                identity_number=identity_number,
            ).first()


        # --------------------------------
        # CREATE OR UPDATE GUEST
        # --------------------------------

        if guest:

            guest.first_name = (
                guest_data.get(
                    "first_name"
                ) or guest.first_name
            )

            guest.last_name = (
                guest_data.get(
                    "last_name"
                ) or guest.last_name
            )

            guest.phone = (
                guest_data.get(
                    "phone"
                ) or guest.phone
            )

            guest.email = (
                guest_data.get(
                    "email"
                ) or guest.email
            )

            guest.identity_type = (
                guest_data.get(
                    "identity_type"
                ) or guest.identity_type
            )

            guest.identity_number = (
                guest_data.get(
                    "identity_number"
                ) or guest.identity_number
            )

            guest.address = (
                guest_data.get(
                    "address"
                ) or guest.address
            )

            guest.save()

        else:

            guest_data.pop(
                "id",
                None
            )

            if not guest_data.get(
                "guest_id"
            ):
                guest_data["guest_id"] = (
                    guest_data.get("guest_id")
                    or
                    f"G{int(time.time())}"
                )

            guest_serializer = GuestSerializer(
                data=guest_data
            )

            guest_serializer.is_valid(
                raise_exception=True
            )

            guest = guest_serializer.save()

        # --------------------------------
        # Generate reservation number
        # --------------------------------
    
        
        data["guest"] = guest.id

        # --------------------------------
        # Payment logic
        # --------------------------------

        total_amount = float(
            data.get(
                "total_amount",
                0
            )
        )

        advance_amount = float(
            data.get(
                "advance_amount",
                0
            )
        )

        if advance_amount >= total_amount and total_amount > 0:

            data["payment_status"] = "paid"
            data["status"] = "confirmed"

        else:

            data["payment_status"] = "pending"
            data["status"] = "pending"

        # --------------------------------
        # Create reservation
        # --------------------------------

        serializer = ReservationSerializer(
            data=data
        )

        serializer.is_valid(
            raise_exception=True
        )

        reservation = serializer.save()

        create_invoice_for_reservation(
    reservation
)

        # --------------------------------
        # Update room status
        # --------------------------------

        room = reservation.room

        if reservation.status == "confirmed":

            room.status = "reserved"

            room.save(
                update_fields=[
                    "status",
                    "updated_at"
                ]
            )

        return Response(
            ReservationSerializer(
                reservation
            ).data,
            status=status.HTTP_201_CREATED
        )
# =========================================================
# AVAILABLE ROOMS
# =========================================================

class AvailableRoomsView(APIView):

    def get(self, request):

        hotel_id = request.GET.get(
            "hotel"
        )

        room_type_id = request.GET.get(
            "room_type"
        )

        check_in = request.GET.get(
            "check_in"
        )

        check_out = request.GET.get(
            "check_out"
        )

        # --------------------------------
        # Required fields
        # --------------------------------

        if not hotel_id:

            return Response(
                {
                    "error":
                    "Hotel is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not room_type_id:

            return Response(
                {
                    "error":
                    "Room type is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not check_in or not check_out:

            return Response(
                {
                    "error":
                    "Check-in and check-out dates are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # --------------------------------
        # Find rooms
        # --------------------------------

        rooms = Room.objects.select_related(
            "hotel",
            "room_type"
        ).filter(
            hotel_id=hotel_id,
            room_type_id=room_type_id,
            status__in=[
                "available",
        
            ]
        )

        # --------------------------------
        # Remove rooms with overlapping
        # reservations
        # --------------------------------

        reserved_room_ids = Reservation.objects.filter(

            check_in__lt=check_out,

            check_out__gt=check_in,

            status__in=[
                "pending",
                "confirmed",
                "checked_in",
            ]

        ).values_list(
            "room_id",
            flat=True
        )

        rooms = rooms.exclude(
            id__in=reserved_room_ids
        )

        data = []

        for room in rooms:

            data.append({

                "id": room.id,

                "room_number":
                    room.room_number,

                "floor":
                    room.floor,

                "status":
                    room.status,

                "price":
                    room.price,

                "room_type":
                    room.room_type.name,

                "capacity":
                    room.room_type.capacity,

                "hotel":
                    room.hotel.name,
            })

        return Response(data)
    # =========================================================
# RESERVATION DETAIL
# =========================================================

class ReservationDetailView(APIView):

    def get_object(self, pk):

        return Reservation.objects.select_related(
            "hotel",
            "guest",
            "room",
            "room__room_type"
        ).get(pk=pk)

    # =================================
    # GET RESERVATION
    # =================================

    def get(self, request, pk):

        try:

            reservation = self.get_object(pk)

        except Reservation.DoesNotExist:

            return Response(
                {
                    "error":
                        "Reservation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReservationSerializer(
            reservation
        )

        return Response(
            serializer.data
        )

    # =================================
    # UPDATE RESERVATION
    # =================================

    @transaction.atomic
    def patch(self, request, pk):

        try:
            reservation = self.get_object(pk)

        except Reservation.DoesNotExist:

            return Response(
            {
                "error": "Reservation not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

        data = request.data.copy()

    # =========================================
    # UPDATE GUEST
    # =========================================

        guest = reservation.guest
        guest_changed = False

        if "guest_name" in data:

            guest_name = str(
                data.get("guest_name") or ""
        ).strip()

            parts = guest_name.split(" ", 1)

            guest.first_name = (
            parts[0] if parts else ""
        )

            guest.last_name = (
            parts[1] if len(parts) > 1 else ""
        )

            guest_changed = True

        if "phone" in data:

            guest.phone = (
            data.get("phone") or ""
        )

            guest_changed = True

        if "email" in data:

            guest.email = (
            data.get("email") or ""
        )

            guest_changed = True
        if "identity_type" in data:

            guest.identity_type = (
                data.get("identity_type") or ""
            )

            guest_changed = True


        if "identity_number" in data:

            guest.identity_number = (
                data.get("identity_number") or ""
            )

            guest_changed = True


        if "address" in data:

            guest.address = (
                data.get("address") or ""
            )

            guest_changed = True

        

        if guest_changed:
            guest.save()

    # =========================================
    # BUILD UPDATE DATA
    # =========================================

        update_data = {}

        allowed_fields = [
        "hotel",
        "room",
        "check_in",
        "check_out",
        "adults",
        "children",
        "number_of_rooms",
        "room_rate",
        "total_amount",
        "advance_amount",
        "payment_status",
        "status",
        "booking_source",
        "special_requests",
    ]

        for field in allowed_fields:

            if field in data:
                update_data[field] = data[field]

    # =========================================
    # KEEP CURRENT VALUES FOR VALIDATION
    # =========================================

        hotel_id = update_data.get(
        "hotel",
        reservation.hotel_id
    )

        room_id = update_data.get(
        "room",
        reservation.room_id
    )

        check_in = normalize_datetime(
    update_data.get(
                "check_in",
                reservation.check_in
            )
        )

        check_out = normalize_datetime(
            update_data.get(
                "check_out",
                reservation.check_out
            )
        )

    # =========================================
    # VALIDATE HOTEL
    # =========================================

        try:

            hotel = Hotel.objects.get(
            pk=hotel_id
        )

        except Hotel.DoesNotExist:

            return Response(
            {
                "hotel": "Selected hotel does not exist."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =========================================
    # VALIDATE ROOM
    # =========================================

        try:

            room = Room.objects.select_related(
            "hotel",
            "room_type"
        ).get(
            pk=room_id
        )

        except Room.DoesNotExist:

            return Response(
            {
                "room": "Selected room does not exist."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =========================================
    # ROOM MUST BELONG TO HOTEL
    # =========================================

        if room.hotel_id != hotel.id:

            return Response(
            {
                "room":
                    "Selected room does not belong to the selected hotel."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =========================================
    # CHECK DATES
    # =========================================

        if check_in and check_out:

            if check_out <= check_in:

                return Response(
                {
                    "check_out":
                        "Check-out must be after check-in."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    # =========================================
    # CHECK ROOM AVAILABILITY
    # =========================================

        overlapping = Reservation.objects.filter(
        room=room,
        check_in__lt=check_out,
        check_out__gt=check_in,
    ).exclude(
        pk=reservation.pk
    ).exclude(
        status__in=[
            "cancelled",
            "checked_out",
            "no_show",
        ]
    )

        if overlapping.exists():

            return Response(
            {
                "room":
                    "This room is already reserved for the selected dates."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =========================================
    # UPDATE FOREIGN KEYS CORRECTLY
    # =========================================

        reservation.hotel = hotel
        reservation.room = room

    # =========================================
    # UPDATE OTHER FIELDS
    # =========================================

        normal_fields = [
            "check_in",
            "check_out",
            "adults",
            "children",
            "number_of_rooms",
            "room_rate",
            "total_amount",
            "advance_amount",
            "booking_source",
            "special_requests",
        ]

        for field in normal_fields:

            if field in update_data:

                value = update_data[field]

                if field in ["check_in", "check_out"]:
                    value = normalize_datetime(value)

                setattr(
                    reservation,
                    field,
                    value
                )

    # =========================================
    # PAYMENT STATUS
    # =========================================

        if "payment_status" in update_data:

            reservation.payment_status = (
            update_data["payment_status"]
        )

    # =========================================
    # RESERVATION STATUS
    # =========================================

        if "status" in update_data:

            reservation.status = (
            update_data["status"]
        )

    # =========================================
    # PAYMENT LOGIC
    # =========================================

        # =========================================
# PAYMENT LOGIC
# =========================================

        if reservation.payment_status == "paid":

            reservation.advance_amount = (
            reservation.total_amount
    )

        elif reservation.payment_status == "pending":

            reservation.advance_amount = 0


# =========================================
# STATUS LOGIC
# =========================================

# Only automatically change the status
# when the frontend did NOT explicitly
# provide a reservation status.

        if "status" not in update_data:

            if reservation.payment_status == "paid":

                if reservation.status == "pending":
                    reservation.status = "confirmed"

            elif reservation.payment_status == "pending":

                if reservation.status == "confirmed":
                    reservation.status = "pending"

    # =========================================
    # SAVE
    # =========================================

        reservation.save()

    # =========================================
# SYNC BILLING
# =========================================

        create_invoice_for_reservation(
    reservation
)

    # =========================================
    # UPDATE ROOM STATUS
    # =========================================

        room = reservation.room

        if reservation.status == "confirmed":

            if room.status in [
            "available",
            "reserved",
        ]:

                room.status = "reserved"

                room.save(
                update_fields=[
                    "status",
                    "updated_at"
                ]
            )

        elif reservation.status == "cancelled":

            room.status = "available"

            room.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

    # =========================================
    # RETURN UPDATED DATA
    # =========================================

        return Response(
        ReservationSerializer(
            reservation
        ).data,
        status=status.HTTP_200_OK
    )
    # =========================================================
# CHECK IN
# =========================================================

class CheckInView(APIView):

    @transaction.atomic
    def post(self, request, pk):

        try:

            reservation = Reservation.objects.select_related(
                "room"
            ).get(pk=pk)

        except Reservation.DoesNotExist:

            return Response(
                {
                    "error":
                    "Reservation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if reservation.payment_status != "paid":

            return Response(
                {
                    "error":
                    "Payment must be completed before check-in."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if reservation.status != "confirmed":

            return Response(
                {
                    "error":
                    "Only confirmed reservations can be checked in."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        reservation.status = "checked_in"

        reservation.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

        reservation.room.status = "occupied"

        reservation.room.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

        return Response(
            ReservationSerializer(
                reservation
            ).data
        )

    # =========================================================
# CHECK OUT
# =========================================================

class CheckOutView(APIView):

    @transaction.atomic
    def post(self, request, pk):

        try:

            reservation = Reservation.objects.select_related(
                "room",
                "guest"
            ).get(pk=pk)

        except Reservation.DoesNotExist:

            return Response(
                {
                    "error": "Reservation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if reservation.status != "checked_in":

            return Response(
                {
                    "error":
                        "Only checked-in guests can check out."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------------------
        # ACTUAL CHECKOUT TIME
        # -----------------------------------------

        actual_checkout = timezone.now()

        # -----------------------------------------
        # RESERVATION
        # -----------------------------------------

        reservation.status = "checked_out"

        # If you want the reservation's checkout
        # date/time to reflect the actual checkout:
        reservation.check_out = actual_checkout

        reservation.save(
            update_fields=[
                "status",
                "check_out",
                "updated_at"
            ]
        )

        # -----------------------------------------
        # ROOM
        # -----------------------------------------

        room = reservation.room

        room.status = "cleaning"

        # 1 hour cleaning period
        room.cleaning_until = (
            actual_checkout + timedelta(hours=1)
        )

        room.save(
            update_fields=[
                "status",
                "cleaning_until",
                "updated_at"
            ]
        )

        return Response(
            ReservationSerializer(
                reservation
            ).data
        )

        # =========================================================
# CANCEL RESERVATION
# =========================================================

class CancelReservationView(APIView):

    @transaction.atomic
    def post(self, request, pk):
        print("🔥🔥🔥 CANCEL RESERVATION VIEW CALLED 🔥🔥🔥")
        print("Reservation ID:", pk)

        try:
            reservation = (
                Reservation.objects
                .select_related(
                    "room",
                    "guest"
                )
                .get(pk=pk)
            )

        except Reservation.DoesNotExist:

            return Response(
                {
                    "error": "Reservation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -----------------------------------------
        # CHECK CURRENT STATUS
        # -----------------------------------------

        if reservation.status in [
            "checked_out",
            "cancelled"
        ]:

            return Response(
                {
                    "error":
                        "Reservation cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -----------------------------------------
        # CHECK PAYMENT
        # -----------------------------------------

        is_paid = (
            reservation.payment_status == "paid"
        )

        print("========== CANCELLATION DEBUG ==========")
        print("Reservation:", reservation.id)
        print("Payment status:", reservation.payment_status)
        print("Is paid:", is_paid)

        # -----------------------------------------
        # CANCEL RESERVATION
        # -----------------------------------------

        reservation.status = "cancelled"

        reservation.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

        # -----------------------------------------
        # MAKE ROOM AVAILABLE
        # -----------------------------------------

        room = reservation.room

        room.status = "available"

        room.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

        # -----------------------------------------
        # GET INVOICE
        # -----------------------------------------

        try:

            invoice = reservation.invoice

        except Invoice.DoesNotExist:

            invoice = create_invoice_for_reservation(
                reservation
            )

        # -----------------------------------------
        # CANCEL INVOICE
        # -----------------------------------------

        invoice.status = "cancelled"

        invoice.save(
            update_fields=[
                "status",
                "updated_at"
            ]
        )

        # -----------------------------------------
        # CREATE REFUND
        # -----------------------------------------

        refund = None

        print("========== CANCEL DEBUG ==========")
        print("Reservation:", reservation.id)
        print("Payment status:", reservation.payment_status)
        print("Invoice:", invoice.invoice_number)
        print("Invoice paid:", invoice.paid_amount)
        print("Invoice status:", invoice.status)
        print("Is paid:", is_paid)

        if is_paid:

            refund = create_refund_for_reservation(
                reservation
            )

        print("Refund object:", refund)

        # -----------------------------------------
        # RESPONSE
        # -----------------------------------------

        response_data = {

            "reservation": ReservationSerializer(
                reservation
            ).data,

            "refund_created":
                refund is not None,
        }

        if refund:

            response_data["refund"] = {

                "refund_number":
                    refund.refund_number,

                "amount":
                    str(refund.amount),

                "status":
                    refund.get_status_display(),

                "reason":
                    refund.reason,

                "invoice":
                    refund.invoice.invoice_number,

            }

        return Response(
            response_data,
            status=status.HTTP_200_OK
        )

# class CancelReservationView(APIView):

#     @transaction.atomic
#     def post(self, request, pk):

#         print("🔥🔥🔥 CANCEL VIEW CALLED 🔥🔥🔥")
#         print("Reservation ID:", pk)

#         try:
#             reservation = (
#                 Reservation.objects
#                 .select_related(
#                     "room",
#                     "guest"
#                 )
#                 .get(pk=pk)
#             )

#         except Reservation.DoesNotExist:

#             return Response(
#                 {
#                     "error": "Reservation not found."
#                 },
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         print("BEFORE STATUS:", reservation.status)
#         print("PAYMENT STATUS:", reservation.payment_status)

#         # -----------------------------------------
#         # CHECK CURRENT STATUS
#         # -----------------------------------------

#         if reservation.status in [
#             "checked_out",
#             "cancelled"
#         ]:

#             return Response(
#                 {
#                     "error":
#                         "Reservation cannot be cancelled."
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # -----------------------------------------
#         # CHECK PAYMENT
#         # -----------------------------------------

#         is_paid = (
#             reservation.payment_status == "paid"
#         )

#         print("IS PAID:", is_paid)

#         # -----------------------------------------
#         # CANCEL RESERVATION
#         # -----------------------------------------

#         reservation.status = "cancelled"

#         reservation.save(
#             update_fields=[
#                 "status",
#                 "updated_at"
#             ]
#         )

#         # -----------------------------------------
#         # MAKE ROOM AVAILABLE
#         # -----------------------------------------

#         room = reservation.room

#         room.status = "available"

#         room.save(
#             update_fields=[
#                 "status",
#                 "updated_at"
#             ]
#         )

#         print("ROOM STATUS:", room.status)

#         # -----------------------------------------
#         # GET / CREATE INVOICE
#         # -----------------------------------------

#         try:

#             invoice = reservation.invoice

#         except Invoice.DoesNotExist:

#             invoice = create_invoice_for_reservation(
#                 reservation
#             )

#         print("INVOICE:", invoice.invoice_number)
#         print("INVOICE PAID:", invoice.paid_amount)

#         # -----------------------------------------
#         # CANCEL INVOICE
#         # -----------------------------------------

#         invoice.status = "cancelled"

#         invoice.save(
#             update_fields=[
#                 "status",
#                 "updated_at"
#             ]
#         )

#         # -----------------------------------------
#         # CREATE REFUND
#         # -----------------------------------------

#         refund = None

#         if is_paid:

#             print("💰 CREATING REFUND...")

#             refund = create_refund_for_reservation(
#                 reservation
#             )

#             print("💰 REFUND RESULT:", refund)

#         # -----------------------------------------
#         # RESPONSE
#         # -----------------------------------------

#         response_data = {

#             "reservation": ReservationSerializer(
#                 reservation
#             ).data,

#             "refund_created":
#                 refund is not None,
#         }

#         if refund:

#             response_data["refund"] = {

#                 "refund_number":
#                     refund.refund_number,

#                 "amount":
#                     str(refund.amount),

#                 "status":
#                     refund.get_status_display(),

#                 "reason":
#                     refund.reason,

#                 "invoice":
#                     refund.invoice.invoice_number,

#             }

#         print("🔥 FINAL RESPONSE:")
#         print(response_data)

#         return Response(
#             response_data,
#             status=status.HTTP_200_OK
#         )

# class CancelReservationView(APIView):

#     @transaction.atomic
#     def post(self, request, pk):

#         print("🚨🚨🚨 THIS IS THE CANCEL VIEW 🚨🚨🚨")
#         print("PK =", pk)

#         return Response({
#             "TEST": "CANCEL VIEW IS WORKING",
#             "reservation_id": pk
#         })

        # =========================================================
# MARK PAYMENT AS PAID
# =========================================================

class MarkPaymentPaidView(APIView):

    @transaction.atomic
    def post(self, request, pk):

        try:
            reservation = Reservation.objects.select_related(
                "guest"
            ).get(pk=pk)

        except Reservation.DoesNotExist:

            return Response(
                {
                    "error": "Reservation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # --------------------------------
        # Check already paid
        # --------------------------------

        if reservation.payment_status == "paid":

            return Response(
                {
                    "error": "Reservation is already paid."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # --------------------------------
        # Update reservation
        # --------------------------------

        reservation.payment_status = "paid"

        reservation.advance_amount = (
            reservation.total_amount
        )

        if reservation.status == "pending":
            reservation.status = "confirmed"

        reservation.save()

        # --------------------------------
        # Create / update invoice
        # --------------------------------

        invoice = create_invoice_for_reservation(
            reservation
        )

        return Response(
            ReservationSerializer(
                reservation
            ).data
        )
# def reservation_list(request):

#     reservations = RESERVATIONS.copy()

#     search = request.GET.get("search", "").strip()
#     status = request.GET.get("status", "")
#     payment = request.GET.get("payment", "")
#     check_in = request.GET.get("check_in", "")
#     check_out = request.GET.get("check_out", "")

#     if search:
#         reservations = [
#             r for r in reservations
#             if search.lower() in r["guest"].lower()
#             or search.lower() in r["id"].lower()
#             or search.lower() in r["phone"]
#             or search.lower() in r["room"]
#         ]

#     if status:
#         reservations = [
#             r for r in reservations
#             if r["status"] == status
#         ]

#     if payment:
#         reservations = [
#             r for r in reservations
#             if r["payment"] == payment
#         ]

#     if check_in:
#         reservations = [
#             r for r in reservations
#             if r["check_in"] >= check_in
#         ]

#     if check_out:
#         reservations = [
#             r for r in reservations
#             if r["check_out"] <= check_out
#         ]

#     context = {
#         "reservations": reservations,
#         "search": search,
#         "status": status,
#         "payment": payment,
#         "check_in": check_in,
#         "check_out": check_out,
#     }

#     return render(
#         request,
#         "reservations/reservation_list.html",
#         context,
#     )

class GuestDetailView(APIView):

    def get(self, request, pk):

        try:

            guest = Guest.objects.get(
                pk=pk
            )

        except Guest.DoesNotExist:

            return Response(
                {
                    "error":
                        "Guest not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GuestSerializer(
            guest
        )

        return Response(
            serializer.data
        )


# =========================================================
# RESERVATION ADMIN UI
# =========================================================

def reservation_list_page(request):

    # ==========================================
    # RESERVATIONS
    # ==========================================

    reservations = Reservation.objects.select_related(
        "hotel",
        "guest",
        "room",
        "room__room_type"
    ).all()


    # ==========================================
    # HOTELS
    # ==========================================

    hotels = Hotel.objects.all().order_by("name")


    # ==========================================
    # GET FILTER VALUES
    # ==========================================

    search = request.GET.get(
        "search",
        ""
    ).strip()


    hotel = request.GET.get(
        "hotel",
        ""
    ).strip()


    reservation_status = request.GET.get(
        "status",
        ""
    ).strip()


    payment = request.GET.get(
        "payment",
        ""
    ).strip()


    check_in = request.GET.get(
        "check_in",
        ""
    ).strip()


    check_out = request.GET.get(
        "check_out",
        ""
    ).strip()


    # ==========================================
    # SEARCH
    # ==========================================

    if search:

        reservations = reservations.filter(

            Q(
                reservation_number__icontains=search
            )

            |

            Q(
                guest__first_name__icontains=search
            )

            |

            Q(
                guest__last_name__icontains=search
            )

            |

            Q(
                guest__phone__icontains=search
            )

            |

            Q(
                room__room_number__icontains=search
            )

        )


    # ==========================================
    # HOTEL
    # ==========================================

    if hotel:

        reservations = reservations.filter(
            hotel_id=hotel
        )


    # ==========================================
    # STATUS
    # ==========================================

    if reservation_status:

        reservations = reservations.filter(
            status=reservation_status
        )


    # ==========================================
    # PAYMENT
    # ==========================================

    if payment:

        reservations = reservations.filter(
            payment_status=payment
        )


    # ==========================================
    # CHECK-IN
    # ==========================================

    if check_in:

        reservations = reservations.filter(
            check_in__date__gte=check_in
        )


    # ==========================================
    # CHECK-OUT
    # ==========================================

    if check_out:

        reservations = reservations.filter(
            check_out__date__lte=check_out
        )


    # ==========================================
    # SUMMARY COUNTS
    # ==========================================

    total_reservations = reservations.count()

    checked_in_count = reservations.filter(
        status="checked_in"
    ).count()

    checked_out_count = reservations.filter(
        status="checked_out"
    ).count()

    pending_payment_count = reservations.filter(
        payment_status="pending"
    ).count()

    pending_payment_amount = reservations.filter(
        payment_status="pending"
    ).aggregate(
        total=Sum("total_amount")
    )["total"] or 0

    pending_payment_amount -= reservations.filter(
        payment_status="pending"
    ).aggregate(
        total=Sum("advance_amount")
    )["total"] or 0


    # ==========================================
    # PAGINATION
    # ==========================================

    paginator = Paginator(
        reservations,
        5
    )

    page_number = request.GET.get(
        "page"
    )

    page_obj = paginator.get_page(
        page_number
    )

    reservations = page_obj.object_list


    # ==========================================
    # CONTEXT
    # ==========================================

    context = {

        # Reservations
        "reservations": reservations,

        # Pagination
        "page_obj": page_obj,

        "paginator": paginator,


        # Hotels
        "hotels": hotels,

        "hotel": hotel,


        # Filters
        "search": search,

        "status": reservation_status,

        "payment": payment,

        "check_in": check_in,

        "check_out": check_out,
        "total_reservations": total_reservations,

        # Summary
        "checked_in_count":
            checked_in_count,

        "checked_out_count":
            checked_out_count,

        "pending_payment_count":
            pending_payment_count,

        "pending_payment_amount":
            pending_payment_amount,

    }


    return render(
        request,
        "reservations/reservation_list.html",
        context
    )