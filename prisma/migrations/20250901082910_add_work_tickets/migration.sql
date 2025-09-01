-- CreateTable
CREATE TABLE "public"."work_tickets" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "workerName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_tickets_pkey" PRIMARY KEY ("id")
);
