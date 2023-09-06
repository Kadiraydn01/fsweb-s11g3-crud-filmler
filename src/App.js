import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import MovieHeader from "./components/MovieHeader";
import FavoriteMovieList from "./components/FavoriteMovieList";
import axios from "axios";
import EditMovieForm from "./components/EditMovieForm";
import { useHistory } from "react-router-dom";
import AddMovieForm from "./components/AddMovieForm";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const history = useHistory();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/movies")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteMovie = (id) => {
    axios.delete(`http://localhost:9000/api/movies/${id}`).then((res) => {
      setMovies(res.data);
      history.push("/movies");
    });
  };

  const hideMovie = (id) => {
    axios
      .put(`http://localhost:9000/api/movies/${id}`, { isHidden: true })
      .then((res) => {
        setMovies(res.data);
        history.push("/movies");
      });
  };
  const addToFavorites = (movie) => {
    const favMovie = favoriteMovies.find((fav) => fav.id === movie.id);
    if (!favMovie) {
      setFavoriteMovies([...favoriteMovies, movie]);
    } else {
      console.log(favoriteMovies);
    }
  };

  const darkModeToggle = () => {
    setDarkMode(!darkMode);
  };
  return (
    <div className={darkMode ? `dark bg-slate-900` : ``}>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
        <button onClick={darkModeToggle}> Dark Mode Aç/Kapat </button>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favoriteMovies={favoriteMovies} />

          <Switch>
            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>

            <Route exact path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie
                deleteMovie={deleteMovie}
                addToFavorites={addToFavorites}
                hideMovie={hideMovie}
              />
            </Route>

            <Route exact path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
