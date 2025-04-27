'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';

// Types
interface MovieDetails {
  title: string;
  genres: { name: string }[];
  runtime: number;
  vote_average: number;
  overview: string;
  poster_path: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
}

interface Video {
  type: string;
  site: string;
  key: string;
}

interface Review {
  id: string;
  author: string;
  content: string;
}

interface MovieData {
  details: MovieDetails;
  credits: { cast: CastMember[] };
  videos: { results: Video[] };
  reviews: { results: Review[] };
}

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

const MoviePage = ({ params }: MoviePageProps) => {
  const { id } = use(params);

  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        try {
          const [detailsRes, creditsRes, videosRes, reviewsRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`),
            fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}`),
          ]);

          const [details, credits, videos, reviews] = await Promise.all([
            detailsRes.json(),
            creditsRes.json(),
            videosRes.json(),
            reviewsRes.json(),
          ]);

          setMovieData({ details, credits, videos, reviews });
        } catch (error) {
          console.error('Failed to fetch movie details:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [id]);

  if (isLoading) return <div className="text-center text-white py-10">Loading...</div>;
  if (!movieData) return <div className="text-center text-white py-10">Movie data not available.</div>;

  const { details, credits, videos, reviews } = movieData;

  const trailer = videos?.results?.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube');
  const cast = credits?.cast?.slice(0, 6) || [];
  const genres = details?.genres?.map((g) => g.name).join(', ') || '';

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen px-6 py-8 space-y-6">
      {/* Title and Info */}
      <h1 className="text-3xl font-bold">{details?.title || 'No title'}</h1>
      <p className="text-gray-400">{genres} | {details?.runtime || 0} mins | ⭐ {details?.vote_average || 'N/A'}</p>

      {/* Poster and Overview */}
      <div className="flex flex-col md:flex-row gap-6">
        {details?.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
            alt={details.title}
            width={500}
            height={750}
            className="w-64 rounded"
          />
        ) : (
          <div className="w-64 h-[750px] bg-gray-700 flex items-center justify-center rounded">
            <span className="text-gray-300">No Poster Available</span>
          </div>
        )}
        <p className="text-lg text-gray-300">{details?.overview || 'No overview available.'}</p>
      </div>

      {/* Trailer */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">🎬 Trailer</h2>
        {trailer ? (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            frameBorder="0"
            allowFullScreen
            className="rounded"
          />
        ) : (
          <p className="text-gray-500">No trailer available.</p>
        )}
      </div>

      {/* Cast */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">🎭 Cast</h2>
        {cast.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cast.map((actor) => (
              <li key={actor.id} className="text-sm">
                <p className="text-yellow-300 font-semibold">{actor.name}</p>
                <p className="text-gray-400">as {actor.character}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No cast information available.</p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">📝 Reviews</h2>
        {reviews?.results?.length > 0 ? (
          <ul className="space-y-4">
            {reviews.results.slice(0, 3).map((review) => (
              <li key={review.id} className="bg-gray-800 p-4 rounded">
                <p className="font-semibold text-yellow-400">{review.author}</p>
                <p className="text-sm text-gray-300 mt-1">{review.content.slice(0, 250)}...</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default MoviePage;
