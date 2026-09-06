import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Order } from "./types";
import { QuoteBreakdown, PricingConfig, CATEGORY_LABELS, URGENCY_LABELS } from "./pricing";

const COLORS = {
  maroon: "#3C0008",
  deckMaroon: "#5A0010",
  amber: "#E8A33D",
  fog: "#D8C9CC",
  steel: "#4A2A2E",
  paper: "#F4F1EC",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: COLORS.maroon, backgroundColor: COLORS.paper },

  // Header band
  header: {
    backgroundColor: COLORS.maroon,
    paddingTop: 36,
    paddingHorizontal: 40,
    paddingBottom: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  brandM: { color: COLORS.white, fontSize: 14, fontWeight: 700 },
  brandSlash: { color: COLORS.amber, fontSize: 14, fontWeight: 700 },
  brandName: { color: COLORS.white, fontSize: 14, fontWeight: 700, marginLeft: 4 },
  quoteTitle: { color: COLORS.white, fontSize: 34, fontWeight: 700, marginTop: 8, letterSpacing: 1 },
  headerAddress: { color: COLORS.fog, fontSize: 9, marginTop: 8, maxWidth: 260 },
  metaBlock: { alignItems: "flex-end" },
  metaLabel: { color: COLORS.amber, fontSize: 8, fontWeight: 700, letterSpacing: 1, marginTop: 8 },
  metaValue: { color: COLORS.white, fontSize: 10, marginTop: 2 },

  // White card overlapping header
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 24,
    marginTop: -32,
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.amber,
    paddingBottom: 8,
    marginBottom: 6,
  },
  tableHeaderText: { fontSize: 11, fontWeight: 700, color: COLORS.maroon },
  lineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.fog,
  },
  lineLabel: { fontSize: 10, fontWeight: 700, color: COLORS.maroon },
  lineValue: { fontSize: 10, color: COLORS.maroon },

  totalsBlock: { marginTop: 14, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 220, justifyContent: "space-between", marginBottom: 4 },
  totalsLabel: { fontSize: 9.5, fontWeight: 700, color: COLORS.amber },
  totalsValue: { fontSize: 9.5, color: COLORS.maroon },
  grandRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.fog,
  },
  grandLabel: { fontSize: 11, fontWeight: 700, color: COLORS.amber },
  grandValue: { fontSize: 13, fontWeight: 700, color: COLORS.maroon },

  // Bill to / shipment section
  infoSection: { flexDirection: "row", marginTop: 28, paddingHorizontal: 40, gap: 40 },
  infoCol: { flex: 1 },
  infoHeading: { color: COLORS.amber, fontSize: 10, fontWeight: 700, marginBottom: 8 },
  infoName: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  infoLine: { fontSize: 9.5, color: COLORS.steel, marginBottom: 3 },

  // Footer band
  footer: {
    backgroundColor: COLORS.amber,
    marginTop: 40,
    paddingHorizontal: 40,
    paddingVertical: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerNote: { fontSize: 9, color: COLORS.maroon, maxWidth: 260, lineHeight: 1.5 },
  footerBrand: { fontSize: 10, fontWeight: 700, color: COLORS.maroon, marginBottom: 4 },
  footerLine: { fontSize: 9, color: COLORS.maroon, marginBottom: 2 },
});

function money(n: number | undefined): string {
  const v = Number(n) || 0;
  return `R ${v.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

export async function generateQuotePdf(
  order: Order,
  breakdown: QuoteBreakdown,
  config: PricingConfig
): Promise<Buffer> {
  const inputs = (order.quoteInputs as any) || {};
  const category = inputs.category ?? "general";
  const urgency = inputs.urgency ?? "flexible";
  const sentDate = new Date(order.quoteSentAt || order.updatedAt);
  const validUntil = new Date(sentDate.getTime() + 7 * 86400000);
  const fmtDate = (d: Date) => d.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });

  const lineItems: { label: string; value: number }[] = [
    { label: "Base price", value: breakdown.basePrice },
    { label: "Weight charge", value: breakdown.weightCost },
  ];
  if (breakdown.distanceCost > 0) lineItems.push({ label: "Distance charge", value: breakdown.distanceCost });
  lineItems.push({ label: "Volume charge", value: breakdown.volumeCost });
  if (breakdown.coldChainFee > 0) lineItems.push({ label: "Cold-chain handling", value: breakdown.coldChainFee });
  if (breakdown.containerHandlingFee > 0)
    lineItems.push({ label: "Container handling", value: breakdown.containerHandlingFee });
  if (breakdown.crossBorderFee > 0)
    lineItems.push({ label: "Cross-border clearance", value: breakdown.crossBorderFee });
  if (breakdown.urgencySurcharge > 0)
    lineItems.push({ label: `Urgency surcharge (${breakdown.urgencyPct}%)`, value: breakdown.urgencySurcharge });

  const preTax = lineItems.reduce((s, l) => s + l.value, 0);

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandM}>M</Text>
              <Text style={styles.brandSlash}>/</Text>
              <Text style={styles.brandName}>MA Logistics</Text>
            </View>
            <Text style={styles.quoteTitle}>QUOTATION</Text>
            <Text style={styles.headerAddress}>
              5 Whitford Road, Germiston, Lambton{"\n"}Container transport, Southern Africa
            </Text>
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>REFERENCE</Text>
            <Text style={styles.metaValue}>{order.trackingNumber}</Text>
            <Text style={styles.metaLabel}>DATE</Text>
            <Text style={styles.metaValue}>{fmtDate(sentDate)}</Text>
            <Text style={styles.metaLabel}>VALID UNTIL</Text>
            <Text style={styles.metaValue}>{fmtDate(validUntil)}</Text>
          </View>
        </View>

        {/* White card: line items + totals */}
        <View style={styles.card}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderText}>Service Description</Text>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>

          {lineItems.map((item, i) => (
            <View style={styles.lineRow} key={i}>
              <Text style={styles.lineLabel}>{item.label}</Text>
              <Text style={styles.lineValue}>{money(item.value)}</Text>
            </View>
          ))}

          <View style={styles.totalsBlock}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{money(preTax)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>
                {breakdown.taxPct > 0 ? `VAT (${breakdown.taxPct}%)` : "VAT (zero-rated)"}
              </Text>
              <Text style={styles.totalsValue}>{money(breakdown.tax)}</Text>
            </View>
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total Amount Due</Text>
              <Text style={styles.grandValue}>{money(breakdown.total)}</Text>
            </View>
          </View>
        </View>

        {/* Bill To / Shipment */}
        <View style={styles.infoSection}>
          <View style={styles.infoCol}>
            <Text style={styles.infoHeading}>Bill To</Text>
            <Text style={styles.infoName}>{order.name}</Text>
            {order.company && <Text style={styles.infoLine}>{order.company}</Text>}
            <Text style={styles.infoLine}>{order.email}</Text>
            <Text style={styles.infoLine}>{order.phone}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoHeading}>Shipment</Text>
            <Text style={styles.infoLine}>Pickup: {order.origin || "—"}</Text>
            <Text style={styles.infoLine}>Delivery: {order.destination || "—"}</Text>
            <Text style={styles.infoLine}>
              {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}
              {inputs.weightKg ? ` · ${inputs.weightKg}kg` : ""}
              {inputs.volumeM3 ? ` · ${inputs.volumeM3}m3` : ""}
            </Text>
            <Text style={styles.infoLine}>{URGENCY_LABELS[urgency as keyof typeof URGENCY_LABELS] ?? urgency}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerNote}>
              This quotation is valid for 7 days from the date above. Final pricing may be
              adjusted if actual weight, volume, or route differs from what was declared.
            </Text>
            <Text style={{ fontSize: 7, color: COLORS.maroon, opacity: 0.5, marginTop: 8 }}>
              Site by Nino Techy
            </Text>
          </View>
          <View>
            <Text style={styles.footerBrand}>MA Logistics</Text>
            <Text style={styles.footerLine}>5 Whitford Road, Germiston, Lambton</Text>
            <Text style={styles.footerLine}>brand@malogisticsza.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
