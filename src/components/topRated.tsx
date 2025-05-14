'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
};

export default function TopRated() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      const res = await fetch('/api/top-rated');
      const data = await res.json();
      setMovies(data.results || []);
    };

    fetchTopRated();
  }, []);

  return (
    <div className="p-4">
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <li key={movie.id} className="rounded overflow-hidden shadow-lg">
            <Link href={`/movie/${movie.id}`}>
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder.jpg'
                }
                alt={movie.title}
                width={300} // or your preferred width
                height={450} // or your preferred height
                className="rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
