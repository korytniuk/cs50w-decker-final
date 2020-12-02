from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField 

class User(AbstractUser):
  email = models.EmailField(unique=True)

class TimeStampMixin(models.Model):
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    abstract = True

class Deck(TimeStampMixin):
  title = models.TextField(max_length=120, unique=True)
  tags = ArrayField(models.CharField(max_length=50), size=10, blank=True) # max 10 tags for a deck
  views = models.IntegerField(default=0)
  cards = ArrayField(models.TextField(), size=100, blank=True) # max 100 cards per deck
  created_by = models.ForeignKey(User, on_delete=models.CASCADE)

  def __str__(self):
    return f"{self.title.capitalize()} deck with {len(self.cards)} cards"

class Like(models.Model):
  deck = models.OneToOneField(Deck, related_name="likes", on_delete=models.CASCADE)
  users = models.ManyToManyField(User, blank=True)

  def liked(self, user):
    return True if user in self.users.all() else False

class PlayDeck(TimeStampMixin):
  deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
  plays= models.SmallIntegerField(default=2)
  users = ArrayField(models.IntegerField(), default=list)
  created_by = models.ForeignKey(User, on_delete=models.CASCADE)
  cards = models.JSONField(null=True)

  def get_cards(self):
    return self.cards[:]

  def get_users(self):
    return self.users[:]


