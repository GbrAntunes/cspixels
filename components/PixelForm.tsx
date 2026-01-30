'use client';

import { createPixel, updatePixel } from '@/lib/actions';
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface PixelFormProps {
    initialData?: any;
    onClose?: () => void;
    trigger?: React.ReactNode;
}

export default function PixelForm({ initialData, onClose, trigger }: PixelFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // New state to manage files
  const [mounted, setMounted] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
      defaultValues: initialData || {
          name: '',
          description: '',
          map: 'Mirage',
          side: 'CT'
      }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
          const newFiles: File[] = Array.from(files);
          const newPreviews: string[] = [];

          newFiles.forEach(file => {
              const url = URL.createObjectURL(file);
              newPreviews.push(url);
          });

          setSelectedFiles(prev => [...prev, ...newFiles]);
          setPreviews(prev => [...prev, ...newPreviews]);

          // Reset the input value so the same file can be selected again if needed
          // and to ensure we rely on our state, not the input.
          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }
      }
  };

  const removePreview = (index: number) => {
      const newPreviews = [...previews];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setPreviews(newPreviews);

      const newFiles = [...selectedFiles];
      newFiles.splice(index, 1);
      setSelectedFiles(newFiles);
  }

  const handleClose = () => {
      setIsOpen(false);

      // Cleanup preview URLs
      previews.forEach(url => URL.revokeObjectURL(url));

      setPreviews([]);
      setSelectedFiles([]);
      reset();
      if (onClose) onClose();
  }

  const openForm = () => {
      setIsOpen(true);
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('map', data.map);
    formData.append('side', data.side);

    // Append files from our state
    selectedFiles.forEach((file) => {
         formData.append('images', file);
    });

    try {
        if (initialData) {
            await updatePixel(initialData.id, formData);
        } else {
            // Validate that we have at least one image if needed, or backend handles it
            await createPixel(formData);
        }
        handleClose();
    } catch (e) {
        console.error(e);
        alert('Failed to save pixel');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    if (trigger) {
        return <div onClick={openForm}>{trigger}</div>;
    }
    return (
      <button
        onClick={openForm}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 z-50 flex items-center justify-center group"
      >
        <Plus className="w-8 h-8" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2">
          New Pixel
        </span>
      </button>
    );
  }

  return mounted ? createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Pixel' : 'Add New Pixel'}</h2>
            <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className={`grid grid-cols-1 ${initialData ? '' : 'md:grid-cols-2'} gap-4`}>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Pixel Name</label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="e.g. Mirage Connector Smoke"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Map</label>
                            <select
                                {...register('map', { required: true })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                            >
                                <option value="Mirage">Mirage</option>
                                <option value="Dust 2">Dust 2</option>
                                <option value="Inferno">Inferno</option>
                                <option value="Nuke">Nuke</option>
                                <option value="Overpass">Overpass</option>
                                <option value="Ancient">Ancient</option>
                                <option value="Vertigo">Vertigo</option>
                                <option value="Anubis">Anubis</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Side</label>
                            <div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
                                <label className="flex-1 text-center cursor-pointer">
                                    <input type="radio" value="CT" {...register('side', { required: true })} className="sr-only peer" />
                                    <span className="block py-1.5 px-3 rounded-md text-sm text-zinc-400 peer-checked:bg-blue-600 peer-checked:text-white transition-all">CT</span>
                                </label>
                                <label className="flex-1 text-center cursor-pointer">
                                     <input type="radio" value="TR" {...register('side', { required: true })} className="sr-only peer" />
                                    <span className="block py-1.5 px-3 rounded-md text-sm text-zinc-400 peer-checked:bg-yellow-600 peer-checked:text-white transition-all">TR</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                            placeholder="Aim at the tip of the antenna..."
                        />
                    </div>
                </div>

                {!initialData && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Step-by-step Images</label>
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer hover:bg-zinc-800/50 hover:border-blue-500 transition-all ${previews.length > 0 ? 'h-24' : 'h-64'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-500">
                            <Upload className="w-8 h-8 mb-2" />
                            <p className="text-xs">Click to upload images</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-700 group">
                                    <Image src={src} alt={`Preview ${index}`} fill className="object-cover" />
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => removePreview(index)}
                                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                        Step {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                )}
            </div>

            {initialData && (
                 <p className="text-xs text-zinc-500 italic">
                    Note: Editing images is not supported in this version.
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Pixel' : 'Save Pixel')}
            </button>
        </form>
      </div>
    </div>,
    document.body
  ) : null;
}
