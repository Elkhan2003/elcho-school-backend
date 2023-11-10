-- CreateTable
CREATE TABLE "Error" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "hint" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("id")
);
