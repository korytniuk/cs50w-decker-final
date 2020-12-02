from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Deck, PlayDeck, Like, User
from rest_framework import serializers 


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({'user': self.user.username})
        data.update({'id': self.user.id})
        return data
        
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        if validated_data.get('password'):
            validated_data['password'] = make_password(validated_data['password'])
        user = User(**validated_data) 
        user.save()

        return user 


# TODO: move to DeckSerializer
# class LikeSerializer(serializers.ModelSerializer):
#     model = Like
#     fields = []

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck 
        fields = ['id', 'views', 'title', 'tags', 'cards', 'created_by']

class PlayDeckSerializer(serializers.ModelSerializer): 
    class Meta:
        model = PlayDeck
        fields = ['id', 'plays', 'deck', 'cards', 'users', 'created_by']

class PlaysSerializer(serializers.ModelSerializer): 
    deck = DeckSerializer()
    is_played = serializers.SerializerMethodField()

    def get_is_played(self, obj):
        return self.context["request"].user.id in obj.users

    class Meta:
        model = PlayDeck
        fields = ['id', 'plays', 'deck', 'users', 'is_played']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']