/* eslint-disable react-hooks/exhaustive-deps */

// src/components/media/MovieView.jsx

// import react hooks and components
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// import supabase config
import supabase from "../../utils/supabase";

// import local components
import Poster from "./movieContent/Poster";
import Trailer from "./movieContent/Trailer";
import MovieDescription from "./movieContent/MovieDescription";
import MovieStats from "./movieContent/MovieStats";

// import css
import "./MovieView.css";

export default function MovieView() {
  const { user } = useAuth();
  const { imdbId, genre } = useParams();
  const navigate = useNavigate();

  const [currentGenre, setCurrentGenre] = useState(() => genre || "");
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [movieInWatchlist, setMovieInWatchlist] = useState(false);

  useEffect(() => {
    if (genre && genre !== currentGenre) {
      setCurrentGenre(genre);
    }
  }, [genre]);

  async function loadSelectedMovie() {
    // console.log("loadSelectedMovie: imdbID: ", imdbId);
    const { data, error } = await supabase
      .from("movies")
      .select()
      .eq("imdb_id", imdbId)
      .maybeSingle();

    if (error) {
      console.error("loadSelectedMovie error: ", error);
    }
    setSelectedMovie(data);
  }

  async function checkMovieForUser() {
    const userId = Number(localStorage.getItem("userId"));
    // console.log("checkMovieForUser: userId: ", userId, "imdbID: ", imdbId);

    const { data, error } = await supabase
      .from("watchlist")
      .select()
      .match({ user_id: userId, imdb_id: imdbId })
      .maybeSingle();

    if (error) {
      console.error("loadSelectedMovie error: ", error);
      return;
    }

    if (!data) {
      setMovieInWatchlist(true);
    } else {
      setMovieInWatchlist(false);
    }
  }

  useEffect(() => {
    loadSelectedMovie();
    checkMovieForUser();
  }, []);

  if (!selectedMovie) {
    return <p>No movie selected</p>;
  }

  async function addMovieToWatchlist() {
    const userId = Number(localStorage.getItem("userId"));
    console.log("addMovieToWatchlist: userId: ", userId, "imdbID: ", imdbId);

    const newItem = {
      user_id: userId,
      imdb_id: imdbId,
    };
    const { data, error } = await supabase.from("watchlist").insert(newItem);

    if (error) {
      console.error("addMovieToWatchlist error: ", error);
      return;
    }
    navigate("/view-watchlist");
  }

  async function removeFromWatchlist() {
    const userId = Number(localStorage.getItem("userId"));
    console.log("removeFromWatchlist: userId: ", userId, "imdbID: ", imdbId);

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("imdb_id", imdbId);

    if (error) {
      console.error("removeFromWatchlist error: ", error);
      return;
    }
    navigate("/view-watchlist");
  }

  function formatTitle() {
    return Number(selectedMovie?.year);
  }

  return (
    <div className="containter">
      <nav className="mt-3">
        <div className="d-flex justify-content-between">
          {!genre ? (
            <Link to="/view-watchlist/">
              <button className="btn btn-primary">← Back to Watchlist</button>
            </Link>
          ) : (
            <Link to={`/pick-movie/${currentGenre.toLowerCase()}`}>
              <button className="btn btn-primary">← Back to Pick Movie</button>
            </Link>
          )}
          {movieInWatchlist ? (
            <button className="btn btn-primary" onClick={addMovieToWatchlist}>
              Add to Watchlist
            </button>
          ) : (
            <button className="btn btn-primary" onClick={removeFromWatchlist}>
              Remove from Watchlist
            </button>
          )}
        </div>
        {currentGenre && (
          <h5 className="mt-2 text-center text-lg-start">
            Genre: {formatGenre(currentGenre)}
          </h5>
        )}
      </nav>
      <header className="my-3">
        <div className="text-sm-center text-lg-start text-md-start align-items-start w-100">
          {selectedMovie.title &&
            Number.isFinite(formatTitle(selectedMovie.year)) && (
              <h1 className="display-6 fw-semibold">
                {selectedMovie.title}
                <h3 className="fs-5 fw-semibold text-muted">
                  <small className="">
                    {Math.trunc(formatTitle(selectedMovie.year))}
                    <span className="mx-1">•</span>
                    {selectedMovie.rating}
                    <span className="mx-1">•</span>
                    {formatTime(selectedMovie.runtime)}
                  </small>
                </h3>
              </h1>
            )}
        </div>
      </header>

      <main className="container">
        <article className="row g-3 align-items-stretch">
          {/* section: trailer */}
          <section className="col-12 col-lg-8 order-1 order-lg-2">
            <Trailer data={selectedMovie} />
          </section>

          {/* section: poster: xs: next to desc; lg: next to trailer */}
          <section className="col-5 col-sm-4 col-lg-4 order-2 order-lg-1">
            <div className="h-100">
              <Poster data={selectedMovie} />
            </div>
          </section>

          {/* section: desc: xs: right of poster; lg: goes below poster and trailer */}
          <section className="col-7 col-sm-8 col-lg-60p order-3">
            <MovieDescription data={selectedMovie} />
          </section>

          {/* section: stats: xs: below everything; lg: right of desc */}
          <section className="col-12 col-sm-12 col-lg order-4">
            <MovieStats data={selectedMovie} />
          </section>
        </article>
      </main>
    </div>
  );
}

function formatGenre(genreString) {
  if (!genreString) return "";
  return genreString.charAt(0).toUpperCase() + genreString.slice(1);
}

function formatTime(timeStr) {
  const parts = timeStr.split(":").map(Number);

  let hours = 0,
    minutes = 0,
    seconds = 0;

  if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  } else if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 1) {
    seconds = parts[0];
  }

  minutes += Math.floor(seconds / 60);
  seconds = seconds % 60;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
