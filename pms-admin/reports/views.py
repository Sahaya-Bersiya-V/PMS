from django.shortcuts import render


def reports_dashboard(request):

    hotels = [
        {"id": 1, "name": "Hotel Paradise"},
        {"id": 2, "name": "Sea View Resort"},
        {"id": 3, "name": "Mountain Stay"},
    ]

    report_types = [
        "Revenue Report",
        "Reservation Report",
        "Occupancy Report",
        "Guest Report",
        "Employee Report",
        "Room Report",
        "Payment Report",
    ]

    selected_hotel = request.GET.get("hotel", "")
    selected_report = request.GET.get("report", "")
    from_date = request.GET.get("from_date", "")
    to_date = request.GET.get("to_date", "")

    report_data = [
        {
            "hotel": "Hotel Paradise",
            "revenue": 250000,
            "reservations": 180,
            "occupancy": "82%",
            "guests": 265,
            "adr": 4200,
            "revpar": 3444,
        },
        {
            "hotel": "Sea View Resort",
            "revenue": 180000,
            "reservations": 140,
            "occupancy": "74%",
            "guests": 210,
            "adr": 3900,
            "revpar": 2886,
        },
        {
            "hotel": "Mountain Stay",
            "revenue": 120000,
            "reservations": 95,
            "occupancy": "68%",
            "guests": 140,
            "adr": 3500,
            "revpar": 2380,
        },
    ]

    if selected_hotel:
        report_data = [
            report for report in report_data
            if report["hotel"] == selected_hotel
        ]

    context = {

        "page_title": "Reports",

        "page_subtitle": "Business analytics and hotel insights",

        "hotels": hotels,

        "report_types": report_types,

        "selected_hotel": selected_hotel,

        "selected_report": selected_report,

        "from_date": from_date,

        "to_date": to_date,

        "reports": report_data,

        "total_revenue": "₹5,50,000",

        "total_bookings": 415,

        "occupancy_rate": "76%",

        "total_guests": 615,

    }

    return render(
        request,
        "reports/reports.html",
        context,
    )