import { Pixel, PixelImage } from '@prisma/client';
import Image from 'next/image';
import { MapPin, Crosshair, Images } from 'lucide-react';
import Link from 'next/link';

type PixelWithImages = Pixel & {
    images: PixelImage[];
}

export default function PixelCard({ pixel }: { pixel: PixelWithImages }) {
  const thumbnail = pixel.images.length > 0 ? pixel.images[0].url : null;
  const imageCount = pixel.images.length;

  return (
    <Link href={`/pixel/${pixel.id}`} className="block">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group h-full flex flex-col">
        <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
            {thumbnail ? (
            <Image
                src={thumbnail}
                alt={pixel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            ) : (
                <div className="text-zinc-700 flex flex-col items-center">
                    <Crosshair className="w-12 h-12 mb-2 opacity-20" />
                    <span className="text-sm font-mono opacity-50">No Image</span>
                </div>
            )}

            {imageCount > 1 && (
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    +{imageCount - 1}
                </div>
            )}

            <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                {pixel.map}
            </div>
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold border ${pixel.side === 'CT' ? 'bg-blue-900/80 border-blue-500/30 text-blue-200' : 'bg-yellow-900/80 border-yellow-500/30 text-yellow-200'}`}>
                {pixel.side}
            </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-white mb-1 truncate group-hover:text-blue-400 transition-colors">{pixel.name}</h3>
            {pixel.description && (
                <p className="text-zinc-400 text-sm line-clamp-2 mb-3 flex-1">{pixel.description}</p>
            )}

            <div className="flex items-center justify-between text-xs text-zinc-500 mt-2 border-t border-zinc-800/50 pt-3">
                <span>{new Date(pixel.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
        </div>
    </Link>
  );
}
