import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Order } from "./types";
import { QuoteBreakdown, PricingConfig, CATEGORY_LABELS, URGENCY_LABELS } from "./pricing";

const COLORS = {
  maroon: "#3C0008",
  amber: "#E8A33D",
  fog: "#D8C9CC",
  steel: "#4A2A2E",
  paper: "#F4F1EC",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: COLORS.maroon },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  brand: { fontSize: 16, fontWeight: 700 },
  brandAmber: { color: COLORS.amber },
  quoteMeta: { textAlign: "right" },
  sectionTitle: {
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.amber,
    marginBottom: 6,
    marginTop: 18,
    textTransform: "uppercase",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  label: { color: COLORS.steel },
  value: { fontWeight: 700 },
  table: { marginTop: 6, borderTop: `1px solid ${COLORS.fog}`, paddingTop: 8 },
  lineRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  lineLabel: { color: COLORS.steel },
  lineValue: {},
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `2px solid ${COLORS.maroon}`,
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: { fontSize: 13, fontWeight: 700 },
  totalValue: { fontSize: 13, fontWeight: 700 },
  footer: { marginTop: 40, fontSize: 8, color: COLORS.steel, borderTop: `1px solid ${COLORS.fog}`, paddingTop: 12 },
});

function money(n: number): string {
  return `R ${n.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

export async function generateQuotePdf(
  order: Order,
  breakdown: QuoteBreakdown,
  config: PricingConfig
): Promise<Buffer> {
  const inputs = order.quoteInputs as any;
  const category = inputs?.category ?? "general";
  const urgency = inputs?.urgency ?? "flexible";
  const quoteDate = new Date(order.quoteSentAt || order.updatedAt).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>
              M<Text style={styles.brandAmber}>/</Text> MA Logistics
            </Text>
            <Text style={{ fontSize: 8, color: COLORS.steel, marginTop: 2 }}>Delivered without hassle.</Text>
          </View>
          <View style={styles.quoteMeta}>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>QUOTATION</Text>
            <Text style={{ fontSize: 9, marginTop: 2 }}>{order.trackingNumber}</Text>
            <Text style={{ fontSize: 9, color: COLORS.steel }}>{quoteDate}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Customer</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{order.name}</Text>
        </View>
        {order.company && (
          <View style={styles.row}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>{order.company}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{order.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{order.phone}</Text>
        </View>

        <Text style={styles.sectionTitle}>Shipment</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.value}>{order.origin || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={styles.value}>{order.destination || "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>{inputs?.weightKg ?? "—"} kg</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Volume</Text>
          <Text style={styles.value}>{inputs?.volumeM3 ?? "—"} m³</Text>
        </View>
        {inputs?.scope === "regional" && (
          <View style={styles.row}>
            <Text style={styles.label}>Distance</Text>
            <Text style={styles.value}>{inputs?.distanceKm ?? "—"} km</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Delivery timeline</Text>
          <Text style={styles.value}>{URGENCY_LABELS[urgency as keyof typeof URGENCY_LABELS] ?? urgency}</Text>
        </View>

        <Text style={styles.sectionTitle}>Price breakdown</Text>
        <View style={styles.table}>
          <View style={styles.lineRow}>
            <Text style={styles.lineLabel}>Base price</Text>
            <Text style={styles.lineValue}>{money(breakdown.basePrice)}</Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.lineLabel}>Weight charge</Text>
            <Text style={styles.lineValue}>{money(breakdown.weightCost)}</Text>
          </View>
          {breakdown.distanceCost > 0 && (
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Distance charge</Text>
              <Text style={styles.lineValue}>{money(breakdown.distanceCost)}</Text>
            </View>
          )}
          <View style={styles.lineRow}>
            <Text style={styles.lineLabel}>Volume charge</Text>
            <Text style={styles.lineValue}>{money(breakdown.volumeCost)}</Text>
          </View>
          {breakdown.coldChainFee > 0 && (
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Cold-chain handling</Text>
              <Text style={styles.lineValue}>{money(breakdown.coldChainFee)}</Text>
            </View>
          )}
          {breakdown.containerHandlingFee > 0 && (
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Container handling</Text>
              <Text style={styles.lineValue}>{money(breakdown.containerHandlingFee)}</Text>
            </View>
          )}
          {breakdown.crossBorderFee > 0 && (
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Cross-border clearance</Text>
              <Text style={styles.lineValue}>{money(breakdown.crossBorderFee)}</Text>
            </View>
          )}
          {breakdown.urgencySurcharge > 0 && (
            <View style={styles.lineRow}>
              <Text style={styles.lineLabel}>Urgency surcharge ({breakdown.urgencyPct}%)</Text>
              <Text style={styles.lineValue}>{money(breakdown.urgencySurcharge)}</Text>
            </View>
          )}
          <View style={styles.lineRow}>
            <Text style={styles.lineLabel}>
              {breakdown.taxPct > 0 ? `VAT (${breakdown.taxPct}%)` : "VAT (zero-rated, cross-border)"}
            </Text>
            <Text style={styles.lineValue}>{money(breakdown.tax)}</Text>
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{money(breakdown.total)}</Text>
        </View>

        <Text style={styles.footer}>
          This quotation is valid for 7 days from the date above and is based on the shipment
          details provided. Final pricing may be adjusted if actual weight, volume, or route
          differs materially from what was declared. MA Logistics · Windhoek · Gaborone ·
          Johannesburg · Maputo.
        </Text>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
