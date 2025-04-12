-- CreateTable
CREATE TABLE "HistoryItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lastVisitTime" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "typedCount" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "HistoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "runtimeId" TEXT NOT NULL
);
