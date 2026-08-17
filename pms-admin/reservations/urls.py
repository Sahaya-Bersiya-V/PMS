from django.urls import path

from .views import (
    reservation_list_page,
    ReservationListCreateView,
    ReservationDetailView,
    AvailableRoomsView,
    CheckInView,
    CheckOutView,
    CancelReservationView,
    MarkPaymentPaidView,
    GuestListView,
    GuestDetailView,
    reservation_ui_detail
)


urlpatterns = [

    path(
        "ui/",
        reservation_list_page,
        name="reservation-list"
    ),

    path(
    "<int:pk>/view/",
    reservation_ui_detail,
    name="reservation-ui-detail"
),

    path(
        "guests/",
        GuestListView.as_view(),
        name="guest-list"
    ),

    path(
    "guests/<int:pk>/",
    GuestDetailView.as_view(),
    name="guest-detail"
),

    path(
        "",
        ReservationListCreateView.as_view(),
        name="reservation-api"
    ),

    path(
            "available-rooms/",
            AvailableRoomsView.as_view(),
            name="available-rooms-api"
        ),

    path(
        "<int:pk>/",
        ReservationDetailView.as_view(),
        name="reservation-detail-api"
    ),

    

    path(
        "<int:pk>/check-in/",
        CheckInView.as_view(),
        name="reservation-check-in"
    ),

    path(
        "<int:pk>/check-out/",
        CheckOutView.as_view(),
        name="reservation-check-out"
    ),

    path(
        "<int:pk>/cancel/",
        CancelReservationView.as_view(),
        name="reservation-cancel"
    ),

    path(
        "<int:pk>/mark-paid/",
        MarkPaymentPaidView.as_view(),
        name="reservation-mark-paid"
    ),
]