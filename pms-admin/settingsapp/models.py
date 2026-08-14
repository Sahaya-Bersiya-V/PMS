from django.db import models


class PMSSettings(models.Model):

    hotel = models.OneToOneField(
        "hotels.Hotel",
        on_delete=models.CASCADE,
        related_name="settings"
    )

    currency = models.CharField(
        max_length=10,
        default="INR"
    )

    tax_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    check_in_time = models.TimeField(
        default="14:00"
    )

    check_out_time = models.TimeField(
        default="11:00"
    )

    cancellation_policy = models.TextField(
        blank=True,
        null=True
    )

    hotel_email = models.EmailField(
        blank=True,
        null=True
    )

    hotel_phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Settings - {self.hotel.name}"