# Generated by Django 4.2.4 on 2023-09-01 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_restaurant_rating_alter_restaurantmenu_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='price',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='rating',
            field=models.DecimalField(decimal_places=1, max_digits=1),
        ),
    ]