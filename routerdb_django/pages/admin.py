from django.contrib import admin
from .models import Router

class RouterAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')

# Register your models here.

admin.site.register(Router, RouterAdmin)
