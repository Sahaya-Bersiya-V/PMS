from django.shortcuts import render

# Temporary UI data
HOTELS = [
    {
        "code": "HTL001",
        "name": "Hotel Paradise",
        "type": "Hotel",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "phone": "9876543210",
        "rooms": 120,
        "employees": 35,
        "status": "Active",
    },
    {
        "code": "HTL002",
        "name": "Ocean View Resort",
        "type": "Resort",
        "city": "Goa",
        "state": "Goa",
        "phone": "9123456780",
        "rooms": 80,
        "employees": 25,
        "status": "Active",
    },
    {
        "code": "HTL003",
        "name": "Hill View Villa",
        "type": "Villa",
        "city": "Ooty",
        "state": "Tamil Nadu",
        "phone": "9988776655",
        "rooms": 30,
        "employees": 10,
        "status": "Under Maintenance",
    },
]


def hotel_list(request):

    hotels = HOTELS.copy()

    search = request.GET.get("search", "").strip()
    status = request.GET.get("status", "")
    hotel_type = request.GET.get("type", "")
    state = request.GET.get("state", "")

    if search:
        hotels = [
            h for h in hotels
            if search.lower() in h["name"].lower()
            or search.lower() in h["code"].lower()
            or search.lower() in h["phone"]
        ]

    if status:
        hotels = [h for h in hotels if h["status"] == status]

    if hotel_type:
        hotels = [h for h in hotels if h["type"] == hotel_type]

    if state:
        hotels = [h for h in hotels if h["state"] == state]

    context = {
        "hotels": hotels,
        "search": search,
        "status": status,
        "hotel_type": hotel_type,
        "state": state,
    }

    return render(request, "hotels/hotel_list.html", context)

def add_hotel(request):
    return render(request, "hotels/add_hotel.html")
