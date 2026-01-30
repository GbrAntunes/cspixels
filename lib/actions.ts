'use server'

import db from '@/lib/db';
import { Pixel } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function createPixel(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const map = formData.get('map') as string;
  const side = formData.get('side') as string;
  const images = formData.getAll('images') as File[];

  if (!name || !map || !side) {
    throw new Error('Missing required fields');
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const savedImages: { url: string; order: number }[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (image && image.size > 0 && image.name !== 'undefined') {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${Date.now()}-${i}-${image.name.replace(/\s/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      savedImages.push({
        url: `/uploads/${fileName}`,
        order: i
      });
    }
  }

  await db.pixel.create({
    data: {
      name,
      description,
      map,
      side,
      images: {
        create: savedImages
      }
    },
  });

  revalidatePath('/');
}

export async function getPixels(query?: string, map?: string, side?: string) {
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  if (map && map !== 'All') {
    where.map = map;
  }

  if (side && side !== 'All') {
    where.side = side;
  }

  const pixels = await db.pixel.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: {
        orderBy: {
          order: 'asc'
        },
        take: 1
      }
    }
  });

  return pixels;
}

export async function getPixelById(id: string) {
  const pixel = await db.pixel.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });
  return pixel;
}

export async function deletePixel(id: string) {
  if (!id) throw new Error('Missing ID');

  const pixel = await db.pixel.findUnique({
    where: { id },
    include: { images: true }
  });

  if (pixel) {
    for (const image of pixel.images) {
      // Construct absolute path from public URL
      // stored url format: /uploads/filename
      const filePath = path.join(process.cwd(), 'public', image.url);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error);
        // Continue deleting other files and DB record even if one file fails
      }
    }

    await db.pixel.delete({
      where: { id }
    });
  }

  revalidatePath('/');
}

export async function updatePixel(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const map = formData.get('map') as string;
  const side = formData.get('side') as string;
  // We are not handling image updates in this simplified edit flow yet.

  await db.pixel.update({
    where: { id },
    data: {
      name,
      description,
      map,
      side
    }
  });

  revalidatePath('/');
  revalidatePath(`/pixel/${id}`);
}
