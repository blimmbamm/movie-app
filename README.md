## Welcome to my movie app project!

I created this MPA movie web app to showcase my React skills. The app is implemented in JavaScript, using React and React Router libraries and basic CSS for styling. 

I hosted the web app on firebase, you can view it here: [https://react-movie-app-a805a.web.app/](https://react-movie-app-a805a.web.app/). IMPORTANT NOTE: The app talks to a backend that is hosted on Render via a free instance, so Render spins down that service after 15 minutes of inactivity. Thus, initial loading of the page may take some seconds.

## Technical description

The data displayed is (indirectly) coming from [TMDB](https://www.themoviedb.org/) by calling their API. Since the API uses an API key for authentication (which I want to and should keep secret), I implemented a simple backend API in Express.js, which basically just adds my API key to the request and then forwards it to the [TMDB API](https://developer.themoviedb.org/docs). You can check out the backend API project [here](https://github.com/blimmbamm/movie-app-tmdb-proxy).

The app is structured in components, mostly created by myself. For the multi range slider on the search page, I used an [implementation by Govind Gupta](https://www.npmjs.com/package/multi-range-slider-react), for the rating stars input element I used the implementation I found [here](https://www.npmjs.com/package/react-simple-star-rating). Some of the components are generic UI elements and are reused throughout the application.

Data fetching is happening in either route loader functions or route action functions to ensure proper error handling and displaying of error elements.

Visitors can login by either connecting to their existing TMDB account or by starting a guest session. When completing the authentication process, a session (or guest session) id is added to the browser session storage, which is then used for querying restricted data. In addition, an authentication state managed by React context is added to the application, just for the case that the user decides to add some own fictional session id to the session storage to circumvent the authentication process. If any data fetching action is performed that results in an unauthorized-error, the users gets logged out by both deleting existing (guest) session ids in the session storage and resetting the authentication state to false.

## What you can do on the page!

On the landing page, users can browse the current top movies according to TMDB. If the user is authenticated, he can also see his rating for the movie, or add or alter a rating, which then is stored in his list of rated movies. If the user is not authenticated, there is a link redirecting to the login page. 

On the search page, users can search for movies by filtering genres (genre filter has OR-logic), actors and release years. Again, the user can see and update their ratings if authenticated. 

The last page, the profile page, is only accessible to authenticated users and displays some user information (if available) and the users list of rated movies. Here, the user can also remove rated movies from his list. 

I also had the idea of implementing some watchlist page, but, unfortunately, managing ratings is the only thing that is possible with both standard sessions and guest sessions.


## Note

Please note that there is no movie detail page implemented because I found it non-beneficial considering the purpose of this web page to add that feature (except for maybe applying dynamic routes, but that should be okay). Users are instead redirected to the respective movie detail page on TMDB.


