import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { PLACES_FETCH_QUEUE } from './jobs.constants';

@Injectable()
export class JobsQueue implements OnModuleDestroy {
  readonly placesQueue: Queue;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('REDIS_URL')!;
    const connection = new IORedis(redisUrl);

    this.placesQueue = new Queue(PLACES_FETCH_QUEUE, { connection });
  }

  enqueuePlacesFetch = async (city: string, type: string) => {
    const jobId = `${city}-${type}`;
    const existing = await this.placesQueue.getJob(jobId);

    if (existing) return { message: 'Job already in progress', jobId };
    try {
      await this.placesQueue.add(
        PLACES_FETCH_QUEUE,
        { city, type },
        {
          jobId,
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
    } catch (err) {
      console.error(err);
      return { data: null, error: 'Failed to enqueue job' };
    }
    return { message: 'Job enqueued', jobId };
  };

  async onModuleDestroy() {
    await this.placesQueue.close();
  }
}
