from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
import json
from datetime import timedelta, datetime
import csv

from reservations.models import Reservation, Guest
from billing.models import Invoice, Payment, Refund
from rooms.models import Room
from hotels.models import Hotel


# =========================================================
# REPORTS DASHBOARD
# =========================================================

def reports_dashboard(request):

    # -----------------------------------------------------
    # DATE RANGE
    # -----------------------------------------------------

    today = timezone.localdate()

    default_start = today - timedelta(days=6)

    start_date_string = request.GET.get(
        "start_date",
        default_start.strftime("%Y-%m-%d")
    )

    end_date_string = request.GET.get(
        "end_date",
        today.strftime("%Y-%m-%d")
    )

    try:
        start_date = datetime.strptime(
            start_date_string,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        start_date = default_start

    try:
        end_date = datetime.strptime(
            end_date_string,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        end_date = today


    # -----------------------------------------------------
    # HOTEL FILTER
    # -----------------------------------------------------

    selected_hotel = request.GET.get(
        "hotel",
        ""
    )

    hotels = Hotel.objects.all().order_by("name")


    # -----------------------------------------------------
    # BASE RESERVATIONS
    # -----------------------------------------------------

    reservations = Reservation.objects.select_related(
        "guest",
        "room",
        "room__room_type",
        "hotel",
    ).filter(
        check_in__date__lte=end_date,
        check_out__date__gte=start_date,
    ).exclude(
        status__in=[
            "cancelled",
            "no_show",
        ]
    )


    if selected_hotel:

        reservations = reservations.filter(
            hotel_id=selected_hotel
        )


    # -----------------------------------------------------
    # INVOICES
    # -----------------------------------------------------

    invoices = Invoice.objects.select_related(
        "guest",
        "reservation",
        "reservation__hotel",
    ).filter(
        issued_at__date__gte=start_date,
        issued_at__date__lte=end_date,
    )


    if selected_hotel:

        invoices = invoices.filter(
            reservation__hotel_id=selected_hotel
        )


    # -----------------------------------------------------
    # PAYMENTS
    # -----------------------------------------------------

    payments = Payment.objects.select_related(
        "invoice",
        "invoice__reservation",
        "invoice__reservation__hotel",
    ).filter(
        payment_date__date__gte=start_date,
        payment_date__date__lte=end_date,
        status="successful",
    )


    if selected_hotel:

        payments = payments.filter(
            invoice__reservation__hotel_id=selected_hotel
        )


    # -----------------------------------------------------
    # REFUNDS
    # -----------------------------------------------------

    refunds = Refund.objects.select_related(
        "invoice",
        "invoice__reservation",
        "invoice__reservation__hotel",
    ).filter(
        created_at__date__gte=start_date,
        created_at__date__lte=end_date,
    )


    if selected_hotel:

        refunds = refunds.filter(
            invoice__reservation__hotel_id=selected_hotel
        )


    # =====================================================
    # KPI 1 - TOTAL REVENUE
    # =====================================================

    total_revenue = (
        invoices.aggregate(
            total=Sum("total_amount")
        )["total"] or 0
    )


    # =====================================================
    # KPI 2 - TOTAL BOOKINGS
    # =====================================================

    total_bookings = reservations.count()


    # =====================================================
    # ROOM COUNT
    # =====================================================

    rooms = Room.objects.all()

    if selected_hotel:

        rooms = rooms.filter(
            hotel_id=selected_hotel
        )

    total_rooms = rooms.count()


    # =====================================================
    # OCCUPIED ROOM NIGHTS
    # =====================================================

    occupied_room_nights = 0

    for reservation in reservations:

        reservation_start = max(
            reservation.check_in.date(),
            start_date
        )

        reservation_end = min(
            reservation.check_out.date(),
            end_date + timedelta(days=1)
        )

        nights = (
            reservation_end - reservation_start
        ).days

        if nights > 0:

            occupied_room_nights += (
                nights * reservation.number_of_rooms
            )


    # =====================================================
    # AVAILABLE ROOM NIGHTS
    # =====================================================

    number_of_days = (
        end_date - start_date
    ).days + 1

    available_room_nights = (
        total_rooms * number_of_days
    )


    # =====================================================
    # OCCUPANCY RATE
    # =====================================================

    if available_room_nights > 0:

        occupancy_rate = (
            occupied_room_nights /
            available_room_nights
        ) * 100

    else:

        occupancy_rate = 0


    # =====================================================
    # ADR
    # =====================================================

    if occupied_room_nights > 0:

        adr = (
            total_revenue /
            occupied_room_nights
        )

    else:

        adr = 0


    # =====================================================
    # REVPAR
    # =====================================================

    if available_room_nights > 0:

        revpar = (
            total_revenue /
            available_room_nights
        )

    else:

        revpar = 0


    # =====================================================
    # PAYMENT SUMMARY
    # =====================================================

    total_received = (
        payments.aggregate(
            total=Sum("amount")
        )["total"] or 0
    )


    pending_payments = (
        invoices.aggregate(
            total=Sum("total_amount")
        )["total"] or 0
    ) - total_received


    refunds_issued = (
        refunds.filter(
            status="approved"
        ).aggregate(
            total=Sum("amount")
        )["total"] or 0
    )


    # =====================================================
    # CANCELLED BOOKINGS
    # =====================================================

    cancelled_queryset = Reservation.objects.filter(
        status="cancelled",
        updated_at__date__gte=start_date,
        updated_at__date__lte=end_date,
    )

    if selected_hotel:

        cancelled_queryset = cancelled_queryset.filter(
            hotel_id=selected_hotel
        )

    cancelled_bookings = cancelled_queryset.count()


    # =====================================================
    # NO SHOW BOOKINGS
    # =====================================================

    no_show_queryset = Reservation.objects.filter(
        status="no_show",
        updated_at__date__gte=start_date,
        updated_at__date__lte=end_date,
    )

    if selected_hotel:

        no_show_queryset = no_show_queryset.filter(
            hotel_id=selected_hotel
        )

    no_show_bookings = no_show_queryset.count()


    # =====================================================
    # REVENUE CHART
    # =====================================================

    revenue_labels = []
    revenue_values = []

    current_date = start_date

    while current_date <= end_date:

        amount = (
            invoices.filter(
                issued_at__date=current_date
            ).aggregate(
                total=Sum("total_amount")
            )["total"] or 0
        )

        revenue_labels.append(
            current_date.strftime("%d %b")
        )

        revenue_values.append(
            float(amount)
        )

        current_date += timedelta(days=1)


    # =====================================================
    # BOOKING SOURCE
    # =====================================================

    source_counts = {}

    for reservation in reservations:

        source = reservation.get_booking_source_display()

        source_counts[source] = (
            source_counts.get(source, 0) + 1
        )


    # =====================================================
    # ROOM TYPE PERFORMANCE
    # =====================================================

    room_type_data = []

    room_type_ids = (
        reservations
        .values_list(
            "room__room_type_id",
            flat=True
        )
        .distinct()
    )


    for room_type_id in room_type_ids:

        room_reservations = reservations.filter(
            room__room_type_id=room_type_id
        )

        if not room_reservations.exists():
            continue

        room_type = (
            room_reservations
            .first()
            .room
            .room_type
        )


        revenue = (
            invoices.filter(
                reservation__room__room_type_id=room_type_id
            ).aggregate(
                total=Sum("total_amount")
            )["total"] or 0
        )


        room_count = rooms.filter(
            room_type_id=room_type_id
        ).count()


        occupied = 0

        for reservation in room_reservations:

            reservation_start = max(
                reservation.check_in.date(),
                start_date
            )

            reservation_end = min(
                reservation.check_out.date(),
                end_date + timedelta(days=1)
            )

            nights = (
                reservation_end -
                reservation_start
            ).days

            if nights > 0:

                occupied += (
                    nights *
                    reservation.number_of_rooms
                )


        available = (
            room_count *
            number_of_days
        )


        occupancy = (
            occupied / available * 100
            if available > 0
            else 0
        )


        room_adr = (
            revenue / occupied
            if occupied > 0
            else 0
        )


        room_type_data.append({

            "name":
                room_type.name,

            "occupancy":
                round(occupancy, 1),

            "adr":
                float(room_adr),

            "revenue":
                float(revenue),

        })


    # =====================================================
    # RECENT RESERVATIONS
    # =====================================================

    recent_reservations = Reservation.objects.select_related(
        "guest",
        "room",
        "hotel",
    ).order_by(
        "-created_at"
    )


    if selected_hotel:

        recent_reservations = recent_reservations.filter(
            hotel_id=selected_hotel
        )


    recent_reservations = recent_reservations[:5]


    # =====================================================
    # TOP GUESTS
    # =====================================================

    guest_data = []


    guest_ids = (
        reservations
        .values_list(
            "guest_id",
            flat=True
        )
        .distinct()
    )


    for guest_id in guest_ids:

        guest_reservations = reservations.filter(
            guest_id=guest_id
        )

        guest = guest_reservations.first().guest

        guest_revenue = (
            invoices.filter(
                guest_id=guest_id
            ).aggregate(
                total=Sum("total_amount")
            )["total"] or 0
        )


        guest_data.append({

            "name":
                f"{guest.first_name} {guest.last_name}".strip(),

            "bookings":
                guest_reservations.count(),

            "total_spent":
                float(guest_revenue),

        })


    guest_data.sort(
        key=lambda x: x["total_spent"],
        reverse=True
    )


    guest_data = guest_data[:5]


    # =====================================================
    # DAILY PERFORMANCE
    # =====================================================

    daily_performance = []

    current_date = end_date

    while current_date >= start_date:

        daily_reservations = Reservation.objects.filter(
            created_at__date=current_date
        )


        if selected_hotel:

            daily_reservations = daily_reservations.filter(
                hotel_id=selected_hotel
            )


        bookings = daily_reservations.count()


        check_ins = daily_reservations.filter(
            status__in=[
                "checked_in",
                "checked_out"
            ]
        ).count()


        check_outs = daily_reservations.filter(
            check_out__date=current_date
        ).exclude(
            status="cancelled"
        ).count()


        daily_invoices = invoices.filter(
            issued_at__date=current_date
        )


        daily_revenue = (
            daily_invoices.aggregate(
                total=Sum("total_amount")
            )["total"] or 0
        )


        daily_occupancy = occupancy_rate


        daily_performance.append({

            "date":
                current_date,

            "bookings":
                bookings,

            "check_ins":
                check_ins,

            "check_outs":
                check_outs,

            "occupancy":
                round(
                    daily_occupancy,
                    1
                ),

            "adr":
                float(adr),

            "revpar":
                float(revpar),

            "revenue":
                float(daily_revenue),

        })


        current_date -= timedelta(days=1)


    # =====================================================
    # CONTEXT
    # =====================================================
    source_counts_json = json.dumps(source_counts)
    context = {

        "hotels":
            hotels,

        "selected_hotel":
            selected_hotel,

        "start_date":
            start_date.strftime("%Y-%m-%d"),

        "end_date":
            end_date.strftime("%Y-%m-%d"),


        # KPIs

        "total_revenue":
            total_revenue,

        "total_bookings":
            total_bookings,

        "occupancy_rate":
            occupancy_rate,

        "adr":
            adr,

        "revpar":
            revpar,


        # Charts

        "revenue_labels":
            revenue_labels,

        "revenue_values":
            revenue_values,

        "source_counts":
            source_counts,
        "source_counts_json": source_counts_json,
        "source_counts_json":
        json.dumps(source_counts),


        # Tables

        "room_type_data":
            room_type_data,

        "recent_reservations":
            recent_reservations,

        "guest_data":
            guest_data,

        "daily_performance":
            daily_performance,


        # Payment summary

        "total_received":
            total_received,

        "pending_payments":
            pending_payments,

        "refunds_issued":
            refunds_issued,

        "cancelled_bookings":
            cancelled_bookings,

        "no_show_bookings":
            no_show_bookings,

    }


    return render(
        request,
        "reports/reports.html",
        context
    )


# =========================================================
# EXPORT REPORT
# =========================================================

def export_reports(request):

    start_date_string = request.GET.get(
        "start_date"
    )

    end_date_string = request.GET.get(
        "end_date"
    )


    if not start_date_string:

        start_date = (
            timezone.localdate()
            - timedelta(days=6)
        )

    else:

        start_date = datetime.strptime(
            start_date_string,
            "%Y-%m-%d"
        ).date()


    if not end_date_string:

        end_date = timezone.localdate()

    else:

        end_date = datetime.strptime(
            end_date_string,
            "%Y-%m-%d"
        ).date()


    invoices = Invoice.objects.filter(
        issued_at__date__gte=start_date,
        issued_at__date__lte=end_date,
    ).select_related(
        "guest",
        "reservation",
    )


    response = HttpResponse(
        content_type="text/csv"
    )


    response[
        "Content-Disposition"
    ] = (
        'attachment; '
        'filename="pms_report.csv"'
    )


    writer = csv.writer(response)


    writer.writerow([
        "Invoice",
        "Guest",
        "Reservation",
        "Total Amount",
        "Paid Amount",
        "Balance",
        "Status",
        "Date",
    ])


    for invoice in invoices:

        writer.writerow([

            invoice.invoice_number,

            str(invoice.guest),

            invoice.reservation.reservation_number,

            invoice.total_amount,

            invoice.paid_amount,

            invoice.balance_amount,

            invoice.get_status_display(),

            invoice.issued_at.strftime(
                "%Y-%m-%d"
            ),

        ])


    return response