-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "placeId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "detailsCached" BOOLEAN NOT NULL DEFAULT false,
    "enrichedText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityPlaceFetchStatus" (
    "city" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastFetched" TIMESTAMP(3),
    "progress" DOUBLE PRECISION,

    CONSTRAINT "CityPlaceFetchStatus_pkey" PRIMARY KEY ("city","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_placeId_key" ON "Place"("placeId");
