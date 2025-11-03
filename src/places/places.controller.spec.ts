import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

describe('PlacesController (e2e)', () => {
  let app: INestApplication;
  let service: PlacesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [
        {
          provide: PlacesService,
          useValue: {
            getPlaces: jest.fn().mockResolvedValue([]),
            enqueueFetch: jest.fn().mockResolvedValue({
              message: 'Job enqueued',
              jobId: 'city-type',
            }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    service = module.get<PlacesService>(PlacesService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/places (GET)', async () => {
    const query = {
      city: 'Copenhagen',
      type: 'coffee',
      page: '1',
      limit: '20',
    };
    const res = await request(app.getHttpServer())
      .get('/places')
      .query(query)
      .expect(200);
    expect(res.body).toEqual([]);
    expect(service.getPlaces).toHaveBeenCalledWith(query);
  });

  it('/places/fetch (POST)', async () => {
    const body = { city: 'Copenhagen', type: 'coffee' };
    const res = await request(app.getHttpServer())
      .post('/places/fetch')
      .send(body)
      .expect(201);
    expect(res.body).toEqual({ message: 'Job enqueued', jobId: 'city-type' });
    expect(service.enqueueFetch).toHaveBeenCalledWith('Copenhagen', 'coffee');
  });
});
