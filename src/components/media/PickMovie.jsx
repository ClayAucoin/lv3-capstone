// src/components/media/PickMovie.jsx

// import react hooks and components
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// import supabase config
import supabase from "../../utils/supabase";

// import css
import "./PickMovie.css";

export default function PickMovie() {
  const [currentGenre, setCurrentGenre] = useState("");
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const { genre } = useParams();

  const [watchlistIds, setWatchlistIds] = useState([]);

  useEffect(() => {
    if (!currentGenre && !genre) {
      setCurrentGenre("");
    } else if (!currentGenre && genre) {
      setCurrentGenre(genre);
    }
  }, [currentGenre, genre]);

  // console.log("currentGenre: ", currentGenre);
  // console.log("genre: ", genre);

  async function loadMovies() {
    try {
      const { data, error } = await supabase
        .from("movies")
        .select()
        .order("title");

      if (error) {
        console.error("loadMovies error: ", error);
        return;
      }
      setData(data);
      // console.log(data);
    } catch (err) {
      console.log("loadMovies: unexpected error: ", err);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  // build unique genre list
  const allGenres = Array.from(
    new Set(
      data
        .flatMap((r) => (r.genres || "").split(","))
        .map((g) => g.trim().toLowerCase())
        .filter(Boolean)
    )
  )
    .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
    .sort((a, b) => a.localeCompare(b));

  // build genre buttons
  const genreButtonsJSX = [];
  for (let i = 0; i < allGenres.length; i++) {
    genreButtonsJSX.push(
      <button
        type="button"
        key={allGenres[i]}
        id={allGenres[i]}
        onClick={() => currentGenreClick(allGenres[i])}
        className={`btn genre-btn text-capitalize btn-${
          allGenres[i] === currentGenre ? "secondary" : "primary"
        }`}
      >
        {allGenres[i]}
      </button>
    );
  }

  // get users watchlist
  useEffect(() => {
    async function getUserWatchlist() {
      try {
        const { data: watchlist, error } = await supabase
          .from("watchlist")
          .select("imdb_id")
          .eq("user_id", Number(localStorage.getItem("userId")));

        if (error) {
          console.error("getUserWatchlist error:", error.message);
          return;
        }

        const ids = (watchlist || []).map((w) => w.imdb_id);

        setWatchlistIds(ids);
        // console.log("imdb ids retrieved:", ids);
        // console.log("watchlistIds: ", watchlistIds);
      } catch (err) {
        console.log("getUserWatchlist: unexpected error: ", err);
      }
    }
    getUserWatchlist();
  }, []);

  // build movie grid according to currentGenre
  let movieGridJSX = [];
  for (let i = 0; i < data.length; i++) {
    const movie = data[i];
    const movieGenres = movie.genres || "";

    if (movieGenres.toLowerCase().includes(currentGenre.toLowerCase())) {
      const inWatchlist = watchlistIds.includes(movie.imdb_id);

      movieGridJSX.push(
        <Link
          key={movie.imdb_id}
          to={`/movie-view/${movie.imdb_id}/${currentGenre.toLowerCase()}`}
        >
          <div className={`poster-wrap ${inWatchlist ? "in-watchlist" : ""}`}>
            <img
              className="movie-poster"
              src={movie.poster}
              alt={movie.title}
            />
            {inWatchlist && <span className="poster-tag">In Watchlist</span>}
          </div>
        </Link>
      );
    }
  }

  // reduce: get qty of movies in current genre
  const matchingMovies = data.filter((movie) =>
    (movie.genres || "")
      .toLowerCase()
      .split(",")
      .map((genre) => genre.trim())
      .includes(currentGenre.toLowerCase())
  );

  // handle genre navigation buttons
  function firstGenre() {
    if (allGenres.length) setCurrentGenre(allGenres[0]);
  }

  function lastGenre() {
    if (allGenres.length) setCurrentGenre(allGenres[allGenres.length - 1]);
  }

  function nextGenre() {
    if (!allGenres.length) return;
    const i = allGenres.indexOf(currentGenre);
    const next = i === -1 ? 0 : Math.min(i + 1, allGenres.length - 1);
    setCurrentGenre(allGenres[next]);
  }

  function prevGenre() {
    if (!allGenres.length) return;
    const i = allGenres.indexOf(currentGenre);
    const prev = i === -1 ? 0 : Math.max(i - 1, 0);
    setCurrentGenre(allGenres[prev]);
  }

  function currentGenreClick(genre) {
    setCurrentGenre(genre);
  }

  return (
    <div className="container p-0">
      <header className="m-1">
        {user.first_name && (
          <h1 className="display-6 fw-semibold text-center m-2 w-100">
            {user.first_name} {user.last_name}'s Watchlist
          </h1>
        )}
        <h4 className="fs-3 fw-semibold m-2 w-100 text-center">Add A Movie</h4>

        <nav className="d-flex justify-content-center m-2 w-100">
          <div className="genre-flex">{genreButtonsJSX}</div>
        </nav>
      </header>

      <main>
        <article className="m-0">
          <section className="m-0 current-genre">
            {currentGenre && (
              <div className="m-0 p-0 genre-title">
                <h1 className="display-6 fw-semibold m-0 text-capitalize">
                  {currentGenre}&nbsp;
                  <small className="fs-5 fw-semibold m-0">
                    ({matchingMovies.length})
                  </small>
                </h1>
              </div>
            )}

            {currentGenre && (
              <div className="mt-2 genre-nav-buttons">
                <button className="nav-button" onClick={firstGenre}>
                  ⏮
                </button>
                <button className="nav-button" onClick={prevGenre}>
                  ◀
                </button>
                <button className="nav-button" onClick={nextGenre}>
                  ▶
                </button>
                <button className="nav-button" onClick={lastGenre}>
                  ⏭
                </button>
              </div>
            )}
          </section>
          {currentGenre ? (
            <section className="movie-grid">{movieGridJSX}</section>
          ) : (
            <h1 className="fw-semibold w-100 text-center my-4">
              Select A Genre
            </h1>
          )}
        </article>
      </main>
    </div>
  );
}

function toProperCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
