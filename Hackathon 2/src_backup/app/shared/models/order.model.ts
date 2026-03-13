export interface Order {
  OrderID: number;
  CustomerID: number;
  OrderDate: Date | string;
  TotalAmount: number;
  OrderStatus: string;
  ShippingAddress: string;
}
