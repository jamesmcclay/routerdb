from django.contrib import admin
from django.urls import path,include
from rest_framework import routers
from pages import views

router = routers.DefaultRouter()
router.register(r'routers', views.RouterView, 'router')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
