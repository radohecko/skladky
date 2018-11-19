// TODO: define types of location according to database
export interface Dump {
  id: string;
  email: string | null;
  image: null;
  location: any[];
  materials: string[];
  substances: string[];
}
