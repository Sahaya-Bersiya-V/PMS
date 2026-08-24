from django.contrib import messages
from django.db.models import Sum, Count
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.core.paginator import Paginator

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

    # =====================================================
    # PAGINATION
    # =====================================================

    invoice_paginator = Paginator(
        invoices,
        5
    )

    transaction_paginator = Paginator(
        transactions,
        5
    )

    refund_paginator = Paginator(
        refunds,
        5
    )

    # -----------------------------------------------------
    # Current pages
    # -----------------------------------------------------

    invoice_page_number = request.GET.get(
        "invoice_page",
        1
    )

    transaction_page_number = request.GET.get(
        "transaction_page",
        1
    )

    refund_page_number = request.GET.get(
        "refund_page",
        1
    )

    # -----------------------------------------------------
    # Page objects
    # -----------------------------------------------------

    invoices_page = invoice_paginator.get_page(
        invoice_page_number
    )

    transactions_page = transaction_paginator.get_page(
        transaction_page_number
    )

    refunds_page = refund_paginator.get_page(
        refund_page_number
    )

    # =====================================================
    # SUMMARY
    # =====================================================

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

    total_pending = (
        total_billed - total_paid
    )

    total_outstanding = (
        total_billed - total_paid
    )

    # -----------------------------------------------------
    # Total Refunds
    # -----------------------------------------------------

    if hotel:

        total_refunds = (
            Refund.objects.filter(
                invoice__reservation__hotel_id=hotel
            ).aggregate(
                total=Sum("amount")
            )["total"] or 0
        )

    else:

        total_refunds = (
            Refund.objects.aggregate(
                total=Sum("amount")
            )["total"] or 0
        )

    # =====================================================
    # INVOICE STATUS CHART
    # =====================================================

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

    # =====================================================
    # MONTHLY REVENUE
    # =====================================================

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

        monthly_revenue.append(
            float(amount)
        )

    # =====================================================
    # CONTEXT
    # =====================================================

    context = {

        # -------------------------------------------------
        # Filters
        # -------------------------------------------------

        "hotels": hotels,

        "selected_hotel": hotel,

        "search": search,

        "status": status,

        "from_date": from_date,

        "to_date": to_date,

        # -------------------------------------------------
        # Paginated data
        # -------------------------------------------------

        "invoices": invoices_page,

        "transactions": transactions_page,

        "refunds": refunds_page,

        # -------------------------------------------------
        # Paginators
        # -------------------------------------------------

        "invoice_paginator": invoice_paginator,

        "transaction_paginator": transaction_paginator,

        "refund_paginator": refund_paginator,

        # -------------------------------------------------
        # Page objects
        # -------------------------------------------------

        "invoices_page": invoices_page,

        "transactions_page": transactions_page,

        "refunds_page": refunds_page,

        # -------------------------------------------------
        # Summary
        # -------------------------------------------------

        "total_billed": total_billed,

        "total_paid": total_paid,

        "total_pending": total_pending,

        "total_outstanding": total_outstanding,

        "total_refunds": total_refunds,

        # -------------------------------------------------
        # Charts
        # -------------------------------------------------

        "status_counts": status_counts,

        "monthly_revenue": 
            monthly_revenue
        ,
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