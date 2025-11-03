import { Injectable } from '@nestjs/common';
import { PlacesRepository } from './repositories/places.repository';
import { QueryPlacesDto } from './dto/query-places.dto';
// A bit of a shortcut here, maybe cleaner to define the type in the repository
import { Prisma } from '@prisma/client';
import { JobsQueue } from '../jobs/jobs.queue';

@Injectable()
export class PlacesService {
  constructor(
    private readonly jobsQueue: JobsQueue,
    private readonly repo: PlacesRepository,
  ) {}

  async createOrUpdatePlace(data: Prisma.PlaceCreateInput) {
    return this.repo.createOrUpdatePlace(data);
  }

  getPlaces = (query: QueryPlacesDto) => {
    try {
      return this.repo.findByCityAndType(
        query.city,
        query.type,
        query.page,
        query.limit,
      );
    } catch (err) {
      console.error(err);
      return { data: null, error: 'Failed to fetch places' };
    }
  };

  enqueueFetch = async (city: string, type: string) => {
    return this.jobsQueue.enqueuePlacesFetch(city, type);
  };
}
