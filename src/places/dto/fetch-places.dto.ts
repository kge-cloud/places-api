import { IsNotEmpty, IsString } from 'class-validator';

export enum PlaceType {
  Cemitery = 'cemitery',
  Coffee = 'coffee',
  Restaurant = 'restaurant',
  Bakery = 'bakery',
}

export class FetchPlacesDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  type: PlaceType;
}
