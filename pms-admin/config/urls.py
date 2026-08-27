"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from reservations.views import reservation_list_page
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("", include("dashboard.urls")),
    path("rooms/", include("rooms.urls")),
    path("employees/", include("employees.urls")),
    path("hotels/", include("hotels.urls")),
    path(
        "reservations/",
        reservation_list_page,
        name="reservation-list"
    ),
    path("api/reservations/",include("reservations.urls")),
    path("billing/",include("billing.urls")),
    path("reports/", include("reports.urls")),
    path("settings/",include("settingsapp.urls")),
    path(
    "api/hotels/",
    include("hotels.api_urls")
),
path(
    "api/room-types/",
    include("rooms.api_room_type_urls")
),
path(
    "api/rooms/",
    include("rooms.api_room_urls")
),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )