export interface Order {
  orderId?: number;
  customerId?: number;
  orderDate?: Date | string;
  totalAmount?: number;
  orderStatus?: string;
  shippingAddress?: string;
}
