/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Pixel` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PixelImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "pixelId" TEXT NOT NULL,
    CONSTRAINT "PixelImage_pixelId_fkey" FOREIGN KEY ("pixelId") REFERENCES "Pixel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pixel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "map" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pixel" ("createdAt", "description", "id", "map", "name", "side", "updatedAt") SELECT "createdAt", "description", "id", "map", "name", "side", "updatedAt" FROM "Pixel";
DROP TABLE "Pixel";
ALTER TABLE "new_Pixel" RENAME TO "Pixel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
