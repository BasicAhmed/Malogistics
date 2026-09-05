import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main>
      <Nav />
      <section className="px-6 md:px-10 py-24 bg-cargo-maroon text-paper min-h-[50vh] flex items-center">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-mono text-signal-amber text-sm mb-4">404</p>
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            This page took a wrong turn.
          </h1>
          <p className="text-fog mb-8">
            The page you're looking for doesn't exist — but here's where you probably meant to go.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="bg-signal-amber text-cargo-maroon font-semibold px-6 py-3 rounded">
              Go home
            </Link>
            <Link href="/track" className="border border-fog px-6 py-3 rounded">
              Track a shipment
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
