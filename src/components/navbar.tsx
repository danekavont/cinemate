'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

  const tabs = [
    { label: 'Trending', href: '#trending' },
    { label: 'Top Rated', href: '#top-rated' },
    { label: 'Ask Cinemate', href: '#chat' },
  ];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Trending');
  const pathname = usePathname();
  const router = useRouter();



  // ScrollSpy Effect
  useEffect(() => {
    if (!pathname || pathname.startsWith('/movie/')) return;

    const sectionIds = ['trending', 'top-rated', 'chat'];
    const options = {
      root: null,
      rootMargin: '0px 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const matchedTab = tabs.find((tab) => tab.href === `#${id}`);
          if (matchedTab) {
            setActiveTab(matchedTab.label);
          }
        }
      }
    }, options);

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const handleTabClick = (tab: { label: string; href: string }) => {
    setActiveTab(tab.label);

    if (pathname.startsWith('/movie/')) {
      if (tab.label === 'Ask Cinemate') {
        setTimeout(() => {
          const el = document.getElementById('chat');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('scrollTo', tab.href);
        }
        router.push('/');
      }
    } else {
      const el = document.querySelector(tab.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 bg-[#1e1e1e] text-white w-full px-6 py-6 flex flex-col items-start gap-6 shadow-md">
      {/* Logo */}
      <div className="text-yellow-400 font-semibold text-xl flex items-center gap-1">
        <span className="text-lg">📽️</span>
        cinemate
      </div>

      {/* Tab Menu */}
      <div className="w-full flex justify-center">
        <ul className="flex bg-[#2a2a2a] rounded-full px-2 py-1 space-x-2 text-sm font-medium">
          {tabs.map((tab) => (
            <li key={tab.label}>
              <button
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-1 rounded-full transition-all duration-200 ${
                  activeTab === tab.label
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
