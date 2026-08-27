from django.contrib import messages
from django.db.models import Sum, Count, Q
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
    # Active Tab
    # -----------------------------------------------------

    active_tab = request.GET.get("tab", "invoice").strip()

    if active_tab not in ["invoice", "transaction"]:
        active_tab = "invoice"

    # =====================================================
    # INVOICE FILTERS
    # =====================================================

    invoice_hotel = request.GET.get(
        "hotel", ""
    ).strip()

    invoice_search = request.GET.get(
        "search", ""
    ).strip()

    invoice_status = request.GET.get(
        "status", ""
    ).strip()

    invoice_from_date = request.GET.get(
        "from_date", ""
    ).strip()

    invoice_to_date = request.GET.get(
        "to_date", ""
    ).strip()

    # =====================================================
    # TRANSACTION FILTERS
    # =====================================================

    transaction_hotel = request.GET.get(
        "transaction_hotel", ""
    ).strip()

    transaction_search = request.GET.get(
        "transaction_search", ""
    ).strip()

    transaction_from_date = request.GET.get(
        "transaction_from_date", ""
    ).strip()

    transaction_to_date = request.GET.get(
        "transaction_to_date", ""
    ).strip()

    # =====================================================
    # INVOICES
    # =====================================================

    invoices = Invoice.objects.select_related(
        "reservation",
        "guest",
        "reservation__room",
        "reservation__hotel",
    ).prefetch_related(
        "payments",
        "refunds",
    ).order_by("-issued_at")

    # -----------------------------------------------------
    # Invoice Hotel
    # -----------------------------------------------------

    if invoice_hotel:
        invoices = invoices.filter(
            reservation__hotel_id=invoice_hotel
        )

    # -----------------------------------------------------
    # Invoice Search
    # Invoice Number / Guest Name / Phone
    # -----------------------------------------------------

    if invoice_search:

        invoices = invoices.filter(
            Q(invoice_number__icontains=invoice_search)
            |
            Q(guest__first_name__icontains=invoice_search)
            |
            Q(guest__last_name__icontains=invoice_search)
            |
            Q(guest__phone__icontains=invoice_search)
        ).distinct()

    # -----------------------------------------------------
    # Invoice Status
    # -----------------------------------------------------

    if invoice_status:

        invoices = invoices.filter(
            status=invoice_status
        )

    # -----------------------------------------------------
    # Invoice From Date
    # -----------------------------------------------------

    if invoice_from_date:

        invoices = invoices.filter(
            issued_at__date__gte=invoice_from_date
        )

    # -----------------------------------------------------
    # Invoice To Date
    # -----------------------------------------------------

    if invoice_to_date:

        invoices = invoices.filter(
            issued_at__date__lte=invoice_to_date
        )

    # =====================================================
    # PAYMENTS / TRANSACTIONS
    # =====================================================

    transactions = Payment.objects.select_related(
        "invoice",
        "invoice__guest",
        "invoice__reservation",
        "invoice__reservation__room",
        "invoice__reservation__hotel",
    ).order_by("-payment_date")

    # -----------------------------------------------------
    # Transaction Hotel
    # -----------------------------------------------------

    if transaction_hotel:

        transactions = transactions.filter(
            invoice__reservation__hotel_id=transaction_hotel
        )

    # -----------------------------------------------------
    # Transaction Search
    #
    # Supports:
    # 1. Transaction ID
    # 2. Invoice Number
    # 3. Guest First Name
    # 4. Guest Last Name
    # 5. Guest Phone
    # -----------------------------------------------------

    if transaction_search:

        transactions = transactions.filter(

            Q(transaction_id__icontains=transaction_search)
            |
            Q(invoice__invoice_number__icontains=transaction_search)
            |
            Q(invoice__guest__first_name__icontains=transaction_search)
            |
            Q(invoice__guest__last_name__icontains=transaction_search)
            |
            Q(invoice__guest__phone__icontains=transaction_search)

        ).distinct()

    # -----------------------------------------------------
    # Transaction From Date
    # -----------------------------------------------------

    if transaction_from_date:

        transactions = transactions.filter(
            payment_date__date__gte=transaction_from_date
        )

    # -----------------------------------------------------
    # Transaction To Date
    # -----------------------------------------------------

    if transaction_to_date:

        transactions = transactions.filter(
            payment_date__date__lte=transaction_to_date
        )

    # =====================================================
    # REFUNDS
    # =====================================================

    refunds = Refund.objects.select_related(
        "invoice",
        "invoice__guest",
        "invoice__reservation",
        "invoice__reservation__room",
        "invoice__reservation__hotel",
    ).order_by("-created_at")

    # Refund hotel filter follows invoice filter
    if invoice_hotel:

        refunds = refunds.filter(
            invoice__reservation__hotel_id=invoice_hotel
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
    # Current Pages
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
    # Page Objects
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

    if invoice_hotel:

        all_invoices = all_invoices.filter(
            reservation__hotel_id=invoice_hotel
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

    if invoice_hotel:

        total_refunds = (
            Refund.objects.filter(
                invoice__reservation__hotel_id=invoice_hotel
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
        # General
        # -------------------------------------------------

        "hotels": hotels,

        "active_tab": active_tab,

        # -------------------------------------------------
        # Invoice Filters
        # -------------------------------------------------

        "selected_hotel": invoice_hotel,

        "search": invoice_search,

        "status": invoice_status,

        "from_date": invoice_from_date,

        "to_date": invoice_to_date,

        # -------------------------------------------------
        # Transaction Filters
        # -------------------------------------------------

        "transaction_hotel": transaction_hotel,

        "transaction_search": transaction_search,

        "transaction_from_date": transaction_from_date,

        "transaction_to_date": transaction_to_date,

        # -------------------------------------------------
        # Paginated Data
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
        # Page Objects
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

        "monthly_revenue": monthly_revenue,
    }

    return render(
        request,
        "billing/billing.html",
        context
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