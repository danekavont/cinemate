'use client';
import Chat from '@/components/chat';
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
  profile_path: string | null;
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
  const [showTrailer, setShowTrailer] = useState(false); // for toggling trailer display

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        console.log("TMDB API Key:", apiKey);

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
          console.log("Fetched movie details:", details);
          console.log("Fetched movie credits:", credits);
          console.log("Fetched movie videos:", videos);
          console.log("Fetched movie reviews:", reviews);

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
  console.log("Render-time details:", movieData?.details);
  const { details, credits, videos, reviews } = movieData;

  const trailer = videos?.results?.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube');
  const cast = credits?.cast?.slice(0, 6) || [];
  const genres = details?.genres?.map((g) => g.name).join(', ') || '';

  return (
    
    <div className="bg-[#1e1e1e] text-white min-h-screen px-0 py-10 space-y-6">
      {/* Trailer Fullscreen View */}
      {showTrailer && trailer ? (
        <div className="w-full h-[800px] flex items-center justify-center bg-black relative">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded"
          />
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-30 right-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            ⬅ Back
          </button>
        </div>
      ) : (
        // Poster Banner with Info Overlay and Hoverable Trailer Button
        <div className="relative w-full h-[800px] group">
          {details?.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${details.poster_path}`}
              alt={details.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-300">No Poster Available</span>
            </div>
          )}

          {/* Overlay for Movie Info */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/70 p-18 flex items-center justify-end">
            <div className="max-w-xl text-right space-y-4">
              <h1 className="text-4xl font-bold text-white">{details?.title}</h1>
              <p className="text-lg text-gray-200">
                {genres} | {details?.runtime || 0} mins | ⭐ {details?.vote_average?.toFixed(1) || 'N/A'}
              </p>
              <p className="text-md text-gray-300">{details?.overview || 'No overview available.'}</p>
              {/* Watch Trailer Button on Hover */}
          {trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className=" bg-yellow-400 text-white font-semibold px-6 py-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              ▶ Watch Trailer
            </button>
          )}
            </div>
          </div>

          
        </div>
      )}


      {/* Cast Section with Actor/Actress Images */}
      <div className="px-14">
        <h2 className="text-xl font-semibold mt-14 mb-14">🎭 Casts</h2>
        {cast.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cast.map((actor) => (
              <li key={actor.id} className="text-sm text-center">
                <div className="space-y-2">
                  {actor?.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} // Image URL
                      alt={actor.name}
                      width={120}
                      height={180}
                      className="rounded-lg mx-auto" // Adds some styling
                    />
                  ) : (
                    <div className="w-30 h-45 bg-gray-700 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-gray-300">No Image</span>
                    </div>
                  )}
                  <p className="text-yellow-300 font-semibold">{actor.name}</p>
                  <p className="text-gray-400">as {actor.character}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No cast information available.</p>
        )}
      </div>


      {/* Reviews Section with Adjusted Padding */}
      <div className="px-14">
        <h2 className="text-xl font-semibold mt-6 mb-2">📝 Reviews</h2>
        {reviews?.results?.length > 0 ? (
          <ul className="space-y-4">
            {reviews.results.slice(0, 3).map((review) => (
              <li key={review.id} className="bg-gray-900 p-4 rounded flex items-start space-x-4">
                {/* Default Avatar with CSS */}
                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white">
                  {/* Display first letter of the author's name */}
                  <span>{review.author.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-yellow-400">{review.author}</p>
                  <p className="text-sm text-gray-300 mt-1">{review.content.slice(0, 250)}...</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews available.</p>
        )}
      </div>

      {/* Chat Section */}
      <section className="px-14 py-6" id="chat">
        <h2 className="text-gray-400 text-lg font-semibold mb-10">Ask Cinemate</h2>
          <Chat />
      </section>
    </div>
  );
};

export default MoviePage;
