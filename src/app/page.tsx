import Chat from '@/components/chat';
import Trending from '@/components/trending';
import TopRated from '@/components/topRated';


export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>

      <div className="mt-4">
        
        <Trending />
        <TopRated />
        <Chat />
      </div>
    </main>
  );
}
