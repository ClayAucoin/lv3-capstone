// src/components/media/movieContent/Poster.jsx

export default function Poster({ data }) {
  return (
    <img
      src={data.poster}
      className="img-fluid w-100 object-fit-cover"
      alt={data.title}
    />
  );
}
