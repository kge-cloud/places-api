import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacesRepository } from './repositories/places.repository';
import { JobsModule } from 'src/jobs/jobs.module';
import { PlacesGoogleService } from './providers/places-google.service';
import { PlacesJobProcessor } from './processors/places-job.processor';
import { PlacesGateway } from './gateways/places.gateway';
import { PlacesProgressService } from './places-progress.service';

@Module({
  imports: [JobsModule],
  controllers: [PlacesController, PlacesGateway],
  providers: [
    PlacesService,
    PlacesGoogleService,
    PlacesRepository,
    PlacesJobProcessor,
    {
      provide: 'PlacesProvider',
      useClass: PlacesGoogleService,
    },
    PlacesProgressService,
  ],
  exports: ['PlacesProvider', PlacesService],
})
export class PlacesModule {}
