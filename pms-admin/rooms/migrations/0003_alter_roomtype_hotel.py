from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("hotels", "0001_initial"),
        ("rooms", "0002_roomtype_hotel"),
    ]

    operations = [
        migrations.AlterField(
            model_name="roomtype",
            name="hotel",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="room_types",
                to="hotels.hotel",
            ),
        ),
    ]