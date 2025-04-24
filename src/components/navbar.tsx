// src/components/Navbar.tsx
'use client';

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-gray-100 shadow-md sticky top-0 z-10">
      <ul className="flex space-x-6 font-medium text-gray-700">
        <li><a href="#trending">Trending</a></li>
        <li><a href="#top-rated">Top Rated</a></li>
        <li><a href="#chat">Chat</a></li>
      </ul>
    </nav>
  );
}
