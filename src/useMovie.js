import { useState, useEffect } from "react";
const KEY = "d8859e1e";
export function useMovie(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    // callBack?.();
    const controller = new AbortController();
    setIsLoading(true);
    setError("");
    async function fetchMovie() {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("failed to fetch movie data");
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
          setError("");
        }
        // console.error(Error.message);
      } finally {
        setIsLoading(false);
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
      }
    }
    // handleCloseDetail();
    fetchMovie();
    return function () {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
