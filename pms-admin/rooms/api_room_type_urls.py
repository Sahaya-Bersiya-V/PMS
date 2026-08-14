from django.urls import path

from .api_views import RoomTypeListAPIView


urlpatterns = [

    path(
        "",
        RoomTypeListAPIView.as_view(),
        name="room-type-api-list"
    ),

]