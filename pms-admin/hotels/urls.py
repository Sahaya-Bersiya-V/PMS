from django.urls import path
from . import views

urlpatterns = [
    path("", views.hotel_list, name="hotel-list"),
    path("add/", views.add_hotel, name="add-hotel"),
]