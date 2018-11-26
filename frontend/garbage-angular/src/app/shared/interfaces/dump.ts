import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import Geopoint = firestore.GeoPoint;

export interface Dump {
  id: string | null;
  email: string | null;
  image: File | null;
  locationName: string;
  location: Geopoint;
  region: string;
  materials: string[];
  substances: string[];
  amount: string;
  status: string;
  timestamp: Timestamp;
}
