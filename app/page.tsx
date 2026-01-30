import PixelForm from '@/components/PixelForm';
import FilterBar from '@/components/FilterBar';
import PixelCard from '@/components/PixelCard';
import { getPixels } from '@/lib/actions';
import { Crosshair } from 'lucide-react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    map?: string;
    side?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const map = params?.map || 'All';
  const side = params?.side || 'All';

  const pixels = await getPixels(query, map, side);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                    <Crosshair className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                    CS2 Pixels
                </h1>
            </div>
            {/* User profile or other nav items could go here */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <FilterBar />

        {pixels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 border border-zinc-800 border-dashed rounded-xl bg-zinc-900/50">
                <Crosshair className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-white">No pixels found</h3>
                <p>Try adjusting your search or create a new pixel.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pixels.map((pixel) => (
                <PixelCard key={pixel.id} pixel={pixel} />
            ))}
            </div>
        )}
      </div>

      <PixelForm />
    </main>
  );
}
