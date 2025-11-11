// src/components/media/movieContent/MoviePoster.jsx

export default function MoviePoster({ data }) {
  return (
    <img
      src={data.poster}
      className="img-fluid w-100 object-fit-cover"
      alt={data.title}
    />
  );
}
