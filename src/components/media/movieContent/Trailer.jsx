// src/components/media/movieContent/Trailer.jsx

import MovieClip from "./MovieClip";

export default function Trailer({ data }) {
  return (
    <>
      {/* trailer: xs–md: above everything; lg: hidden */}
      <div className="ratio ratio-16x9 d-lg-none">
        <MovieClip trailerId={data.yt_trailer_id} movie={data.title} />
      </div>
      {/* section: trailer: xs-md: hidden; lg: right of poster */}
      <div className="d-none d-lg-block h-100 position-relative">
        <div className="ratio ratio-16x9 position-absolute top-0 start-0 w-100 h-100">
          <MovieClip trailerId={data.yt_trailer_id} movie={data.title} />
        </div>
      </div>
    </>
  );
}
