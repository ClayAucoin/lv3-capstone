// src/components/media/PickMovie.jsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./PickMovie.css";
import supabase from "../../utils/supabase";

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
    const { data, error } = await supabase
      .from("movies")
      .select()
      .order("title");

    if (error) {
      console.error("refreshMovies error: ", error);
    }
    setData(data);
    // console.log(data);
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
        className={`btn btn-primary genre-btn text-capitalize ${
          allGenres[i] === currentGenre ? "is-active" : ""
        }`}
      >
        {allGenres[i]}
      </button>
    );
  }

  // get users watchlist
  useEffect(() => {
    async function getUserWatchlist() {
      const { data: watchlist, error } = await supabase
        .from("watchlist")
        .select("imdb_id")
        .eq("user_id", Number(localStorage.getItem("userId")));

      if (error) {
        console.error("Error fetching watchlist:", error.message);
        return;
      }

      const ids = (watchlist || []).map((w) => w.imdb_id);

      setWatchlistIds(ids);
      // console.log("imdb ids just fetched:", ids);
      // console.log("watchlistIds: ", watchlistIds);
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
          key={movie.imdb_id || i}
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
    <>
      <div className="container">
        <main>
          <header className="mt-4">
            {user.first_name && (
              <h1>
                {user.first_name} {user.last_name}'s
              </h1>
            )}
            <h4>Add Movie to Watchlist</h4>
            <div className="genre-flex">{genreButtonsJSX}</div>
          </header>

          <article>
            <section className="current-genre">
              {currentGenre && (
                <div className="genre-title">
                  <h1 className="text-capitalize">{currentGenre}&nbsp;</h1>
                  <h2>({matchingMovies.length})</h2>
                </div>
              )}

              {currentGenre && (
                <div className="genre-nav-buttons">
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
            {currentGenre && (
              <section className="movie-grid mt-2">{movieGridJSX}</section>
            )}
          </article>
        </main>
      </div>
    </>
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
