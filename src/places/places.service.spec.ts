import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from './places.service';
import { PlacesRepository } from './repositories/places.repository';
import { JobsQueue } from '../jobs/jobs.queue';
import { Prisma } from '@prisma/client';

describe('PlacesService', () => {
  let service: PlacesService;
  let repo: PlacesRepository;
  let queue: JobsQueue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        {
          provide: PlacesRepository,
          useValue: {
            createOrUpdatePlace: jest.fn(),
            findByCityAndType: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: JobsQueue,
          useValue: {
            enqueuePlacesFetch: jest.fn().mockResolvedValue({
              message: 'Job enqueued',
              jobId: 'city-type',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
    repo = module.get<PlacesRepository>(PlacesRepository);
    queue = module.get<JobsQueue>(JobsQueue);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch places from repo', async () => {
    const result = await service.getPlaces({
      city: 'Copenhagen',
      type: 'coffee',
      page: 1,
      limit: 20,
    });
    expect(repo.findByCityAndType).toHaveBeenCalledWith(
      'Copenhagen',
      'coffee',
      1,
      20,
    );
    expect(result).toEqual([]);
  });

  it('should enqueue a fetch job', async () => {
    const result = await service.enqueueFetch('Copenhagen', 'coffee');
    expect(queue.enqueuePlacesFetch).toHaveBeenCalledWith(
      'Copenhagen',
      'coffee',
    );
    expect(result).toEqual({ message: 'Job enqueued', jobId: 'city-type' });
  });

  it('should create or update place', async () => {
    const data: Prisma.PlaceCreateInput = {
      name: 'A',
      placeId: '1',
      city: 'C',
      type: 'coffee',
      latitude: 0,
      longitude: 0,
      address: 'addr',
      pageNumber: 1,
    };
    await service.createOrUpdatePlace(data);
    expect(repo.createOrUpdatePlace).toHaveBeenCalledWith(data);
  });
});
