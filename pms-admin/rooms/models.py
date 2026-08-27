from django.db import models
import os

class RoomType(models.Model):

    hotel = models.ForeignKey(
        "hotels.Hotel",
        on_delete=models.CASCADE,
        related_name="room_types",
  
)
    

    name = models.CharField(max_length=100)

    description = models.TextField(
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to="room_types/",
        blank=True,
        null=True
    )

    capacity = models.PositiveIntegerField(
        default=2
    )

    base_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    amenities = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def save(self, *args, **kwargs):

        old_image = None

        if self.pk:

            try:
                old_room_type = RoomType.objects.get(
                    pk=self.pk
                )

                old_image = old_room_type.image

            except RoomType.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        if (
            old_image
            and old_image.name
            and old_image.name != self.image.name
        ):

            if os.path.isfile(old_image.path):

                os.remove(old_image.path)

    def delete(self, *args, **kwargs):

        image = self.image

        super().delete(*args, **kwargs)

        if image and image.name:

            if os.path.isfile(image.path):

                os.remove(image.path)


    def __str__(self):
        
        return f"{self.hotel.name} - {self.name}"

class Room(models.Model):

    STATUS_CHOICES = [
        ("available", "Available"),
        ("occupied", "Occupied"),
        ("reserved", "Reserved"),
        ("maintenance", "Maintenance"),
        ("cleaning", "Cleaning"),
        ("out_of_order", "Out of Order"),
    ]

    hotel = models.ForeignKey(
        "hotels.Hotel",
        on_delete=models.CASCADE,
        related_name="rooms"
    )

    room_type = models.ForeignKey(
        RoomType,
        on_delete=models.PROTECT,
        related_name="rooms"
    )

    room_number = models.CharField(
        max_length=20
    )

    floor = models.PositiveIntegerField(
        default=1
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="available"
    )

    cleaning_until=models.DateTimeField(
        blank=True,
        null=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    notes = models.TextField(
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
        ordering = ["room_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["hotel", "room_number"],
                name="unique_room_per_hotel"
            )
        ]

    def __str__(self):
        return f"{self.hotel.name} - Room {self.room_number}"