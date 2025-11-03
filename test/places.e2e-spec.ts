import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JobsModule } from '../src/jobs/jobs.module';
import { JobsModuleMock } from './jobs-module.mock';

describe('Places API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(JobsModule)
      .useModule(JobsModuleMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /places should return an array', async () => {
    const res = await request(app.getHttpServer())
      .get('/places')
      .query({ city: 'Copenhagen', type: 'coffee' })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /places/fetch should enqueue a job', async () => {
    const res = await request(app.getHttpServer())
      .post('/places/fetch')
      .send({ city: 'Copenhagen', type: 'coffee' })
      .expect(201);

    expect(res.body).toEqual({
      message: 'Job enqueued',
      jobId: 'mock-job',
    });
  });
});
