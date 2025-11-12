// src/components/media/movieContent/MovieStats.jsx

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

// helper: convert number from dB to currency
function convertToCurrency(amount) {
  const usdFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  return usdFormatted;
}

// helper: format all words in genre to proper case
function formatGenres(genreString) {
  if (!genreString) return "";
  return genreString
    .split(",")
    .map((g) => g.trim())
    .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
    .join(", ");
}

// helper: formats date to Jan 1, 2000
function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
