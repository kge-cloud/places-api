import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { IPlacesProvider } from './places-provider.interface';

@Injectable()
export class PlacesGoogleService implements IPlacesProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get('GOOGLE_API_KEY')!;
  }

  async fetchPlaces(city: string, type: string, pageToken?: string) {
    const url = `${this.baseUrl}/textsearch/json`;
    const params: Record<string, string> = {
      query: `${type} in ${city}`,
      key: this.apiKey,
      ...(pageToken ? { pagetoken: pageToken } : {}),
    };

    try {
      const response = await axios.get(url, { params });
      const data = response.data;

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(
          `Error fetching "${type}" in "${city}": ${error.message}`,
          error.stack,
        );
      } else {
        console.log(`Error fetching "${type}" in "${city}": ${String(error)}`);
      }

      throw error;
    }
  }
}
