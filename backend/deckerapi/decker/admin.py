from django.contrib import admin

from .models import Deck, PlayDeck, Like, User

admin.site.register(Deck)
admin.site.register(PlayDeck)
admin.site.register(Like)
admin.site.register(User)
