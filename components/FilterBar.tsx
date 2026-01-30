'use client';

import { Search } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// I forgot to install use-debounce. I'll code it manually with setTimeout or install it.
// For now I'll just do simple onChange or maybe I'll install it later.
// I'll stick to simple standard debouncing or just immediate update for now,
// but actually immediate update on every keystroke causes too many requests if valid on server.
// I'll use a simple defaultValue + onSubmit or onBlur, or just local state debouncing.
// Let's implement a simple custom hook or logic inside.

export default function FilterBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  // Simple debounce wrapper
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedSearch = debounce(handleSearch, 300);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
        params.set(key, value);
    } else {
        params.delete(key);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
            type="text"
            placeholder="Search pixels..."
            onChange={(e) => debouncedSearch(e.target.value)}
            defaultValue={searchParams.get('query')?.toString()}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="flex gap-4">
        <select
            onChange={(e) => handleFilterChange('map', e.target.value)}
            defaultValue={searchParams.get('map')?.toString()}
            className="bg-zinc-900 border border-zinc-800 focus:border-blue-500 text-white rounded-lg px-4 py-3 outline-none transition-all shadow-sm cursor-pointer"
        >
            <option value="All">All Maps</option>
            <option value="Mirage">Mirage</option>
            <option value="Dust 2">Dust 2</option>
            <option value="Inferno">Inferno</option>
            <option value="Nuke">Nuke</option>
            <option value="Overpass">Overpass</option>
            <option value="Ancient">Ancient</option>
            <option value="Vertigo">Vertigo</option>
            <option value="Anubis">Anubis</option>
        </select>

        <select
             onChange={(e) => handleFilterChange('side', e.target.value)}
             defaultValue={searchParams.get('side')?.toString()}
             className="bg-zinc-900 border border-zinc-800 focus:border-blue-500 text-white rounded-lg px-4 py-3 outline-none transition-all shadow-sm cursor-pointer"
        >
            <option value="All">All Sides</option>
            <option value="CT">CT Side</option>
            <option value="TR">TR Side</option>
        </select>
      </div>
    </div>
  );
}
