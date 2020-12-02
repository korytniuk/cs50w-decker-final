
# Decker 

The main goal of the project is to help users to decide what to do through decks and cards.

## Problem

* Let's imagine you and your spouse want to watch a movie,
but you can not decide which one to watch and you just endlessly arguing   
* You and your friend want to play a computer game, but again you can not decide which one to pick
* You and your spouse want to go out and again we have the same problem

## Solution

So here comes the Decker,
it's a web app which goal is to make process of picking easier
and to help you decide which things to do or to watch, etc., through cards.
E.g. we have two users: Tom and Jerry,
they both want to watch a movie,
Tom using **Decker** finds or creates a deck *Movies* which consists of 10 cards:

* The Shawshank Redemption (1994)
* The Godfather (1972)
* The Dark Knight (2008)
* The Godfather: Part II (1974)
* 12 Angry Men (1957) 
* The Lord of the Rings: The Return of the King (2003)
* Pulp Fiction (1994)
* Schindler's List (1993)

Then Tom plays the deck, he picks:

* The Shawshank Redemption (1994)
* The Dark Knight (2008)
* The Godfather: Part II (1974)
* 12 Angry Men (1957)

After Tom shares deck with Jerry, so he can play it too:

* The Shawshank Redemption (1994)
* The Godfather: Part II (1974)
* Pulp Fiction (1994)

The result of the game will be intersections of two lists if any occur:

* The Shawshank Redemption (1994)
* The Godfather: Part II (1974)

That is it, now Tom and Jerry have list of movies that they both want to watch.

## App description
/backend
/frontend

User actions:
* register
* login
* search for decks, searchable fields are `tags`, `cards` and `title`
* create deck
* monitor and filter currently played user's decks
* play a deck
* share a played deck through a link

## Tech stack used

This project was build using React and Django-rest-framework 

### Frontend

* React
* React-Hook-Form
* Chakra-ui

### Backend

* Django
* Django-rest-framework
* postgres
* JWT for authentication process

## Possible improvements

App was designed in a way that it can be easily extended, 
so the deck can be easily played by 3 or more users, now it's limited to 2 players. 
