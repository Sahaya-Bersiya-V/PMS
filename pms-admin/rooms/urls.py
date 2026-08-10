from django.urls import path
from . import views

urlpatterns = [
    path("", views.room_list, name="room-list"),
    path("add/", views.add_room, name="add-room"),
    path("types/", views.room_type_list, name="room-type-list"),
    path("types/add/", views.add_room_type, name="add-room-type"),

]