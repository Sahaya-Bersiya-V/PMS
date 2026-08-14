from django.urls import path

from .api_views import HotelListAPIView


urlpatterns = [

    path(
        "",
        HotelListAPIView.as_view(),
        name="hotel-api-list"
    ),

]