// src/components/media/movieContent/MovieStats.jsx

// import helper functions
import {
  convertToCurrency,
  formatGenres,
  formatDate,
} from "../../../utils/helpers";

export default function MovieStats({ data }) {
  return (
    <ul className="list-unstyled lh-lg mb-0 small">
      {data.producers && (
        <li>
          <b>Producers:</b> {data.producers}
        </li>
      )}
      {data.directors && (
        <li>
          <b>Directors:</b> {data.directors}
        </li>
      )}
      {data.stars && (
        <li>
          <b>Stars:</b> {data.stars}
        </li>
      )}
      {data.collection && (
        <li>
          <b>Collection:</b> {data.collection}
        </li>
      )}
      {data.release_date && (
        <li>
          <b>Released:</b> {formatDate(data.release_date)}
        </li>
      )}
      {data.runtime && (
        <li>
          <b>Runtime:</b> {data.runtime}
        </li>
      )}
      {data.rating && (
        <li>
          <b>Rating:</b> {data.rating}
        </li>
      )}
      <li>
        <b>Genre(s):</b> {formatGenres(data.genres)}
      </li>
      {Number(data.budget) !== 0 && (
        <li>
          <b>Budget:</b> {convertToCurrency(data.budget)}
        </li>
      )}
      {Number(data.worldwide_gross) !== 0 && (
        <li>
          <b>Gross:</b> {convertToCurrency(data.worldwide_gross)}
        </li>
      )}
    </ul>
  );
}
