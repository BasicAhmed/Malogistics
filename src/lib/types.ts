export type OrderStatus =
  | "enquiry"
  | "quoted"
  | "confirmed"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type OrderSource = "web_enquiry" | "sales_manual";

export interface StatusEvent {
  status: OrderStatus;
  at: string; // ISO timestamp
  note?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  status: OrderStatus;
  source: OrderSource;

  goodsType: string;
  origin: string;
  destination: string;
  details: string;
  urgency: string;

  name: string;
  company?: string;
  phone: string;
  email: string;

  // sales/ops fields
  quoteAmount?: number;
  corridor?: string; // e.g. "JNB-DUR"
  onTime?: boolean; // set on delivery for performance reporting

  createdAt: string;
  updatedAt: string;
  history: StatusEvent[];
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  enquiry: "New enquiry",
  quoted: "Quoted",
  confirmed: "Confirmed",
  in_transit: "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_ORDER: OrderStatus[] = [
  "enquiry",
  "quoted",
  "confirmed",
  "in_transit",
  "delivered",
];
