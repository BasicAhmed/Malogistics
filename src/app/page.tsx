import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Fleet from "@/components/Fleet";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Coverage from "@/components/Coverage";
import Proof from "@/components/Proof";
import EnquirySection from "@/components/EnquirySection";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "MA Logistics",
    description:
      "Freight forwarding across South Africa and the SADC corridor — road freight, cross-border logistics, sea and air freight.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5 Whitford Road, Lambton",
      addressLocality: "Germiston",
      addressRegion: "Gauteng",
      addressCountry: "ZA",
    },
    areaServed: ["South Africa", "Botswana", "Zimbabwe", "Zambia", "Mozambique"],
    url: "https://malogistics.vercel.app",
  };

  return (
    <main className="pb-16 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Journey />
      <Fleet />
      <Services />
      <WhyUs />
      <Coverage />
      <Proof />
      <EnquirySection />
      <Footer />
      <MobileCTA />
    </main>
  );
}
