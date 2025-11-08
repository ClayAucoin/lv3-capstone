// src/components/media/movieContent/MovieStats.jsx

export default function MovieStats({ data }) {
  return (
    <ul className="list-unstyled lh-lg mb-0 small">
      <li>
        <b>Producers:</b> {data.producers}
      </li>
      <li>
        <b>Directors:</b> {data.directors}
      </li>
      <li>
        <b>Stars:</b> {data.stars}
      </li>
      <li>
        <b>Released:</b> {formatDate(data.released)}
      </li>
      <li>
        <b>Runtime:</b> {data.runtime}
      </li>
      <li>
        <b>Rating:</b> {data.rating}
      </li>
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

function convertToCurrency(amount) {
  const usdFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  return usdFormatted;
}

function formatGenres(genreString) {
  if (!genreString) return "";
  return genreString
    .split(",")
    .map((g) => g.trim())
    .map((g) => g.charAt(0).toUpperCase() + g.slice(1))
    .join(", ");
}

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
