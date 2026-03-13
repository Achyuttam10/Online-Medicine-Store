import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../shared/models/cart.model';
import { Medicine } from '../../shared/models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private cartItemsSignal = signal<CartItem[]>([]);

  // Exposed read-only signal
  public cartItems = this.cartItemsSignal.asReadonly();

  // Computed total price
  public totalPrice = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + (item.Medicine.Price * item.Quantity), 0);
  });

  // Computed total items count
  public totalItems = computed(() => {
     return this.cartItemsSignal().reduce((count, item) => count + item.Quantity, 0);
  });

  addToCart(medicine: Medicine, quantity: number = 1): void {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.Medicine.MedicineID === medicine.MedicineID);
      if (existingItem) {
        return items.map(item =>
          item.Medicine.MedicineID === medicine.MedicineID
            ? { ...item, Quantity: item.Quantity + quantity }
            : item
        );
      }
      return [...items, { Medicine: medicine, Quantity: quantity }];
    });
  }

  removeFromCart(medicineId: number): void {
    this.cartItemsSignal.update(items => items.filter(item => item.Medicine.MedicineID !== medicineId));
  }

  updateQuantity(medicineId: number, quantity: number): void {
    this.cartItemsSignal.update(items =>
      items.map(item =>
        item.Medicine.MedicineID === medicineId ? { ...item, Quantity: quantity } : item
      )
    );
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
  }
}
