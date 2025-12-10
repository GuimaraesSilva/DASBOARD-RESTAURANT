export interface PaymentMethod {
  method: string;
  transactions: number;
  revenue: number;
  fill?: string;
}