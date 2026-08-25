from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Count, Avg, Max
from .models import Room, RoomType
from .forms import RoomForm, RoomTypeForm
from hotels.models import Hotel
from django.db.models import Q
# =========================================================
# ROOM LIST
# =========================================================

def room_list(request):

    # =========================================================
    # BASE QUERYSET
    # =========================================================

    rooms = Room.objects.select_related(
        "hotel",
        "room_type"
    ).all()

    hotels = Hotel.objects.all()

    room_types = RoomType.objects.select_related(
        "hotel"
    ).all()


    # =========================================================
    # FILTER VALUES
    # =========================================================

    selected_hotel = request.GET.get(
        "hotel",
        ""
    )

    selected_room_type = request.GET.get(
        "room_type",
        ""
    )

    selected_status = request.GET.get(
        "status",
        ""
    )

    search = request.GET.get(
        "search",
        ""
    ).strip()


    # =========================================================
    # FILTER ROOMS
    # =========================================================

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

    total_rooms = rooms.count()


    available_rooms = rooms.filter(
        status="available"
    ).count()


    occupied_rooms = rooms.filter(
        status="occupied"
    ).count()


    reserved_rooms = rooms.filter(
        status="reserved"
    ).count()


    cleaning_rooms = rooms.filter(
        status="cleaning"
    ).count()


    maintenance_rooms = rooms.filter(
        status="maintenance"
    ).count()


    out_of_order_rooms = rooms.filter(
        status="out_of_order"
    ).count()

    rooms_by_floor = list(
        rooms
        .values("floor")
        .annotate(
            total=Count("id")
        )
        .order_by("floor")
    )

    rooms_by_type = list(
        rooms
        .values("room_type__name")
        .annotate(
            total=Count("id")
        )
        .order_by("-total")
    )


    # =========================================================
    # PAGINATION
    # =========================================================

    paginator = Paginator(
        rooms,
        5
    )

    page_number = request.GET.get(
        "page"
    )

    page_obj = paginator.get_page(
        page_number
    )

    rooms = page_obj.object_list


    # =========================================================
    # CONTEXT
    # =========================================================

    context = {

        # Rooms
        "rooms": rooms,

        "hotels": hotels,

        "room_types": room_types,


        # Filters
        "selected_hotel": selected_hotel,

        "selected_room_type": selected_room_type,

        "selected_status": selected_status,

        "search": search,


        # Summary cards
        "total_rooms": total_rooms,

        "available_rooms": available_rooms,

        "occupied_rooms": occupied_rooms,

        "reserved_rooms": reserved_rooms,

        "cleaning_rooms": cleaning_rooms,

        "maintenance_rooms": maintenance_rooms,

        "out_of_order_rooms": out_of_order_rooms,


        # Charts
        "rooms_by_floor": rooms_by_floor,

        "rooms_by_type": rooms_by_type,


        # Pagination
        "page_obj": page_obj,

        "paginator": paginator,

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
    # FILTER VALUES
    # =========================================================

    search = request.GET.get(
        "search",
        ""
    ).strip()

    selected_hotel = request.GET.get(
        "hotel",
        ""
    )

    selected_capacity = request.GET.get(
        "capacity",
        ""
    )


    # =========================================================
    # BASE QUERY
    # =========================================================

    room_types = RoomType.objects.select_related(
        "hotel"
    ).annotate(
        total_rooms=Count("rooms")
    )


    # =========================================================
    # SEARCH
    # =========================================================

    if search:

        room_types = room_types.filter(
            Q(name__icontains=search) |
            Q(hotel__name__icontains=search)
        )


    # =========================================================
    # HOTEL FILTER
    # =========================================================

    if selected_hotel:

        room_types = room_types.filter(
            hotel_id=selected_hotel
        )


    # =========================================================
    # CAPACITY FILTER
    # =========================================================

    if selected_capacity:

        room_types = room_types.filter(
            capacity=selected_capacity
        )


    # =========================================================
    # ORDER
    # =========================================================

    room_types = room_types.order_by(
        "hotel__name",
        "name"
    )


    # =========================================================
    # HOTELS FOR FILTER
    # =========================================================

    hotels = Hotel.objects.all().order_by(
        "name"
    )


    # =========================================================
    # CAPACITY OPTIONS
    # Automatically generated from database
    # =========================================================

    capacities = (
        RoomType.objects
        .values_list(
            "capacity",
            flat=True
        )
        .distinct()
        .order_by(
            "capacity"
        )
    )


    # =========================================================
    # SUMMARY CARDS
    # Based on filtered room types
    # =========================================================

    total_types = room_types.count()

    filtered_room_type_ids = room_types.values_list(
        "id",
        flat=True
    )


    total_rooms = Room.objects.filter(
        room_type_id__in=filtered_room_type_ids
    ).count()


    average_price = room_types.aggregate(
        average=Avg("base_price")
    )["average"] or 0


    max_capacity = room_types.aggregate(
        maximum=Max("capacity")
    )["maximum"] or 0


    # =========================================================
    # CHART 1
    # ROOM TYPES BY HOTEL
    # =========================================================

    room_types_by_hotel = list(
        room_types
        .values(
            "hotel__name"
        )
        .annotate(
            total=Count("id")
        )
        .order_by(
            "-total",
            "hotel__name"
        )
    )


    hotel_labels = [
        item["hotel__name"]
        for item in room_types_by_hotel
    ]


    hotel_values = [
        item["total"]
        for item in room_types_by_hotel
    ]


    # =========================================================
    # CHART 2
    # ROOMS BY ROOM TYPE
    # =========================================================

    rooms_by_type = list(
        room_types
        .values(
            "name",
            "hotel__name",
        )
        .annotate(
            total_rooms=Count("rooms")
        )
        .order_by(
            "-total_rooms"
        )
    )


    room_type_labels = [
        f"{item['hotel__name']} - {item['name']}"
        for item in rooms_by_type
    ]


    room_type_values = [
        item["total_rooms"]
        for item in rooms_by_type
    ]


    # =========================================================
    # PAGINATION
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

        # Table
        "room_types": room_types,

        # Pagination
        "page_obj": page_obj,
        "paginator": paginator,

        # Filters
        "hotels": hotels,
        "capacities": capacities,

        "search": search,
        "selected_hotel": selected_hotel,
        "selected_capacity": selected_capacity,

        # Cards
        "total_types": total_types,
        "total_rooms": total_rooms,
        "average_price": average_price,
        "max_capacity": max_capacity,

        # Charts
        "hotel_labels": hotel_labels,
        "hotel_values": hotel_values,

        "room_type_labels": room_type_labels,
        "room_type_values": room_type_values,

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