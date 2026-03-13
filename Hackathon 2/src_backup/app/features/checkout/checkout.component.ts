import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartStateService } from '../../core/services/cart-state.service';
import { Order } from '../../shared/models/order.model';
import { OrderItem } from '../../shared/models/order-item.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private http = inject(HttpClient);
  private cartService = inject(CartStateService);
  private fb = inject(FormBuilder);
  private router = inject(Router); // Only for navigation after processing if needed

  // Expose signals to the template
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  isSubmitting = signal<boolean>(false);
  submitError = signal<string | null>(null);
  submitSuccess = signal<boolean>(false);

  checkoutForm: FormGroup = this.fb.group({
    customerID: [1, Validators.required], // Hardcoded for demo
    shippingAddress: ['', Validators.required]
  });

  async placeOrder(): Promise<void> {
    if (this.checkoutForm.invalid || this.cartItems().length === 0) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitError.set(null);

    try {
      // 1. Prepare Order data
      const orderPayload: Partial<Order> = {
        CustomerID: this.checkoutForm.value.customerID,
        OrderDate: new Date().toISOString(),
        TotalAmount: this.totalPrice(),
        OrderStatus: 'Pending',
        ShippingAddress: this.checkoutForm.value.shippingAddress
      };

      // 2. Post Order to .NET API
      const createdOrder = await firstValueFrom(
        this.http.post<Order>('/api/orders', orderPayload)
      );

      // 3. Prepare OrderItems data
      const orderItemsPayload: Partial<OrderItem>[] = this.cartItems().map(item => ({
        OrderID: createdOrder.OrderID,
        MedicineID: item.Medicine.MedicineID,
        Quantity: item.Quantity,
        Price: item.Medicine.Price
      }));

      // 4. Post OrderItems to .NET API
      await firstValueFrom(
        this.http.post<OrderItem[]>('/api/orderitems/bulk', orderItemsPayload)
      );

      // Success
      this.submitSuccess.set(true);
      this.cartService.clearCart();
      this.checkoutForm.reset();

    } catch (error) {
      console.error('Checkout failed', error);
      this.submitError.set('An error occurred during checkout. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
