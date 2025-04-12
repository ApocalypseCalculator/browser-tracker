-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT,
    "name" TEXT,
    "runtimeId" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "name", "runtimeId", "source") SELECT "id", "name", "runtimeId", "source" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_runtimeId_key" ON "User"("runtimeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
