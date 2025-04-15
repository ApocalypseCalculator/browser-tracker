/*
  Warnings:

  - You are about to drop the column `whiteListed` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `source` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "runtimeId" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("created", "id", "name", "runtimeId", "source") SELECT "created", "id", "name", "runtimeId", "source" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_runtimeId_key" ON "User"("runtimeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
