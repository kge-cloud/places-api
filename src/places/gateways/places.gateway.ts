import { Controller, Sse, Query } from '@nestjs/common';
import { interval } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PlacesProgressService } from '../places-progress.service';
import { GOOGLE_MAPS_FETCH_DELAY } from '../places.constants';

@Controller('places')
export class PlacesGateway {
  constructor(private readonly progressService: PlacesProgressService) {}

  @Sse('stream')
  stream(@Query('city') city: string, @Query('type') type: string) {
    return interval(GOOGLE_MAPS_FETCH_DELAY).pipe(
      switchMap(() => this.progressService.getProgress(city, type)),
      map((progress) => ({ data: JSON.stringify(progress) })),
    );
  }
}
