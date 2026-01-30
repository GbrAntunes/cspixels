import { getPixelById } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Shield, Edit } from 'lucide-react';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';
import PixelForm from '@/components/PixelForm';

export default async function PixelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pixel = await getPixelById(id);

  if (!pixel) {
    notFound();
  }

  // Force type refinement if inference is failing
  const images = (pixel as any).images || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <Link href="/" className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white shrink-0">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold truncate">{pixel.name}</h1>
            </div>

            <div className="flex items-center gap-2">
                <PixelForm
                    initialData={pixel}
                    trigger={
                        <button className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors flex items-center gap-2" title="Edit Pixel">
                            <Edit className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm">Edit</span>
                        </button>
                    }
                />

                <div className="w-px h-6 bg-zinc-800 mx-1"></div>

                <DeleteButton id={id} />
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Meta Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2 space-y-4">
                <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {pixel.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{pixel.map}</span>
                     </div>
                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${pixel.side === 'CT' ? 'bg-blue-900/20 border-blue-500/20 text-blue-300' : 'bg-yellow-900/20 border-yellow-500/20 text-yellow-300'}`}>
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">{pixel.side} Side</span>
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{new Date(pixel.createdAt).toLocaleDateString()}</span>
                     </div>
                </div>
            </div>
        </div>

        {/* Gallery / Step-by-Step */}
        <div className="space-y-12">
            {images.map((image: any, index: number) => (
                <div key={image.id} className="group relative">
                    <div className="absolute -left-4 md:-left-12 top-0 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg z-10">
                            {index + 1}
                        </div>
                        {index !== images.length - 1 && (
                            <div className="w-0.5 h-full bg-zinc-800 absolute top-8"></div>
                        )}
                    </div>

                    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl group-hover:border-blue-500/30 transition-all">
                        <div className="relative w-full aspect-video">
                            <Image
                                src={image.url}
                                alt={`Step ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {images.length === 0 && (
                <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
                    <p>No images available for this pixel.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
