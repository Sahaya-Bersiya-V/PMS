from django.contrib.auth.decorators import login_required
from accounts.decorators import admin_required
from django.db.models import Sum, Count, Q
from django.shortcuts import render
from django.utils import timezone

from hotels.models import Hotel
from rooms.models import Room
from reservations.models import Guest, Reservation
from employees.models import Employee


@login_required(login_url="accounts:login")
@admin_required
def dashboard(request):

    # =====================================================
    # CURRENT DATE
    # =====================================================

    today = timezone.localdate()


    # =====================================================
    # HOTEL FILTER
    # =====================================================

    selected_hotel = request.GET.get("hotel", "")

    hotels = Hotel.objects.filter(
        status="active"
    ).order_by("name")


    # =====================================================
    # BASE QUERYSETS
    # =====================================================

    rooms = Room.objects.all()

    guests = Guest.objects.all()

    reservations = Reservation.objects.all()

    employees = Employee.objects.all()


    # =====================================================
    # FILTER BY HOTEL
    # =====================================================

    if selected_hotel:

        rooms = rooms.filter(
            hotel_id=selected_hotel
        )

        reservations = reservations.filter(
            hotel_id=selected_hotel
        )

        employees = employees.filter(
            hotel_id=selected_hotel
        )

        guests = guests.filter(
            reservations__hotel_id=selected_hotel
        ).distinct()


    # =====================================================
    # TOTAL GUESTS
    # =====================================================

    total_guests = guests.count()


    # =====================================================
    # ROOM COUNTS
    # =====================================================

    occupied_rooms = rooms.filter(
        status="occupied"
    ).count()

    available_rooms = rooms.filter(
        status="available"
    ).count()

    cleaning_rooms = rooms.filter(
        status="cleaning"
    ).count()

    maintenance_rooms = rooms.filter(
        status="maintenance"
    ).count()


    # =====================================================
    # CHECK-INS
    # =====================================================

    today_checkins = reservations.filter(
        check_in__date=today
    ).exclude(
        status__in=[
            "cancelled",
            "no_show",
        ]
    ).count()


    # =====================================================
    # CHECK-OUTS
    # =====================================================

    today_checkouts = reservations.filter(
        check_out__date=today
    ).exclude(
        status__in=[
            "cancelled",
            "no_show",
        ]
    ).count()


    # =====================================================
    # BOOKINGS
    # =====================================================

    total_bookings = reservations.count()


    # =====================================================
    # EMPLOYEES
    # =====================================================

    total_employees = employees.filter(
        status="active"
    ).count()


    # =====================================================
    # TODAY'S REVENUE
    # =====================================================
    #
    # Here revenue means reservations created today.
    #
    # If you later create a separate Payment model,
    # we can calculate actual collected revenue from
    # payments instead.
    # =====================================================

    revenue_data = reservations.filter(
        created_at__date=today
    ).aggregate(
        total=Sum("total_amount")
    )

    todays_revenue = revenue_data["total"] or 0

    pending_amount_data = reservations.filter(
        payment_status="pending"
    ).aggregate(
        total=Sum("total_amount"),
        paid=Sum("advance_amount"),
    )

    pending_amount = (
        pending_amount_data["total"] or 0
    ) - (
        pending_amount_data["paid"] or 0
    )


    # =====================================================
    # RECENT RESERVATIONS
    # =====================================================

    recent_reservations = reservations.select_related(
        "guest",
        "room",
        "hotel"
    ).order_by(
        "-created_at"
    )[:5]


    # =====================================================
    # CONTEXT
    # =====================================================

    context = {

        # Hotels
        "hotels": hotels,
        "selected_hotel": selected_hotel,

        # Summary
        "total_guests": total_guests,
        "occupied_rooms": occupied_rooms,
        "available_rooms": available_rooms,
        "todays_revenue": todays_revenue,
        "pending_amount": pending_amount,
        "today_checkins": today_checkins,
        "today_checkouts": today_checkouts,
        "total_employees": total_employees,
        "total_bookings": total_bookings,

        # Room status
        "cleaning_rooms": cleaning_rooms,
        "maintenance_rooms": maintenance_rooms,

        # Recent reservations
        "recent_reservations": recent_reservations,

    }


    return render(
        request,
        "dashboard/dashboard.html",
        context
    )