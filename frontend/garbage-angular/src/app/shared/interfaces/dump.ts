import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

// TODO: define types of location according to database
export interface Dump {
  id: string;
  email: string | null;
  image: null;
  location: any[];
  materials: string[];
  substances: string[];
  amount: string;
  status: string;
  timestamp: Timestamp;
}
