import { User } from '@prisma/client'
export type PaymentMethod = "esewa" | "khalti" | "stripe";

export type SafeUser = Omit<User, 'password'> & {
  id: string
  email: string
  fullName: string | null
  mobile: string | null
  createdAt: Date
}

export type TokenPayload = {
    id: string
    email: string
}

export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | undefined;
  capacity: number;
};

export interface PaymentRequestData {
  amount: string;
  productName: string;
  transactionId: string;
  method: PaymentMethod;
}

export interface EsewaConfigData {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface EsewaResponse {
  esewaConfig: EsewaConfigData;
}

export interface KhaltiConfigData {
  return_url: string;
  website_url: string;
  amount: number;
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface KhaltiResponse {
  khaltiPaymentUrl: string;
}  

// Add these to your existing types
export interface BookingUser {
  email: string;
  fullName: string | null;
  mobile: string | null;
}

export interface BookingWithRelations {
  id: string;
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  specialRequests?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  room: {
    id: string;
    name: string;
    price: number;
    // Add other room fields as needed
  };
  user: BookingUser;
}