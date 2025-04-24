import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing TMDB API key' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error('TMDB Fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
