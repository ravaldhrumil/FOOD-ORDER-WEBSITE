# Generated by Django 4.2.4 on 2023-08-31 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurantmenu',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=4),
        ),
    ]