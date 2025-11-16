// src/components/media/ViewWatchlist.jsx

// import react hooks and components
import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate, useParams } from "react-router-dom";

// import context
import { useAuth } from "../../context/AuthContext";

// import supabase config
import supabase from "../../utils/supabase";

// import css
import "./ViewWatchlist.css";

// import helper functions
import { displayName } from "../../utils/helpers";

export default function ViewWatchlist() {
  const [currentUser, setCurrentUser] = useState("");
  const [currentUserName, setCurrentUserName] = useState([]);
  const [data, setData] = useState([]);
  const [movieCount, setMovieCount] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  // console.log("ViewWatchlist: start: user.is_active", user.is_active);

  // check if currentUser state exists, if not get user data from localstorage
  useEffect(() => {
    if (currentUser === "") {
      setCurrentUser(localStorage.getItem("id"));
    }
    document.title = `ViewWatchlist`;
  }, [currentUser]);

  // console.log("login: user?.is_active:", user?.is_active);
  // console.log(
  //   `ViewWatchlist: user?.is_active: ${
  //     user?.is_active
  //   }, typeof: ${typeof user?.is_active}`
  // );

  if (user?.is_active) {
    <Navigate to="/view-watchlist" replace />;
  }

  // console.log("userId: ", localStorage.getItem("id"));
  // console.log("currentUser: ", currentUser);

  // get currentUser's watchlist
  async function getUserWatchlist() {
    try {
      // get the imdb_ids for current user
      const { data: watchlist, error: watchlistError } = await supabase
        .from("watchlist")
        .select("imdb_id")
        .eq("user_id", Number(localStorage.getItem("id")));

      if (watchlistError) {
        console.error("getUserWatchlist error:", watchlistError.message);
        return [];
      }

      // if user has no watchlist entries
      if (!watchlist?.length) return [];

      // get number of movies in watchlist
      setMovieCount(watchlist.length);

      // extract imdb_ids and get movie info
      const imdbIds = watchlist.map((w) => w.imdb_id);

      // get movie info via imdb's from user's watchlist
      const { data: movies, error: moviesError } = await supabase
        .from("movies")
        .select("id, poster, imdb_id, title")
        .in("imdb_id", imdbIds)
        .order("title");

      if (moviesError) {
        console.error("Error fetching movies:", moviesError.message);
        return [];
      }

      setData(movies);
      // console.log(movies);
    } catch (err) {
      console.log("getUserWatchlist: unexpected error: ", err);
    }
  }

  useEffect(() => {
    getUserWatchlist();
  }, []);

  // build movie grid according to currentGenre
  let movieGridJSX = [];
  for (let i = 0; i < data.length; i++) {
    const movie = data[i];

    movieGridJSX.push(
      <Link key={movie.imdb_id} to={`/movie-view/${movie.imdb_id}`}>
        <img className="movie-poster" src={movie.poster} alt={movie.title} />
      </Link>
    );
  }

  return (
    <>
      <div className="container">
        <main>
          <section className="text-center mt-4 mb-3">
            <h1 className="display-6 fw-semibold text-proper">
              {displayName({
                fname: localStorage.getItem("first_name"),
                lname: localStorage.getItem("last_name"),
              })}
            </h1>
            {movieCount === 0 ? (
              <h3 className="display-6 fw-medium my-4 p-0">
                You Currently Have No
                <br />
                Movies In Your Watchlist
              </h3>
            ) : (
              <h4>
                You Currently Have <b>{movieCount}</b>
                <br />
                {movieCount === 1 ? "Movie" : "Movies"} In Your Watchlist
              </h4>
            )}
            <div className="text-center m-0 pt-2">
              <Link to="/pick-movie">
                <button
                  className={`btn btn-primary ${
                    movieCount > 0 ? "add-has-movies" : "add-no-movies"
                  }`}
                >
                  Add Movie
                </button>
              </Link>
            </div>
            {movieCount > 0 && (
              <article className="movie-grid text-center">
                {movieGridJSX}
              </article>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
