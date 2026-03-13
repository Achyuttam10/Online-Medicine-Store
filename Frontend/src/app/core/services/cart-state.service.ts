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
    return this.cartItemsSignal().reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  });

  // Computed total items count
  public totalItems = computed(() => {
     return this.cartItemsSignal().reduce((count, item) => count + item.quantity, 0);
  });

  addToCart(medicine: Medicine, quantity: number = 1): void {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.medicine.medicineId === medicine.medicineId);
      if (existingItem) {
        return items.map(item =>
          item.medicine.medicineId === medicine.medicineId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...items, { medicine: medicine, quantity: quantity }];
    });
  }

  removeFromCart(medicineId: number): void {
    this.cartItemsSignal.update(items => items.filter(item => item.medicine.medicineId !== medicineId));
  }

  updateQuantity(medicineId: number, quantity: number): void {
    this.cartItemsSignal.update(items =>
      items.map(item =>
        item.medicine.medicineId === medicineId ? { ...item, quantity: quantity } : item
      )
    );
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
  }
}
