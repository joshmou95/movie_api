# Movie API

Create a server-side REST API for an application called “myFlix” that interacts with a database that stores data about different movies. 

The web application will provide users with access to information about different movies, directors, and genres. 

Users will be able to sign up, update their personal information, and create a list of their favorite movies.

This is the complete server-side of the web application including the server, business logic, and business layers of the application. It consists of a REST API and database built using JavaScript, Node.js, Express, and MongoDB. It will be accessed via commonly used HTTP methods like GET and POST.

Whenever users of myFlix are interacting with the application, the server-side of the application will be in use, processing their requests and performing operations against the data in the database. These users will be able to use the myFlix application whenever they like to read information about different movies or update their user information, for instance, their list of “Favorite Movies.”

Movie enthusiasts want to be able to access information about different movies, directors, and genres. The server-side of the myFlix application will ensure they have access to this information, that their requests can be processed, and that all necessary data can be stored.

![myflix screenshot](https://user-images.githubusercontent.com/80426764/127749363-831e1a2d-b19f-4e63-a429-9bca4b95dcec.png)

## Essential Features<br>
* Return a list of ALL movies to the user<br>
* Return data (description, genre, director, image URL) about a single movie by title to the user<br>
* Return data about a genre (description) by name/title (e.g., “Thriller”)<br>
* Return data about a director (bio, birth year) by name<br>
* Allow new users to register<br>
* Allow users to update their user info (username, password, email, date of birth)<br>
* Allow users to add a movie to their list of favorites<br>
* Allow users to remove a movie from their list of favorites<br>
* Allow existing users to deregister<br>

## Technical Requirements
* The API must be a Node.js and Express application.
* The API must use REST architecture, with URL endpoints corresponding to the data operations listed above
* The API must use at least three middleware modules, such as the body-parser package for reading data from requests and morgan for logging.
* The API must use a “package.json” file.
* The database must be built using MongoDB.
* The business logic must be modeled with Mongoose.
* The API must provide movie information in JSON format.
* The API must include user authentication and authorization code.
* The API must include data validation logic.
* The API must meet data security regulations.

|Request|URL|HTTP Method|Request body data format|Response body data format|
|--- |--- |--- |--- |--- |
|Return a list of ALL movies to the user|/movies|GET|None|A JSON object holding data about all the movies|
|Return data about a single movie by title to the user|/movies/[Title]|GET|None|A JSON object holding data about a single movie containing description, genre, director, image URL, whether it’s featured or not|
|Return data about a genre (description) by name|/movies/genres/[Name]|GET|None|A JSON object holding data about the genre by the title and description|
|Return data about a director by name|/movies/director/[Name]|GET|None|A JSON object holding data about a director containing bio, birth year, death year|
|Allow new users to register|/users|POST|A JSON object holding data about the user to add including username, password, email, and birthday|A JSON object holding data about the user to added including an ID and Favorite Movies|
|Allow users to update their user info (username, password, email, date of birth)|/users/[Username]|PUT|A JSON object holding data that the user wants to update including username, password, email, and birthday|A JSON object with data about what was updated including username, password, email, and birthday|
|Allow users to add a movie to their list of favorites|/users/[Username]/Movies/[MovieID]|POST|None|A JSON object with added movie ID in FavoriteMovies array|
|Allow users to remove a movie from their list of favorites|/users/[Username]/Movies/[MovieID]|DELETE|None|A JSON object with data that was removed from MovieFavorites|
|Allow existing users to deregister|/users/[Username]|DELETE|None|A text message indicating the user has been removed|
