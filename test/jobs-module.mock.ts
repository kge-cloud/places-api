import { Module } from '@nestjs/common';
import { JobsQueue } from '../src/jobs/jobs.queue';

@Module({
  providers: [
    {
      provide: JobsQueue,
      useValue: {
        enqueuePlacesFetch: jest.fn().mockResolvedValue({
          message: 'Job enqueued',
          jobId: 'mock-job',
        }),
      },
    },
  ],
  exports: [JobsQueue],
})
export class JobsModuleMock {}
