from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class Guest(models.Model):

    IDENTITY_CHOICES = [
        ("aadhaar", "Aadhaar"),
        ("passport", "Passport"),
        ("driving_license", "Driving License"),
        ("voter_id", "Voter ID"),
        ("other", "Other"),
    ]

    guest_id = models.CharField(
        max_length=50,
        unique=True
    )

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100,
        blank=True
    )

    phone = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    date_of_birth = models.DateField(
        blank=True,
        null=True
    )

    identity_type = models.CharField(
        max_length=30,
        choices=IDENTITY_CHOICES,
        blank=True,
        null=True
    )

    identity_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    company_name = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    gst_number = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    pincode = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Reservation(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("checked_in", "Checked In"),
        ("checked_out", "Checked Out"),
        ("cancelled", "Cancelled"),
        ("no_show", "No Show"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
    ]

    SOURCE_CHOICES = [
        ("walk_in", "Walk In"),
        ("website", "Website"),
        ("phone", "Phone"),
        ("booking_com", "Booking.com"),
        ("agoda", "Agoda"),
        ("other", "Other"),
    ]

    reservation_number = models.CharField(
        max_length=50,
        unique=True
    )

    hotel = models.ForeignKey(
        "hotels.Hotel",
        on_delete=models.CASCADE,
        related_name="reservations"
    )

    guest = models.ForeignKey(
        Guest,
        on_delete=models.PROTECT,
        related_name="reservations"
    )

    room = models.ForeignKey(
        "rooms.Room",
        on_delete=models.PROTECT,
        related_name="reservations"
    )

    check_in = models.DateTimeField()

    check_out = models.DateTimeField()

    adults = models.PositiveIntegerField(
        default=1
    )

    children = models.PositiveIntegerField(
        default=0
    )

    number_of_rooms = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )

    room_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    advance_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    # NEW
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="pending"
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="pending"
    )

    booking_source = models.CharField(
        max_length=30,
        choices=SOURCE_CHOICES,
        default="walk_in"
    )

    special_requests = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.reservation_number

    @property
    def balance_amount(self):
        return self.total_amount - self.advance_amount