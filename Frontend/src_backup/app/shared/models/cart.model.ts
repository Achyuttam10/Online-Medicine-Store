import { Medicine } from './medicine.model';

export interface CartItem {
  Medicine: Medicine;
  Quantity: number;
}
