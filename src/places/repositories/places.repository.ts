import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, Place } from '@prisma/client';

@Injectable()
export class PlacesRepository {
  constructor(private prisma: PrismaService) {}

  createOrUpdatePlace = async (
    data: Prisma.PlaceCreateInput,
  ): Promise<Place> => {
    return this.prisma.place.upsert({
      where: { placeId: data.placeId },
      update: {
        name: data.name,
        address: data.address,
        city: data.city,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        detailsCached: data.detailsCached ?? false,
        enrichedText: data.enrichedText ?? null,
        updatedAt: new Date(),
      },
      create: {
        name: data.name,
        address: data.address,
        city: data.city,
        type: data.type,
        latitude: data.latitude,
        longitude: data.longitude,
        placeId: data.placeId,
        pageNumber: data.pageNumber ?? 1,
        detailsCached: data.detailsCached ?? false,
        enrichedText: data.enrichedText ?? null,
      },
    });
  };

  findByCityAndType = async (
    city: string,
    type: string,
    page = 1,
    limit = 20,
  ): Promise<Place[]> => {
    const places: Place[] = await this.prisma.place.findMany({
      where: { city, type },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return places;
  };

  async countByCityAndType(city: string, type: string): Promise<number> {
    return this.prisma.place.count({
      where: { city, type },
    });
  }
}
