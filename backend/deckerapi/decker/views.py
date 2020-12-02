from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, filters, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.validators import ValidationError 
from django.db.utils import IntegrityError
from .serializers import UserSerializer, PlayDeckSerializer, PlaysSerializer, GroupSerializer, DeckSerializer, CreateUserSerializer, CustomTokenObtainPairSerializer
from .models import Deck, User, PlayDeck
from django.db.models import Q


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]



class CustomTokenObtainPairView(TokenObtainPairView):
    # Replace the serializer with your custom
    serializer_class = CustomTokenObtainPairSerializer

class RegisterAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except:  
            return Response("Invalid params", status=status.HTTP_400_BAD_REQUEST)
            
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)


class DeckViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows decks to be viewed or edited.
    """
    queryset = Deck.objects.all().order_by('-created_at')
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'tags', 'cards']

    serializer_class = DeckSerializer 
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        # Update views count
        try:
            deck = Deck.objects.get(pk=kwargs['pk'])
            deck.views += 1
            deck.save()
        except:
            pass

        return super().retrieve(self, request, *args, **kwargs)

class PlaysList(generics.ListAPIView):
    serializer_class = PlaysSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['deck__title', 'deck__tags']
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return PlayDeck.objects.filter(Q(users__contains=[self.request.user.id]) | Q(created_by=self.request.user.id)).order_by('-updated_at')


class CreatePlayDeck(APIView):
    serializer_class = PlayDeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        deck = get_object_or_404(Deck, pk=kwargs['pk'])
        cards = request.data.get('cards', [])
        data = dict(cards=cards, deck=deck.id, created_by=request.user.id) 
        serializer = PlayDeckSerializer(data=data)
        if serializer.is_valid():
            play_deck = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class PlayDeckView(APIView):
    serializer_class = PlayDeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # check if plays is not 0 and insert cards in the deck
        play_deck = get_object_or_404(PlayDeck, pk=kwargs['pk']) 

        if play_deck.plays:
            # todo
            cards = request.data
            if len(cards) == 0:
                return Response("Pick at least one card", status=status.HTTP_400_BAD_REQUEST) 

            updated_cards = play_deck.get_cards()
            updated_users = play_deck.get_users()

            updated_cards.append(cards)
            updated_users.append(request.user.id)

            data={"cards": updated_cards, "users": updated_users, "plays": play_deck.plays - 1}
            serializer = PlayDeckSerializer(play_deck, data=data, partial=True)

            if serializer.is_valid():
                play_deck = serializer.save()

                return Response({"finished": False if play_deck.plays else True}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        else:
            return Response("Deck has already finished", status=status.HTTP_400_BAD_REQUEST) 

    
    def get(self, request, pk):
        play_deck = get_object_or_404(PlayDeck, pk=pk) 

        if play_deck.plays:
            if request.user.id in play_deck.users:
                return Response({"played": True }, status=status.HTTP_200_OK)

            deck = get_object_or_404(Deck, pk=play_deck.deck.id)

            return Response({"finished": False, "deck": DeckSerializer(deck).data}, status=status.HTTP_200_OK)
        else:
            # Return calculated result
            for cards in play_deck.cards: 
                if len(cards) > 0:
                    try:
                        result = result.intersection(cards)
                    except:
                        result = set(cards)

            return Response({"finished": True, "result": result}, status=status.HTTP_200_OK)


class CreateDeck(APIView):
    serializer_class = DeckSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
            cards = request.data.get('cards', [])
            tags = request.data.get('tags', [])
            created_by = request.user.id
            title = request.data.get('title')
            data = dict(title=title, cards=cards, tags=tags, created_by=created_by) 
            serializer = DeckSerializer(data=data)
            if serializer.is_valid():
                deck = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]