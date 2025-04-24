import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = process.env.OPENROUTER_API_KEY;

  // Debug: Ensure the API key is loaded
  console.log('🔑 API key loaded:', !!apiKey);

  if (!apiKey) {
    console.error('❌ Missing OpenRouter API key');
    return NextResponse.json({ error: 'Missing OpenRouter API key' }, { status: 500 });
  }

  try {
    console.log('📨 Sending request to OpenRouter...');
    console.log('📦 Payload:', JSON.stringify({ messages }, null, 2));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // Or 'google/gemini-pro'
        messages,
      }),
    });

    const data = await response.json();

    // Log full response for debugging
    console.log('✅ OpenRouter Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ OpenRouter API returned error:', data);
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Unexpected error calling OpenRouter:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
