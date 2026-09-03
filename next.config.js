/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfkit (used by @react-pdf/renderer) reads its standard font metrics
  // (Helvetica.afm etc.) from disk at runtime. Next's file tracing only
  // includes files it can see are imported in code, so these data files
  // get silently dropped from the serverless bundle unless listed here —
  // without this, PDF generation fails in production while working locally.
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./node_modules/pdfkit/js/**", "./node_modules/pdfkit/**/*.afm"],
    },
  },
};

module.exports = nextConfig;
