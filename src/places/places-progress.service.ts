import { Injectable, OnModuleDestroy } from '@nestjs/common';
import IORedis from 'ioredis';
import { getPlacesProgressKey } from './places.constants';

export interface PlacesProgress {
  page: number;
  placesFetched: number;
  done?: boolean;
}

@Injectable()
export class PlacesProgressService implements OnModuleDestroy {
  private readonly redis: IORedis;

  constructor() {
    this.redis = new IORedis(process.env.REDIS_URL!);
  }

  async setProgress(city: string, type: string, progress: PlacesProgress) {
    const key = getPlacesProgressKey(city, type);
    await this.redis.set(key, JSON.stringify(progress));
  }

  async getProgress(city: string, type: string): Promise<PlacesProgress> {
    const key = getPlacesProgressKey(city, type);
    const data = await this.redis.get(key);
    return data
      ? (JSON.parse(data) as PlacesProgress)
      : { page: 0, placesFetched: 0, done: false };
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
