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
  by?: string; // admin name who made the change, when applicable
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

  // quotation engine fields
  quoteBreakdown?: Record<string, any>;
  quoteInputs?: Record<string, any>;
  quoteSentAt?: string;
  followUpStage?: number; // 0 = none sent, 1 = first nudge sent, 2 = final nudge sent
  nextFollowUpAt?: string;

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
