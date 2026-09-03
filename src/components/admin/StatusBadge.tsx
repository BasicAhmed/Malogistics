import { OrderStatus, STATUS_LABELS } from "@/lib/types";

const COLORS: Record<OrderStatus, string> = {
  enquiry: "bg-fog text-cargo-maroon",
  quoted: "bg-signal-amber/30 text-cargo-maroon",
  confirmed: "bg-signal-amber text-cargo-maroon",
  in_transit: "bg-cargo-maroon text-paper",
  delivered: "bg-status-clear text-paper",
  cancelled: "bg-status-hold text-paper",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
