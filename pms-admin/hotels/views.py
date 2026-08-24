
from django.shortcuts import render, redirect,get_object_or_404
from .models import Hotel
from django.db.models import Count

def hotel_list(request):

    hotels = Hotel.objects.all().annotate(
        room_count=Count("rooms", distinct=True),
        employee_count=Count("employees", distinct=True)
    )

    search = request.GET.get("search", "").strip()
    hotel_status = request.GET.get("status", "")
    state = request.GET.get("state", "")

    # -----------------------------
    # SEARCH
    # -----------------------------

    if search:
        hotels = hotels.filter(
            name__icontains=search
        ) | hotels.filter(
            code__icontains=search
        ) | hotels.filter(
            phone__icontains=search
        )

        # Re-apply annotations after OR query
        hotels = hotels.annotate(
            room_count=Count("rooms", distinct=True),
            employee_count=Count("employees", distinct=True)
        )

    # -----------------------------
    # STATUS FILTER
    # -----------------------------

    if hotel_status:
        hotels = hotels.filter(status=hotel_status)

    # -----------------------------
    # STATE FILTER
    # -----------------------------

    if state:
        hotels = hotels.filter(state=state)

    # -----------------------------
    # SUMMARY CARDS
    # -----------------------------

    total_hotels = Hotel.objects.count()

    active_hotels = Hotel.objects.filter(
        status="active"
    ).count()

    inactive_hotels = Hotel.objects.filter(
        status="inactive"
    ).count()

    # -----------------------------
    # TOTAL ROOMS
    # -----------------------------

    total_rooms = sum(
        hotel.room_count
        for hotel in Hotel.objects.annotate(
            room_count=Count("rooms", distinct=True)
        )
    )

    # -----------------------------
    # TOTAL EMPLOYEES
    # -----------------------------

    total_employees = sum(
        hotel.employee_count
        for hotel in Hotel.objects.annotate(
            employee_count=Count("employees", distinct=True)
        )
    )

    # -----------------------------
    # CHART DATA
    # -----------------------------

    chart_hotels = Hotel.objects.annotate(
        room_count=Count("rooms", distinct=True),
        employee_count=Count("employees", distinct=True)
    ).order_by("name")

    hotel_names = [
        hotel.name
        for hotel in chart_hotels
    ]

    room_counts = [
        hotel.room_count
        for hotel in chart_hotels
    ]

    employee_counts = [
        hotel.employee_count
        for hotel in chart_hotels
    ]

    # -----------------------------
    # STATES
    # -----------------------------

    states = Hotel.objects.values_list(
        "state",
        flat=True
    ).distinct().order_by("state")

    context = {

        # Table
        "hotels": hotels,

        # Filters
        "search": search,
        "status": hotel_status,
        "state": state,
        "states": states,

        # Summary cards
        "total_hotels": total_hotels,
        "active_hotels": active_hotels,
        "inactive_hotels": inactive_hotels,
        "total_rooms": total_rooms,
        "total_employees": total_employees,

        # Chart data
        "hotel_names": hotel_names,
        "room_counts": room_counts,
        "employee_counts": employee_counts,
    }

    return render(
        request,
        "hotels/hotel_list.html",
        context
    )


def add_hotel(request):

    if request.method == "POST":

        Hotel.objects.create(
            name=request.POST.get("name"),
            code=request.POST.get("code"),
            address=request.POST.get("address"),
            city=request.POST.get("city"),
            state=request.POST.get("state"),
            country=request.POST.get("country") or "India",
            pincode=request.POST.get("pincode"),
            phone=request.POST.get("phone"),
            email=request.POST.get("email"),
            description=request.POST.get("description"),
            status=request.POST.get("status") or "active",
        )

        return redirect("hotel-list")

    return render(
        request,
        "hotels/add_hotel.html"
    )

def hotel_detail(request, hotel_id):

    hotel = get_object_or_404(Hotel, id=hotel_id)

    return render(
        request,
        "hotels/hotel_detail.html",
        {
            "hotel": hotel
        }
    )


def edit_hotel(request, hotel_id):

    hotel = get_object_or_404(Hotel, id=hotel_id)

    if request.method == "POST":

        hotel.code = request.POST.get("code")
        hotel.name = request.POST.get("name")
        hotel.phone = request.POST.get("phone")
        hotel.email = request.POST.get("email")
        hotel.address = request.POST.get("address")
        hotel.city = request.POST.get("city")
        hotel.state = request.POST.get("state")
        hotel.country = request.POST.get("country") or "India"
        hotel.pincode = request.POST.get("pincode")
        hotel.description = request.POST.get("description")
        hotel.status = request.POST.get("status") or "active"

        hotel.save()

        return redirect("hotel-list")

    return render(
        request,
        "hotels/edit_hotel.html",
        {
            "hotel": hotel
        }
    )


def toggle_hotel_status(request, hotel_id):

    hotel = get_object_or_404(Hotel, id=hotel_id)

    if hotel.status == "active":
        hotel.status = "inactive"
    else:
        hotel.status = "active"

    hotel.save()

    return redirect("hotel-list")