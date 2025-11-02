export interface PlaceResult {
  name: string;
  formatted_address: string;
  geometry: {
    latitude: number;
    longitude: number;
    location: {
      lat: number;
      lng: number;
    };
  };
  city: string;
  type: string;
  place_id: string;
}

export interface IPlacesProvider {
  fetchPlaces(
    city: string,
    type: string,
    pageToken?: string,
  ): Promise<{ results: PlaceResult[]; next_page_token?: string }>;
}
