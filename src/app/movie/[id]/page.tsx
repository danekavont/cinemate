// app/movie/[id]/page.tsx
import Chat from '@/components/chat';
import Image from 'next/image';

// Define types for the API responses
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

type Props = {
  params: { id: string };
};

async function getMovieDetails(id: string): Promise<MovieData> {
  const apiKey = process.env.TMDB_API_KEY;

  const [detailsRes, creditsRes, videosRes, reviewsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=genres`, { cache: 'no-store' }),
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`, { cache: 'no-store' }),
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`, { cache: 'no-store' }),
    fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${apiKey}`, { cache: 'no-store' }),
  ]);

  const [details, credits, videos, reviews] = await Promise.all([
    detailsRes.json(),
    creditsRes.json(),
    videosRes.json(),
    reviewsRes.json(),
  ]);

  return { details, credits, videos, reviews };
}

export default async function MoviePage({ params }: Props) {
  const { details, credits, videos, reviews } = await getMovieDetails(params.id);

  const trailer = videos.results.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube');
  const cast = credits.cast.slice(0, 6); // show top 6 cast members
  const genres = details.genres.map((g) => g.name).join(', ');

  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold">{details.title}</h1>
      <p className="text-gray-400">{genres} | {details.runtime} mins | ⭐ {details.vote_average}</p>

      {/* Poster and Overview */}
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title}
          width={500}
          height={750}
          className="w-64 rounded"
        />
        <p className="text-lg text-gray-300">{details.overview}</p>
      </div>

      {/* Trailer */}
      {trailer && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">🎬 Trailer</h2>
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            frameBorder="0"
            allowFullScreen
            className="rounded"
          />
        </div>
      )}

      {/* Cast */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">🎭 Cast</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cast.map((actor) => (
            <li key={actor.id} className="text-sm">
              <p className="text-yellow-300 font-semibold">{actor.name}</p>
              <p className="text-gray-400">as {actor.character}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">📝 Reviews</h2>
        {reviews.results.length > 0 ? (
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

      {/* Chat Section */}
      <section id="chat">
        <h2 className="text-gray-400 text-lg font-semibold mb-4">Ask Cinemate</h2>
        <Chat />
      </section>
    </div>
  );
}
