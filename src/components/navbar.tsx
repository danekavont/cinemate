// src/components/Navbar.tsx
import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="w-full px-6 py-4 bg-gray-100 shadow-md">
      <ul className="flex space-x-6 font-medium text-gray-700">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/trending">Trending</Link>
        </li>
        <li>
          <Link href="/top-rated">Top rated</Link>
        </li>
        <li>
          <Link href="/chat">Chat</Link>
        </li>
      </ul>
    </nav>
  );
}
