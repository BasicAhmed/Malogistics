import EnquiryForm from "./EnquiryForm";

export default function EnquirySection() {
  return (
    <section id="enquiry" className="px-6 md:px-10 py-20 bg-fog/40">
      <div className="max-w-2xl mx-auto">
        <p className="uppercase tracking-widest text-signal-amber text-xs font-mono mb-3 text-center">
          Tell us what you need to move
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-cargo-maroon mb-10 text-center">
          Get a route plan, not a form receipt.
        </h2>
        <EnquiryForm />
      </div>
    </section>
  );
}
