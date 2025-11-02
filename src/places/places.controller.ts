import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { QueryPlacesDto } from './dto/query-places.dto';
import { FetchPlacesDto } from './dto/fetch-places.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async getPlaces(@Query() query: QueryPlacesDto) {
    return this.placesService.getPlaces(query);
  }

  @Post('fetch')
  async fetchPlaces(@Body() body: FetchPlacesDto) {
    const { city, type } = body;

    return this.placesService.enqueueFetch(city, type);
  }
}
