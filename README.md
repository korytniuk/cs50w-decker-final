
# Decker 

The main goal of the project is to help users to decide what to do with the help of decks and cards.

## Problem

* Let's imagine that you and your friend want to play a computer game, but you can not decide which one to pick
* You and your spouse want to watch a movie,
but you can not choose one and just endlessly arguing   
* You and your friend want to go out and play some sport, but you do not know what activity to choose

## Solution

So here comes the Decker,
it's a web app whose goal is to make the process of picking easier so you can decide which things to do, to watch, etc., through cards.
E.g. we have two users: Tom and Jerry,
they both want to watch a movie,
Tom using the **Decker** finds or creates a deck *Movies* which consists of 10 cards:

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

After it, Tom shares the deck with Jerry so he can play it too. He picks:

* The Shawshank Redemption (1994)
* The Godfather: Part II (1974)
* Pulp Fiction (1994)

The result of this game will be the intersections of two lists:

* The Shawshank Redemption (1994)
* The Godfather: Part II (1974)

That is it, now Tom and Jerry have a list of movies that they both want to watch.

## App description, folder structure, and tech stack

This project built using React library, Django-rest-framework, and Postgres. Auth process uses JWT, tokens stored in localStorage. 
Several React components created to handle those actions:

* login
* register
* search for existing decks, searchable fields are `tags`, `cards` and `title`
* create a deck with tags and cards
* monitor and filter currently played user's decks
* play a deck
* share a played deck through a link
### Folder structure
/frontend/src  
--/api *contains files to handle authentication and auth calls to API*  
--/components *project components*  
--/config *contains routes*  
--/context *user context for the app*  
/backend/deckerapi/decker *backend app*  
   
### Frontend

* React
* React-Hook-Form
* Chakra-UI
* Axios for API calls 

### Backend

* Django
* Django-rest-framework
* Postgres
* JWT for an authentication process

## Further improvements

The app designed in a way that it could easily extend, 
so the deck can be played by three or more users, now it is limited to two players. 

## HOW TO RUN

`git clone *project_url*`  
`cd frontend`   
`yarn install`  
`yarn start`  
`cd ../backend`  
*Create a virtual environment*  
`python3 -m venv env`  
`source env/bin/activate` *On Windows use* `env\Scripts\activate`

`pip install -r requirements.txt`  
`python manage.py runserver`  
