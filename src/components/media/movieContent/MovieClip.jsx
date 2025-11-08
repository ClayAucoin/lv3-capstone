// src/components/media/movieContent/MovieClip.jsx

import YouTube from "react-youtube";

export default function MovieClip(props) {
  // retrieve props
  const { trailerId, movie } = props;
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      loop: 0,
      iv_load_policy: 3,
    },
    title: { movie },
  };

  // console.log(trailerId);

  return <YouTube className="youtube-embed" videoId={trailerId} opts={opts} />;
}
