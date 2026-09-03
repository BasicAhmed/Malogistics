export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return `R ${amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}
