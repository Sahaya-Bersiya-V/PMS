from django.urls import path
from . import views


app_name = "billing"


urlpatterns = [

    path(
        "",
        views.billing_dashboard,
        name="billing_dashboard"
    ),

    path(
        "export/",
        views.export_billing_report,
        name="export_billing_report"
    ),

    path(
        "invoice/<int:pk>/",
        views.invoice_detail,
        name="invoice_detail"
    ),

]