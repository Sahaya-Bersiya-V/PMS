from django.urls import path

from . import views


urlpatterns = [

    # Rooms
    path(
        "",
        views.room_list,
        name="room-list"
    ),

    path(
        "add/",
        views.add_room,
        name="add-room"
    ),

    path(
        "<int:pk>/",
        views.room_detail,
        name="room-detail"
    ),

    path(
        "<int:pk>/edit/",
        views.edit_room,
        name="edit-room"
    ),

    path(
        "<int:pk>/delete/",
        views.delete_room,
        name="delete-room"
    ),


    # Room Types
    path(
        "types/",
        views.room_type_list,
        name="room-type-list"
    ),

    path(
        "types/add/",
        views.add_room_type,
        name="add-room-type"
    ),

    path(
        "types/<int:pk>/",
        views.room_type_detail,
        name="room-type-detail"
    ),

    path(
        "types/<int:pk>/edit/",
        views.edit_room_type,
        name="edit-room-type"
    ),

    path(
        "types/<int:pk>/delete/",
        views.delete_room_type,
        name="delete-room-type"
    ),

]