-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT,
    "name" TEXT,
    "runtimeId" TEXT NOT NULL,
    "whiteListed" BOOLEAN NOT NULL DEFAULT false,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("id", "name", "runtimeId", "source", "whiteListed") SELECT "id", "name", "runtimeId", "source", "whiteListed" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_runtimeId_key" ON "User"("runtimeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
