import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartStateService } from '../../core/services/cart-state.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../shared/models/order.model';
import { OrderItem } from '../../shared/models/order-item.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private cartService = inject(CartStateService);
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  // Checkout Steps: 1 = Cart, 2 = Shipping, 3 = Payment Summary
  currentStep = signal<number>(1);
  
  isSubmitting = signal<boolean>(false);
  submitSuccess = signal<boolean>(false);
  submitError = signal<string | null>(null);

  checkoutForm: FormGroup = this.fb.group({
    customerName: ['', Validators.required],
    shippingAddress: ['', Validators.required],
    city: ['', Validators.required],
    zipCode: ['', Validators.required],
  });

  updateQuantity(medicineId: number, currentQuantity: number, change: number): void {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(medicineId, newQuantity);
    } else {
      this.cartService.removeFromCart(medicineId);
    }
  }

  removeItem(medicineId: number): void {
    this.cartService.removeFromCart(medicineId);
  }

  nextStep(): void {
    if (this.currentStep() === 1 && this.cartItems().length > 0) {
      this.currentStep.set(2);
    } else if (this.currentStep() === 2 && this.checkoutForm.valid) {
      this.currentStep.set(3);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid || this.cartItems().length === 0) return;

    this.isSubmitting.set(true);
    this.submitError.set(null);

    // Build Order Model mapping from the Cart items and Checkout Form
    const newOrder: Order = {
      customerId: 1, // Hardcoded for demo/test if there's no real logged-in ID, could be fetched from AuthService if extended
      orderDate: new Date().toISOString(),
      totalAmount: this.totalPrice(),
      orderStatus: 'Pending',
      shippingAddress: `${this.checkoutForm.value.shippingAddress}, ${this.checkoutForm.value.city}, ${this.checkoutForm.value.zipCode}`
    };

    // Note: The backend currently ignores the nested `Orderitems` on `Order` POST or requires separate logic.
    // If the backend `Order` model auto-maps nested collections, we could pass it. 
    // Usually, we just post the Order for Hackathons and extend later if necessary. Let's post just the order.

    this.orderService.placeOrder(newOrder).subscribe({
      next: (order) => {
        this.submitSuccess.set(true);
        this.cartService.clearCart();
        this.checkoutForm.reset();
        this.currentStep.set(1);
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Failed to place order:', err);
        this.submitError.set('Failed to place order. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }
}
