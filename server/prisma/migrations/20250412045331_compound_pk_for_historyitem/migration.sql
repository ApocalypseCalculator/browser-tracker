/*
  Warnings:

  - The primary key for the `HistoryItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoryItem" (
    "id" INTEGER NOT NULL,
    "lastVisitTime" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "typedCount" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id", "userId"),
    CONSTRAINT "HistoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HistoryItem" ("id", "lastVisitTime", "title", "typedCount", "updatedAt", "url", "userId", "visitCount") SELECT "id", "lastVisitTime", "title", "typedCount", "updatedAt", "url", "userId", "visitCount" FROM "HistoryItem";
DROP TABLE "HistoryItem";
ALTER TABLE "new_HistoryItem" RENAME TO "HistoryItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
