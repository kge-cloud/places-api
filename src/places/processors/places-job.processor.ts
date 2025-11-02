import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PlacesService } from '../places.service';
import { PLACES_FETCH_QUEUE } from 'src/jobs/jobs.constants';
import * as placesProviderInterface from '../providers/places-provider.interface';
import { Inject } from '@nestjs/common';
import type { IPlacesProvider } from '../providers/places-provider.interface';
import { PlacesProgressService } from '../places-progress.service';

@Processor(PLACES_FETCH_QUEUE)
export class PlacesJobProcessor extends WorkerHost {
  constructor(
    @Inject('PlacesProvider')
    private readonly placesProvider: IPlacesProvider,
    private readonly placesService: PlacesService,
    private readonly progressService: PlacesProgressService,
  ) {
    super();
  }

  async process(job) {
    const { city, type } = job.data;
    console.log(`Processing fetch job for ${city} / ${type}`);

    let pageToken: string | undefined;
    let page = 1;
    let totalFetched = 0;

    do {
      const result = await this.placesProvider.fetchPlaces(
        city,
        type,
        pageToken,
      );
      const places: placesProviderInterface.PlaceResult[] =
        result.results ?? [];
      console.log(`Fetched ${places.length} places from page ${page}`);

      for (const p of places) {
        await this.placesService.createOrUpdatePlace({
          name: p.name,
          address: p.formatted_address,
          latitude: p.geometry.location.lat,
          longitude: p.geometry.location.lng,
          city,
          type,
          placeId: p.place_id,
          pageNumber: page,
        });
      }

      totalFetched += places.length;

      const progress = { page, placesFetched: totalFetched };

      await this.progressService.setProgress(city, type, progress);

      pageToken = result.next_page_token ?? undefined;
      if (pageToken) {
        // Google requires 2s delay before next_page_token becomes active but
        // I put 5s to be able to subscribe and see the progress
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      page++;
    } while (pageToken);

    console.log(
      `Completed fetch for ${city}/${type}. Total places fetched: ${totalFetched}`,
    );

    await this.progressService.setProgress(city, type, {
      page: page - 1,
      placesFetched: totalFetched,
      done: true,
    });
  }
}
