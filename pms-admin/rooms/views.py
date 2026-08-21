from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.core.paginator import Paginator
from .models import Room, RoomType
from .forms import RoomForm, RoomTypeForm


# =========================================================
# ROOM LIST
# =========================================================

def room_list(request):

    rooms = Room.objects.select_related(
        "hotel",
        "room_type"
    ).all()

    hotels = request.user.hotel_set.all() if hasattr(
        request.user,
        "hotel_set"
    ) else []

    # Better: get all hotels
    from hotels.models import Hotel

    hotels = Hotel.objects.all()

    room_types = RoomType.objects.select_related(
        "hotel"
    ).all()

    selected_hotel = request.GET.get("hotel", "")
    selected_room_type = request.GET.get("room_type", "")
    selected_status = request.GET.get("status", "")
    search = request.GET.get("search", "").strip()

    if selected_hotel:
        rooms = rooms.filter(
            hotel_id=selected_hotel
        )

    if selected_room_type:
        rooms = rooms.filter(
            room_type_id=selected_room_type
        )

    if selected_status:
        rooms = rooms.filter(
            status=selected_status
        )

    if search:
        rooms = rooms.filter(
            room_number__icontains=search
        )
    # =========================================================
# PAGINATION
# =========================================================

    paginator = Paginator(rooms, 5)

    page_number = request.GET.get("page")

    page_obj = paginator.get_page(page_number)

    rooms = page_obj.object_list

    context = {
        "rooms": rooms,
        "hotels": hotels,
        "room_types": room_types,

        "selected_hotel": selected_hotel,
        "selected_room_type": selected_room_type,
        "selected_status": selected_status,
        "search": search,
        "page_obj":page_obj,
        "paginator":paginator,
    }

    return render(
        request,
        "rooms/room_list.html",
        context
    )


# =========================================================
# ADD ROOM
# =========================================================

def add_room(request):

    if request.method == "POST":

        form = RoomForm(request.POST)

        if form.is_valid():

            room = form.save()

            messages.success(
                request,
                f"Room {room.room_number} added successfully."
            )

            return redirect("room-list")

    else:

        form = RoomForm()

    return render(
        request,
        "rooms/add_room.html",
        {
            "form": form
        }
    )


# =========================================================
# VIEW ROOM
# =========================================================

def room_detail(request, pk):

    room = get_object_or_404(
        Room.objects.select_related(
            "hotel",
            "room_type"
        ),
        pk=pk
    )

    return render(
        request,
        "rooms/room_detail.html",
        {
            "room": room
        }
    )


# =========================================================
# EDIT ROOM
# =========================================================

def edit_room(request, pk):

    room = get_object_or_404(
        Room,
        pk=pk
    )

    if request.method == "POST":

        form = RoomForm(
            request.POST,
            instance=room
        )

        if form.is_valid():

            room = form.save()

            messages.success(
                request,
                f"Room {room.room_number} updated successfully."
            )

            return redirect("room-list")

    else:

        form = RoomForm(
            instance=room
        )

    return render(
        request,
        "rooms/edit_room.html",
        {
            "form": form,
            "room": room
        }
    )


# =========================================================
# DELETE ROOM
# =========================================================

def delete_room(request, pk):

    room = get_object_or_404(
        Room,
        pk=pk
    )

    if request.method == "POST":

        room_number = room.room_number

        room.delete()

        messages.success(
            request,
            f"Room {room_number} deleted successfully."
        )

    return redirect("room-list")


# =========================================================
# ROOM TYPE LIST
# =========================================================

def room_type_list(request):

    # =========================================================
    # ROOM TYPES
    # =========================================================

    room_types = RoomType.objects.select_related(
        "hotel"
    ).order_by("hotel__name", "name")


    # =========================================================
    # PAGINATION
    # Show 5 room types per page
    # =========================================================

    paginator = Paginator(
        room_types,
        5
    )

    page_number = request.GET.get(
        "page"
    )

    page_obj = paginator.get_page(
        page_number
    )

    room_types = page_obj.object_list


    # =========================================================
    # CONTEXT
    # =========================================================

    context = {

        "room_types": room_types,

        "page_obj": page_obj,

        "paginator": paginator,

    }


    return render(
        request,
        "rooms/room_type_list.html",
        context
    )


def add_room_type(request):

    if request.method == "POST":

        form = RoomTypeForm(request.POST)

        if form.is_valid():

            room_type = form.save()

            messages.success(
                request,
                f"{room_type.name} room type added successfully."
            )

            return redirect("room-type-list")

    else:

        form = RoomTypeForm()

    return render(
        request,
        "rooms/add_room_type.html",
        {
            "form": form
        }
    )


def room_type_detail(request, pk):

    room_type = get_object_or_404(
        RoomType.objects.select_related("hotel"),
        pk=pk
    )

    return render(
        request,
        "rooms/room_type_detail.html",
        {
            "room_type": room_type
        }
    )


def edit_room_type(request, pk):

    room_type = get_object_or_404(
        RoomType,
        pk=pk
    )

    if request.method == "POST":

        form = RoomTypeForm(
            request.POST,
            instance=room_type
        )

        if form.is_valid():

            form.save()

            messages.success(
                request,
                f"{room_type.name} updated successfully."
            )

            return redirect("room-type-list")

    else:

        form = RoomTypeForm(
            instance=room_type
        )

    return render(
        request,
        "rooms/edit_room_type.html",
        {
            "form": form,
            "room_type": room_type
        }
    )


def delete_room_type(request, pk):

    room_type = get_object_or_404(
        RoomType,
        pk=pk
    )

    if request.method == "POST":

        name = room_type.name

        room_type.delete()

        messages.success(
            request,
            f"{name} deleted successfully."
        )

    return redirect("room-type-list")