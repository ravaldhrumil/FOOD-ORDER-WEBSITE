# Generated by Django 4.2.4 on 2023-09-01 07:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_alter_restaurant_price_alter_restaurant_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='rating',
            field=models.DecimalField(decimal_places=1, max_digits=2),
        ),
    ]
