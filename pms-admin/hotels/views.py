
from django.shortcuts import render, redirect,get_object_or_404
from .models import Hotel


def hotel_list(request):

    hotels = Hotel.objects.all()

    search = request.GET.get("search", "").strip()
    status = request.GET.get("status", "")
    state = request.GET.get("state", "")

    # Search
    if search:
        hotels = hotels.filter(
            name__icontains=search
        ) | hotels.filter(
            code__icontains=search
        ) | hotels.filter(
            phone__icontains=search
        )

    # Status filter
    if status:
        hotels = hotels.filter(status=status)

    # State filter
    if state:
        hotels = hotels.filter(state=state)

    context = {
        "hotels": hotels,
        "search": search,
        "status": status,
        "state": state,
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