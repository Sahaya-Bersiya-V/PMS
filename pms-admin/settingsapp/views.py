from django.shortcuts import render


def settings_page(request):

    hotels = [
        {
            "id": 1,
            "name": "Hotel Paradise",
        },
        {
            "id": 2,
            "name": "Sea View Resort",
        },
        {
            "id": 3,
            "name": "Mountain Stay",
        },
    ]

    context = {
        "hotels": hotels,
    }

    return render(
        request,
        "settingsapp/settings.html",
        context
    )