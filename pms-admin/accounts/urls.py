from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.admin_login, name="login"),
    path("logout/", views.admin_logout, name="logout"),
     # Front Desk login
    path(
        "frontdesk/login/",
        views.frontdesk_login,
        name="frontdesk-login"
    ),
     path(
        "frontdesk/logout/",
        views.frontdesk_logout,
        name="frontdesk-logout"
    ),

    # Front Desk React API login
    path(
        "frontdesk/api/login/",
        views.frontdesk_api_login,
        name="frontdesk-api-login"
    ),
    path("profile/",views.profile,name="profile"),
]