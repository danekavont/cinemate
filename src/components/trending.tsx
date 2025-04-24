'use client';
import { useEffect, useState } from 'react';

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

export default function Trending() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await fetch('/api/trending');
      const data = await res.json();
      setMovies(data.results || []);
    };

    fetchTrending();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🔥 Trending Movies</h2>
      <ul className="grid grid-cols-2 gap-4">
        {movies.map((movie) => (
          <li key={movie.id} className="bg-gray-800 text-white p-3 rounded shadow">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p className="text-sm text-gray-300">{movie.overview.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
