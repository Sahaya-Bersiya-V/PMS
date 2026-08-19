from django.contrib import messages
from django.db.models import Sum, Count
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone

import csv
import json

from hotels.models import Hotel

from .models import Invoice, Payment, Refund


# =========================================================
# BILLING DASHBOARD
# =========================================================

def billing_dashboard(request):

    # -----------------------------------------------------
    # Hotels
    # -----------------------------------------------------

    hotels = Hotel.objects.all().order_by("name")

    # -----------------------------------------------------
    # Filters
    # -----------------------------------------------------

    hotel = request.GET.get("hotel", "").strip()
    search = request.GET.get("search", "").strip()
    status = request.GET.get("status", "").strip()
    from_date = request.GET.get("from_date", "").strip()
    to_date = request.GET.get("to_date", "").strip()

    # -----------------------------------------------------
    # Invoices
    # -----------------------------------------------------

    invoices = Invoice.objects.select_related(
        "reservation",
        "guest",
        "reservation__room",
        "reservation__hotel",
    ).prefetch_related(
        "payments",
        "refunds",
    ).order_by("-issued_at")

    # Hotel filter

    if hotel:
        invoices = invoices.filter(
            reservation__hotel_id=hotel
        )

    # Search

    if search:

        invoices = invoices.filter(
            guest__first_name__icontains=search
        ) | invoices.filter(
            guest__last_name__icontains=search
        ) | invoices.filter(
            guest__phone__icontains=search
        ) | invoices.filter(
            invoice_number__icontains=search
        )

    # Status

    if status:
        invoices = invoices.filter(
            status=status
        )

    # From date

    if from_date:
        invoices = invoices.filter(
            issued_at__date__gte=from_date
        )

    # To date

    if to_date:
        invoices = invoices.filter(
            issued_at__date__lte=to_date
        )

    # -----------------------------------------------------
    # Payments / Transactions
    # -----------------------------------------------------

    transactions = Payment.objects.select_related(
        "invoice",
        "invoice__guest",
    ).order_by("-payment_date")

    if hotel:
        transactions = transactions.filter(
            invoice__reservation__hotel_id=hotel
        )

    # -----------------------------------------------------
    # Refunds
    # -----------------------------------------------------

    refunds = Refund.objects.select_related(
    "invoice",
    "invoice__guest",
    "invoice__reservation",
    "invoice__reservation__room",
    "invoice__reservation__hotel",
).order_by("-created_at")

    if hotel:
        refunds = refunds.filter(
            invoice__reservation__hotel_id=hotel
        )

    # -----------------------------------------------------
    # Summary
    # -----------------------------------------------------

    all_invoices = Invoice.objects.all()

    if hotel:
        all_invoices = all_invoices.filter(
            reservation__hotel_id=hotel
        )

    total_billed = (
        all_invoices.aggregate(
            total=Sum("total_amount")
        )["total"] or 0
    )

    total_paid = (
        all_invoices.aggregate(
            total=Sum("paid_amount")
        )["total"] or 0
    )

    total_pending = total_billed - total_paid
    total_outstanding = total_billed - total_paid
    total_refunds = (
        Refund.objects.filter(
            invoice__reservation__hotel_id=hotel
        ).aggregate(
            total=Sum("amount")
        )["total"] or 0
        if hotel
        else Refund.objects.aggregate(
            total=Sum("amount")
        )["total"] or 0
    )

    # -----------------------------------------------------
    # Invoice Status Chart
    # -----------------------------------------------------

    status_counts = {
        "Paid": all_invoices.filter(
            status="paid"
        ).count(),

        "Partially Paid": all_invoices.filter(
            status="partially_paid"
        ).count(),

        "Unpaid": all_invoices.filter(
            status="unpaid"
        ).count(),

        "Draft": all_invoices.filter(
            status="draft"
        ).count(),

        "Cancelled": all_invoices.filter(
            status="cancelled"
        ).count(),
    }

    # -----------------------------------------------------
    # Monthly Revenue
    # -----------------------------------------------------

    current_year = timezone.now().year

    monthly_revenue = []

    for month in range(1, 13):

        amount = (
            all_invoices
            .filter(
                issued_at__year=current_year,
                issued_at__month=month,
            )
            .aggregate(
                total=Sum("total_amount")
            )["total"] or 0
        )

        monthly_revenue.append(float(amount))

    # -----------------------------------------------------
    # Context
    # -----------------------------------------------------

    context = {

        "hotels": hotels,

        "selected_hotel": hotel,

        "search": search,

        "status": status,

        "from_date": from_date,

        "to_date": to_date,

        "invoices": invoices,

        "transactions": transactions,

        "refunds": refunds,

        "total_billed": total_billed,

        "total_paid": total_paid,

        "total_pending": total_pending,
        "total_outstanding": total_outstanding,


        "total_refunds": total_refunds,

        "status_counts": 
            status_counts
        ,

        "monthly_revenue": json.dumps(
            monthly_revenue
        ),
    }

    return render(
        request,
        "billing/billing.html",
        context,
    )


# =========================================================
# EXPORT BILLING REPORT
# =========================================================

def export_billing_report(request):

    invoices = Invoice.objects.select_related(
        "guest",
        "reservation",
    ).order_by("-issued_at")

    response = HttpResponse(
        content_type="text/csv"
    )

    response[
        "Content-Disposition"
    ] = 'attachment; filename="billing_report.csv"'

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

            invoice.guest,

            invoice.reservation,

            invoice.total_amount,

            invoice.paid_amount,

            invoice.balance_amount,

            invoice.get_status_display(),

            invoice.issued_at.strftime(
                "%Y-%m-%d"
            ),
        ])

    return response


# =========================================================
# INVOICE DETAIL
# =========================================================

def invoice_detail(request, pk):

    invoice = get_object_or_404(
        Invoice.objects.select_related(
            "guest",
            "reservation",
            "reservation__room",
            "reservation__hotel",
        ).prefetch_related(
            "payments",
            "refunds",
        ),
        pk=pk,
    )

    return render(
        request,
        "billing/invoice_detail.html",
        {
            "invoice": invoice,
        }
    )