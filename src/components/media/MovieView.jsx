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
import MoviePoster from "./movieContent/MoviePoster";
import MovieTrailer from "./movieContent/MovieTrailer";
import MovieDescription from "./movieContent/MovieDescription";
import MovieStats from "./movieContent/MovieStats";

// import css
import "./MovieView.css";

// import helper functions
import { toProperCase, formatTime } from "../../utils/helpers";

export default function MovieView() {
  const { user } = useAuth();
  const { imdbId, genre } = useParams();
  const navigate = useNavigate();

  const [currentGenre, setCurrentGenre] = useState(() => genre || "");
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [movieInWatchlist, setMovieInWatchlist] = useState(false);

  // check if currentGenre state exists or if genre is coming in via params
  useEffect(() => {
    if (genre && genre !== currentGenre) {
      setCurrentGenre(genre);
    }
  }, [genre]);

  // get movie data
  async function loadSelectedMovie() {
    try {
      // console.log("loadSelectedMovie: imdbID: ", imdbId);
      const { data, error } = await supabase
        .from("movies")
        .select()
        .eq("imdb_id", imdbId)
        .maybeSingle();

      if (error) {
        console.error("loadSelectedMovie error: ", error);
        return;
      }
      setSelectedMovie(data);
    } catch (err) {
      console.log("loadSelectedMovie: unexpected error: ", err);
    }
  }

  // get user movies
  async function checkMovieForUser() {
    try {
      const userId = Number(localStorage.getItem("id"));
      // console.log("checkMovieForUser: userId: ", userId, "imdbID: ", imdbId);

      const { data, error } = await supabase
        .from("watchlist")
        .select()
        .match({ user_id: userId, imdb_id: imdbId })
        .maybeSingle();

      if (error) {
        console.error("checkMovieForUser error: ", error);
        return;
      }

      if (!data) {
        setMovieInWatchlist(true);
      } else {
        setMovieInWatchlist(false);
      }
    } catch (err) {
      console.log("checkMovieForUser: unexpected error: ", err);
    }
  }

  useEffect(() => {
    loadSelectedMovie();
    checkMovieForUser();
  }, []);

  if (!selectedMovie) {
    return <p>No movie selected</p>;
  }

  // add current movie to watchlist
  async function addMovieToWatchlist() {
    try {
      const userId = Number(localStorage.getItem("id"));
      // console.log("addMovieToWatchlist: userId: ", userId, "imdbID: ", imdbId);

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
    } catch (err) {
      console.log("addMovieToWatchlist: unexpected error: ", err);
    }
  }

  // remove current movie from watchlist
  async function removeFromWatchlist() {
    try {
      const userId = Number(localStorage.getItem("id"));
      // console.log("removeFromWatchlist: userId: ", userId, "imdbID: ", imdbId);

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
    } catch (err) {
      console.log("removeFromWatchlist: unexpected error: ", err);
    }
  }

  // helper: format year from data for title
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
              <button className="btn btn-primary">
                ← Back to {toProperCase(currentGenre)}
              </button>
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
      </nav>
      <header className="my-3">
        <div className="text-sm-center text-lg-start text-md-start align-items-start w-100">
          {selectedMovie.title &&
            Number.isFinite(formatTitle(selectedMovie.year)) && (
              <>
                <h1 className="display-6 fw-semibold">{selectedMovie.title}</h1>
                <h3 className="fs-5 fw-semibold text-muted">
                  <small className="">
                    {selectedMovie.year &&
                      Math.trunc(formatTitle(selectedMovie.year))}
                    {selectedMovie.rating && (
                      <>
                        <span className="mx-1">•</span>
                        {selectedMovie.rating}
                      </>
                    )}
                    {selectedMovie.runtime > 0 && (
                      <>
                        <span className="mx-1">•</span>
                        {formatTime(selectedMovie.runtime)}
                      </>
                    )}
                  </small>
                </h3>
              </>
            )}
        </div>
      </header>

      <main className="container">
        <article className="row g-3 align-items-stretch">
          {/* section: trailer */}
          <section className="col-12 col-lg-8 order-1 order-lg-2">
            <MovieTrailer data={selectedMovie} />
          </section>

          {/* section: poster: xs: next to desc; lg: next to trailer */}
          <section className="col-5 col-sm-4 col-lg-4 order-2 order-lg-1">
            <div className="h-100">
              <MoviePoster data={selectedMovie} />
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
