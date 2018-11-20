import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import Geopoint = firestore.GeoPoint;

export interface Dump {
  id: string;
  email: string | null;
  image: null;
  location: Geopoint;
  materials: string[];
  substances: string[];
  amount: string;
  status: string;
  timestamp: Timestamp;
}
