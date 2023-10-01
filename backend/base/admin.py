from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Restaurant)
admin.site.register(Restaurantmenu)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)