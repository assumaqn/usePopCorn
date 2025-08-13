import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d8859e1e";
// const query = " The Matrix";
//
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovie(query);

  const [watched, setWatched] = useState(function () {
    const value = localStorage.getItem("watched");
    return JSON.parse(value);
  });

  function handleMovieSelect(id) {
    setSelectedId(id);
  }

  function handleRemoveMovies(id) {
    setWatched((watched) => watched.filter((watched) => watched.imdbID !== id));
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleCloseDetail() {
    setSelectedId(null);
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumbResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelection={handleMovieSelect} />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetail
              selectedID={selectedID}
              setSelectedId={setSelectedId}
              onWatchedMovie={handleWatchedMovie}
              watched={watched}
              onClose={handleCloseDetail}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />

              <WatchedMovieList
                watched={watched}
                onRemove={handleRemoveMovies}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callBack(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();

          setQuery("");
        }
      }
      inputEl.current.focus();
      document.addEventListener("keydown", callBack);
      return document.addEventListener("keydown", callBack);
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function NumbResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelection }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelection={onSelection} />
      ))}
    </ul>
  );
}
function Movie({ movie, onSelection }) {
  return (
    <li onClick={() => onSelection(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetail({
  selectedID,
  setSelectedId,
  onWatchedMovie,
  watched,
  onClose,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const [trailer, setTrailer] = useState(false);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID);
  const currentUserRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating;

  const {
    Title: title,

    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,

    Released: released,

    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const newWatchedMovie = {
    imdbID: selectedID,
    poster,
    title,
    runtime: Number(runtime?.split(" ").at(0)),
    imdbRating,
    userRating,
  };
  function addNewWatchedMovie() {
    onWatchedMovie(newWatchedMovie);
    setSelectedId(null);
  }
  function handleTrailer() {
    setTrailer((trailer) => !trailer);
  }
  useEffect(
    function () {
      setIsLoading(true);
      async function fetchMovieDetail() {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data = await res.json();
        setMovie(data);

        setIsLoading(false);
      }
      fetchMovieDetail();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  useEffect(
    function () {
      function callBack(e) {
        if (e.code === "Escape") {
          onClose();
        }
      }
      document.addEventListener("keydown", callBack);
      return function () {
        document.addEventListener("keydown", callBack);
      };
    },
    [onClose]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={() => setSelectedId(null)}>
              &larr;
            </button>
            {trailer ? (
              <TrailerEmbed imdbId={selectedID} key={selectedID} />
            ) : (
              <>
                <img src={poster} alt={`${title} movie`} />
                <div className="details-overview">
                  <h2>{title}</h2>

                  <p>
                    {released} ⏲{runtime}
                  </p>
                  <p>{genre}</p>
                  <p>
                    <span>⭐</span>
                    {imdbRating} IMDb rating
                  </p>
                </div>
              </>
            )}
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating >= 0 && (
                    <div className="buttons">
                      <button className="btn-add" onClick={addNewWatchedMovie}>
                        + Add to list
                      </button>
                      <button className="btn-add" onClick={handleTrailer}>
                        {trailer ? "✖ Close Trailer" : "▶ Watch Trailer"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>
                  You Rate This Movie {currentUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function TrailerEmbed({ imdbId }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imdbId) return;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3YjNmMTYzN2MwYmE5MDFmNmJmMWYwYjVjYTM5NjAwYSIsIm5iZiI6MTc1NDE0MDcxNy45NjYsInN1YiI6IjY4OGUxMDJkMDI5ZDYyNzRiNDI2MTRhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ErMadnu72B5QqQChC3yOy0bP1ph0zuaioYAfxBxuysM",
      },
    };

    setIsLoading(true);
    fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?language=en-US&external_source=imdb_id`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        const tmdbMovieId = data.movie_results[0]?.id;
        if (!tmdbMovieId) throw new Error("TMDb ID not found");

        //  Get trailers/videos
        return fetch(
          `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos?language=en-US`,
          options
        );
      })
      .then((res) => res.json())
      .then((videosData) => {
        const trailer = videosData.results.find(
          (v) =>
            v.type.toLowerCase() === "trailer" &&
            v.site.toLowerCase() === "youtube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTrailerKey(null);
      });
  }, [imdbId]);

  // if (!trailerKey) return <p>No trailer found.</p>;

  return isLoading ? (
    <Loader />
  ) : (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0&controls=1`}
      title="Movie Trailer"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
function WatchedMovieList({ watched, onRemove }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onRemove={onRemove} />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, onRemove }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onRemove(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched?.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched?.map((movie) => movie.userRating));
  const avgRuntime = average(watched?.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
