import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobsQueue } from './jobs.queue';
import {
  JOB_LOCK_DURATION,
  JOB_LOCK_RENEW_TIME,
  PLACES_FETCH_QUEUE,
} from './jobs.constants';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueueAsync({
      name: PLACES_FETCH_QUEUE,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST') ?? 'localhost',
          port: Number(config.get('REDIS_PORT') ?? 6379),
        },
        workerOptions: {
          lockDuration: JOB_LOCK_DURATION,
          lockRenewTime: JOB_LOCK_RENEW_TIME,
        },
      }),
    }),
  ],
  providers: [JobsQueue],
  exports: [JobsQueue, BullModule],
})
export class JobsModule {}
