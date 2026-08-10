from django.shortcuts import render


def billing_dashboard(request):

    hotels = [
        {
            "id": 1,
            "name": "Hotel Paradise"
        },
        {
            "id": 2,
            "name": "Sea View Resort"
        },
        {
            "id": 3,
            "name": "Mountain Stay"
        }
    ]


    invoices = [

        {
            "hotel_id": 1,
            "invoice_no": "INV001",
            "guest_name": "John Smith",
            "phone": "9876543210",
            "reservation": "RSV001",
            "room": "101",
            "amount": 8500,
            "method": "UPI",
            "status": "Paid",
            "invoice_date": "2026-08-01"
        },

        {
            "hotel_id": 1,
            "invoice_no": "INV002",
            "guest_name": "Emma Davis",
            "phone": "9876543211",
            "reservation": "RSV002",
            "room": "102",
            "amount": 6200,
            "method": "Card",
            "status": "Pending",
            "invoice_date": "2026-08-02"
        },

        {
            "hotel_id": 2,
            "invoice_no": "INV003",
            "guest_name": "Michael Lee",
            "phone": "9988776655",
            "reservation": "RSV003",
            "room": "201",
            "amount": 9100,
            "method": "Cash",
            "status": "Paid",
            "invoice_date": "2026-08-03"
        },

        {
            "hotel_id": 3,
            "invoice_no": "INV004",
            "guest_name": "Sophia Wilson",
            "phone": "9123456789",
            "reservation": "RSV004",
            "room": "301",
            "amount": 7400,
            "method": "UPI",
            "status": "Overdue",
            "invoice_date": "2026-08-05"
        }

    ]


    transactions = [

        {
            "transaction_no": "TXN001",
            "guest_name": "John Smith",
            "invoice_no": "INV001",
            "amount": 8500,
            "method": "UPI",
            "status": "Success",
            "date": "2026-08-01"
        },

        {
            "transaction_no": "TXN002",
            "guest_name": "Emma Davis",
            "invoice_no": "INV002",
            "amount": 6200,
            "method": "Card",
            "status": "Pending",
            "date": "2026-08-02"
        }

    ]


    refunds = [

        {
            "refund_no": "REF001",
            "guest_name": "Sophia Wilson",
            "invoice_no": "INV004",
            "amount": 2000,
            "reason": "Cancellation",
            "status": "Approved",
            "date": "2026-08-05"
        }

    ]


    # ----------------------------
    # GET Filters
    # ----------------------------

    hotel = request.GET.get("hotel", "")
    search = request.GET.get("search", "")
    status = request.GET.get("status", "")
    method = request.GET.get("method", "")
    from_date = request.GET.get("from_date", "")
    to_date = request.GET.get("to_date", "")


    # Hotel Filter

    if hotel:

        invoices = [

            invoice for invoice in invoices

            if str(invoice["hotel_id"]) == hotel

        ]


    # Search Filter

    if search:

        search = search.lower()

        invoices = [

            invoice for invoice in invoices

            if search in invoice["invoice_no"].lower()

            or search in invoice["guest_name"].lower()

            or search in invoice["phone"]

        ]


    # Status Filter

    if status:

        invoices = [

            invoice for invoice in invoices

            if invoice["status"] == status

        ]


    # Payment Method Filter

    if method:

        invoices = [

            invoice for invoice in invoices

            if invoice["method"] == method

        ]


    # Date Filters

    if from_date:

        invoices = [

            invoice for invoice in invoices

            if invoice["invoice_date"] >= from_date

        ]


    if to_date:

        invoices = [

            invoice for invoice in invoices

            if invoice["invoice_date"] <= to_date

        ]


    context = {

        "hotels": hotels,

        "selected_hotel": hotel,

        "search": search,

        "status": status,

        "method": method,

        "from_date": from_date,

        "to_date": to_date,

        "invoices": invoices,

        "transactions": transactions,

        "refunds": refunds,

        "total_billed": 31200,

        "total_paid": 17600,

        "total_pending": 6200,

        "total_overdue": 7400,

    }

    return render(
        request,
        "billing/billing.html",
        context,
    )