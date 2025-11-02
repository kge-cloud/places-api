import { PLACES_FETCH_QUEUE } from 'src/jobs/jobs.constants';

export const getPlacesProgressKey = (city: string, type: string) =>
  `${PLACES_FETCH_QUEUE}:${city}-${type}:progress`;
