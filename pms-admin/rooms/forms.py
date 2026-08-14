from django import forms
from .models import Room, RoomType


class RoomTypeForm(forms.ModelForm):

    class Meta:
        model = RoomType

        fields = [
            "hotel",
            "name",
            "description",
            "capacity",
            "base_price",
            "amenities",
        ]

        widgets = {
            "hotel": forms.Select(
                attrs={
                    "class": "form-select"
                }
            ),

            "name": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter room type name"
                }
            ),

            "description": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 4,
                    "placeholder": "Enter description"
                }
            ),

            "capacity": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "min": 1,
                    "placeholder": "Maximum guests"
                }
            ),

            "base_price": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "min": 0,
                    "step": "0.01",
                    "placeholder": "2500"
                }
            ),

            "amenities": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 3,
                    "placeholder": "WiFi, TV, AC..."
                }
            ),
        }


class RoomForm(forms.ModelForm):

    class Meta:
        model = Room

        fields = [
            "hotel",
            "room_type",
            "room_number",
            "floor",
            "status",
            "price",
            "notes",
        ]

        widgets = {
            "hotel": forms.Select(
                attrs={
                    "class": "form-select",
                    "id": "id_hotel"
                }
            ),

            "room_type": forms.Select(
                attrs={
                    "class": "form-select",
                    "id": "id_room_type"
                }
            ),

            "room_number": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Enter Room Number"
                }
            ),

            "floor": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "min": 1,
                    "placeholder": "Enter Floor Number"
                }
            ),

            "status": forms.Select(
                attrs={
                    "class": "form-select"
                }
            ),

            "price": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "id": "id_price",
                    "readonly": True
                }
            ),

            "notes": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 4,
                    "placeholder": "Room Description"
                }
            ),
        }

    def save(self, commit=True):

        room = super().save(commit=False)

        # Automatically take price from Room Type
        if room.room_type:
            room.price = room.room_type.base_price

        if commit:
            room.save()

        return room