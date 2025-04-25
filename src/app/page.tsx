import Chat from '@/components/chat';
import Trending from '@/components/trending';
import TopRated from '@/components/topRated';

export default function Home() {
  return (
    <main className="bg-[#1e1e1e] text-white px-8 py-6 space-y-12 min-h-screen">
      {/* Trending Section */}
      <section id="trending">
        <h2 className="text-gray-400 text-lg font-semibold mb-4">🔥 Trending Movies</h2>
        <Trending />
      </section>

      {/* Top Rated Section */}
      <section id="top-rated">
        <h2 className="text-gray-400 text-lg font-semibold mb-4">⭐ Top Rated Movies</h2>
        <TopRated />
      </section>

      {/* Chat Section */}
      <section id="chat">
        <h2 className="text-gray-400 text-lg font-semibold mb-4">Ask Cinemate</h2>
        <Chat />
      </section>
    </main>
  );
}
