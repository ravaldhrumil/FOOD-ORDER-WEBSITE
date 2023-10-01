from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Restaurant(models.Model):
    id=models.AutoField(primary_key=True,editable=False)
    name=models.CharField(max_length=100,null=False,blank=False)
    description=models.TextField(max_length=200,null=False,blank=False)
    rating=models.DecimalField(max_digits=2,decimal_places=1,null=False,blank=False)
    time=models.IntegerField(null=False,blank=False)
    price=models.IntegerField(null=False,blank=False)
    path=models.ImageField(null=False,blank=False)
    def __str__(self):
        return self.name
class Restaurantmenu(models.Model):
    restaurant=models.ForeignKey(Restaurant,on_delete=models.CASCADE,related_name='content',default="")
    name=models.CharField(max_length=100,null=False,blank=False)
    price=models.IntegerField(null=False,blank=False)
    quantity=models.IntegerField(null=False,blank=False,default=1)
    description=models.TextField(max_length=200,null=False,blank=False)
    img=models.ImageField(null=False,blank=False)

    def __str__(self):
        return self.name
    
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    itemsPrice=models.DecimalField(max_digits=7, decimal_places=2, null=False, blank=False,default=0)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=False, blank=False,default=0)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=False, blank=False,default=0)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=False, blank=False,default=0)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=False)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    id = models.AutoField(primary_key=True, editable=False)
    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    dishid = models.ForeignKey(Restaurantmenu, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    quantity = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    img = models.ImageField(null=False,blank=False,default="")
    id = models.AutoField(primary_key=True, editable=False)
    def __str__(self):
        return str(self.name)
    
class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    street = models.CharField(max_length=500, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    state = models.CharField(max_length=200, null=True, blank=True,default="")
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    id = models.AutoField(primary_key=True, editable=False)
    def __str__(self):
        return str(self.street)
