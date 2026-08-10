from django.urls import path
from . import views

urlpatterns = [
    path("", views.reservation_list, name="reservation-list"),
    path("<int:reservation_id>/", views.reservation_list, name="reservation-details"),
]