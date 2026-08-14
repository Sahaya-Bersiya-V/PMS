from django.urls import path
from . import views
from .api_views import HotelListAPIView
urlpatterns = [
    path("", views.hotel_list, name="hotel-list"),
    path("add/", views.add_hotel, name="add-hotel"),
     path("<int:hotel_id>/", views.hotel_detail, name="hotel-detail"),
    path("<int:hotel_id>/edit/", views.edit_hotel, name="edit-hotel"),
    path("<int:hotel_id>/toggle-status/", views.toggle_hotel_status, name="toggle-hotel-status"),
      path(
        "api/",
        HotelListAPIView.as_view(),
        name="hotel-api"
    ),


]