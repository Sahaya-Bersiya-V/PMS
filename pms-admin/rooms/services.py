from django.utils import timezone

from .models import Room


def update_cleaning_rooms():

    now = timezone.now()

    Room.objects.filter(
        status="cleaning",
        cleaning_until__isnull=False,
        cleaning_until__lte=now,
    ).update(
        status="available",
        cleaning_until=None,
        updated_at=now,
    )