'use client';

import { deletePixel } from '@/lib/actions';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this pixel? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await deletePixel(id);
                // Redirect happens via server action revalidate but client router push is safer for immediate feel or just relying on server redirect if implemented there.
                // Since our action uses revalidatePath('/'), we should manually go back to home.
                router.push('/');
            } catch (error) {
                alert('Failed to delete pixel');
                setIsDeleting(false);
            }
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-red-900/30 text-zinc-400 hover:text-red-500 rounded-lg transition-colors flex items-center gap-2"
            title="Delete Pixel"
        >
            <Trash2 className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Delete</span>
        </button>
    );
}
