import { PlacesProgressService } from './places-progress.service';
import IORedis from 'ioredis';

jest.mock('ioredis');

describe('PlacesProgressService', () => {
  let service: PlacesProgressService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      set: jest.fn(),
      get: jest.fn(),
      quit: jest.fn(),
    };
    (IORedis as unknown as jest.Mock).mockImplementation(() => redisMock);
    service = new PlacesProgressService();
  });

  it('should set progress', async () => {
    await service.setProgress('C', 'coffee', { page: 1, placesFetched: 10 });
    expect(redisMock.set).toHaveBeenCalled();
  });

  it('should get progress', async () => {
    redisMock.get.mockResolvedValue(
      JSON.stringify({ page: 2, placesFetched: 20 }),
    );
    const progress = await service.getProgress('C', 'coffee');
    expect(progress).toEqual({ page: 2, placesFetched: 20 });
  });

  it('should return default progress if key missing', async () => {
    redisMock.get.mockResolvedValue(null);
    const progress = await service.getProgress('C', 'coffee');
    expect(progress).toEqual({ page: 0, placesFetched: 0, done: false });
  });
});
