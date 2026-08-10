from django.shortcuts import render

RESERVATIONS = [
    {
        "id": "RSV001",
        "guest": "John Smith",
        "phone": "9876543210",
        "hotel": "Hotel Paradise",
        "room": "201",
        "status": "Checked In",
        "payment": "Paid",
        "check_in": "2026-08-10",
        "check_out": "2026-08-12",
        "amount": "₹8,500",
    },
    {
        "id": "RSV002",
        "guest": "Emma Davis",
        "phone": "9876543211",
        "hotel": "Hotel Paradise",
        "room": "305",
        "status": "Confirmed",
        "payment": "Pending",
        "check_in": "2026-08-15",
        "check_out": "2026-08-18",
        "amount": "₹12,000",
    },
    {
        "id": "RSV003",
        "guest": "Michael Lee",
        "phone": "9988776655",
        "hotel": "Ocean View Resort",
        "room": "102",
        "status": "Checked Out",
        "payment": "Paid",
        "check_in": "2026-08-05",
        "check_out": "2026-08-07",
        "amount": "₹6,500",
    },
]


def reservation_list(request):

    reservations = RESERVATIONS.copy()

    search = request.GET.get("search", "").strip()
    status = request.GET.get("status", "")
    payment = request.GET.get("payment", "")
    check_in = request.GET.get("check_in", "")
    check_out = request.GET.get("check_out", "")

    if search:
        reservations = [
            r for r in reservations
            if search.lower() in r["guest"].lower()
            or search.lower() in r["id"].lower()
            or search.lower() in r["phone"]
            or search.lower() in r["room"]
        ]

    if status:
        reservations = [
            r for r in reservations
            if r["status"] == status
        ]

    if payment:
        reservations = [
            r for r in reservations
            if r["payment"] == payment
        ]

    if check_in:
        reservations = [
            r for r in reservations
            if r["check_in"] >= check_in
        ]

    if check_out:
        reservations = [
            r for r in reservations
            if r["check_out"] <= check_out
        ]

    context = {
        "reservations": reservations,
        "search": search,
        "status": status,
        "payment": payment,
        "check_in": check_in,
        "check_out": check_out,
    }

    return render(
        request,
        "reservations/reservation_list.html",
        context,
    )