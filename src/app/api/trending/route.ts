import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing TMDB API key' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ TMDB trending fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch trending movies' }, { status: 500 });
  }
}
