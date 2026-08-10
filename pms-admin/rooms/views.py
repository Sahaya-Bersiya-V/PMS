# from django.shortcuts import render

# def room_list(request):
#     return render(request, "rooms/room_list.html")
from django.shortcuts import render


def room_list(request):

    # -----------------------------------------
    # SAMPLE HOTELS
    # -----------------------------------------

    hotels = [
        {
            "id": 1,
            "name": "Hotel Paradise",
        },
        {
            "id": 2,
            "name": "Sea View Resort",
        },
        {
            "id": 3,
            "name": "Mountain Stay",
        },
    ]


    # -----------------------------------------
    # SAMPLE ROOMS
    # -----------------------------------------

    rooms = [

        {
            "id": 1,
            "hotel_id": 1,
            "hotel_name": "Hotel Paradise",
            "room_number": "101",
            "room_type": "Standard",
            "floor": 1,
            "capacity": 2,
            "price": 2500,
            "status": "Available",
        },

        {
            "id": 2,
            "hotel_id": 1,
            "hotel_name": "Hotel Paradise",
            "room_number": "102",
            "room_type": "Deluxe",
            "floor": 1,
            "capacity": 2,
            "price": 3500,
            "status": "Occupied",
        },

        {
            "id": 3,
            "hotel_id": 2,
            "hotel_name": "Sea View Resort",
            "room_number": "201",
            "room_type": "Suite",
            "floor": 2,
            "capacity": 4,
            "price": 7000,
            "status": "Maintenance",
        },

        {
            "id": 4,
            "hotel_id": 2,
            "hotel_name": "Sea View Resort",
            "room_number": "202",
            "room_type": "Deluxe",
            "floor": 2,
            "capacity": 2,
            "price": 4500,
            "status": "Available",
        },

        {
            "id": 5,
            "hotel_id": 3,
            "hotel_name": "Mountain Stay",
            "room_number": "301",
            "room_type": "Standard",
            "floor": 3,
            "capacity": 2,
            "price": 2800,
            "status": "Available",
        },

    ]


    # -----------------------------------------
    # GET FILTERS
    # -----------------------------------------

    selected_hotel = request.GET.get(
        "hotel",
        ""
    )

    search = request.GET.get(
        "search",
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


    # -----------------------------------------
    # HOTEL FILTER
    # -----------------------------------------

    if selected_hotel:

        rooms = [
            room
            for room in rooms
            if str(room["hotel_id"]) == selected_hotel
        ]


    # -----------------------------------------
    # SEARCH FILTER
    # -----------------------------------------

    if search:

        search_lower = search.lower()

        rooms = [
            room
            for room in rooms
            if search_lower in room["room_number"].lower()
            or search_lower in room["hotel_name"].lower()
            or search_lower in room["room_type"].lower()
        ]


    # -----------------------------------------
    # ROOM TYPE FILTER
    # -----------------------------------------

    if selected_room_type:

        rooms = [
            room
            for room in rooms
            if room["room_type"] == selected_room_type
        ]


    # -----------------------------------------
    # STATUS FILTER
    # -----------------------------------------

    if selected_status:

        rooms = [
            room
            for room in rooms
            if room["status"] == selected_status
        ]


    # -----------------------------------------
    # CONTEXT
    # -----------------------------------------

    context = {

        "rooms": rooms,

        "hotels": hotels,

        "selected_hotel": selected_hotel,

        "search": search,

        "selected_room_type":
            selected_room_type,

        "selected_status":
            selected_status,

    }


    return render(
        request,
        "rooms/room_list.html",
        context
    )
def add_room(request):

    hotels = [
        {
            "id": 1,
            "name": "Hotel Paradise",
        },
        {
            "id": 2,
            "name": "Sea View Resort",
        },
        {
            "id": 3,
            "name": "Mountain Stay",
        },
    ]

    context = {
        "hotels": hotels,
    }

    return render(
        request,
        "rooms/add_room.html",
        context
    )
def room_type_list(request):
    return render(request, "rooms/room_type_list.html")


def add_room_type(request):
    return render(request, "rooms/add_room_type.html")