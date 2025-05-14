'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
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
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link href={`/movie/${movie.id}`} className="block">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={300} // Set width (adjust if needed)
                height={450} // Set height (adjust if needed)
                className="rounded-md hover:scale-105 transition-transform duration-200 cursor-pointer"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
