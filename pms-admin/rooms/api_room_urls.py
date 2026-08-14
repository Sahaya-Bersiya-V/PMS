from django.urls import path

from .api_views import RoomListAPIView


urlpatterns = [

    path(
        "",
        RoomListAPIView.as_view(),
        name="room-api-list"
    ),

]