import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout, { StandardLayout, ProfileLayout } from "./pages/Layouts";
import Home from "./pages/Home";
import Search, {
  loader as searchLoader,
  action as searchAction,
} from "./pages/Search";
import Profile, { loader as profileLoader } from "./pages/Profile";
import Ratings, {
  loader as ratingsDataLoader,
  action as ratingsDataActions,
} from "./pages/Ratings";
import Logout, { loader as logoutLoader } from "./pages/Logout";
import Error from "./pages/Error";
import {
  topMoviesLoader,
  action as topMoviesAction,
} from "./components/movies/TopMovies";
import Authenticate, {
  loader as authenticationLoader,
  confirmLoader as authenticationConfirmLoader,
} from "./pages/Authenticate";
import Login from "./pages/Login";
import { action as movieActions } from "./components/movies/Movie";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    action: movieActions,
    children: [
      {
        path: "",
        element: <StandardLayout />,
        children: [
          {
            index: true,
            element: <Home />,
            loader: topMoviesLoader,
            action: topMoviesAction,
            shouldRevalidate: () => false,
          },
          {
            path: "search",
            element: <Search />,
            loader: searchLoader,
            action: searchAction,
            shouldRevalidate: () => false,
          },
          { path: "logout", element: <Logout />, loader: logoutLoader },
          {
            path: "authenticate",
            element: <Authenticate />,
            loader: authenticationLoader,
          },
          {
            path: "authenticate/confirm",
            element: <Authenticate />,
            loader: authenticationConfirmLoader,
          },
          { path: "login", element: <Login /> },
        ],
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        id: "profile",
        children: [
          { index: true, element: <Profile />, loader: profileLoader,},
          {
            path: "ratings",
            element: <Ratings />,
            id: "ratings",
            loader: ratingsDataLoader,
            action: ratingsDataActions,
            shouldRevalidate: () => false,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
