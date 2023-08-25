from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import RouterSerializer
from .models import Router

# Create your views here.

class RouterView(viewsets.ModelViewSet):
    serializer_class = RouterSerializer
    queryset = Router.objects.all()
