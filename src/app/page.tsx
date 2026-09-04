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
  return (
    <main className="pb-16 md:pb-0">
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
