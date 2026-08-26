import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Coverage from "@/components/Coverage";
import Proof from "@/components/Proof";
import EnquirySection from "@/components/EnquirySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Journey />
      <Services />
      <WhyUs />
      <Coverage />
      <Proof />
      <EnquirySection />
      <Footer />
    </main>
  );
}
