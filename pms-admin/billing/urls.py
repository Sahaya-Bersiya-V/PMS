from django.urls import path
from . import views

app_name = "billing"

urlpatterns = [

    # Billing Dashboard
    path(
        "",
        views.billing_dashboard,
        name="billing_dashboard"
    ),

]