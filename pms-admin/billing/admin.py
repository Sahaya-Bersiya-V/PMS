from django.contrib import admin
from .models import Invoice, Payment


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):

    list_display = (
        "invoice_number",
        "reservation",
        "guest",
        "subtotal",
        "tax_amount",
        "discount_amount",
        "total_amount",
        "paid_amount",
        "status",
        "issued_at",
    )

    list_filter = (
        "status",
        "issued_at",
    )

    search_fields = (
        "invoice_number",
        "guest__first_name",
        "guest__last_name",
        "guest__phone",
        "reservation__reservation_number",
    )

    readonly_fields = (
        "issued_at",
        "updated_at",
    )

    list_per_page = 25


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "invoice",
        "transaction_id",
        "amount",
        "payment_method",
        "status",
        "payment_date",
    )

    list_filter = (
        "payment_method",
        "status",
        "payment_date",
    )

    search_fields = (
        "transaction_id",
        "invoice__invoice_number",
        "invoice__guest__first_name",
        "invoice__guest__last_name",
    )

    readonly_fields = (
        "payment_date",
    )

    list_per_page = 25