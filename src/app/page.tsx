import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Benefits from "@/components/benefits";
import Services from "@/components/services";
import Reviews from "@/components/reviews";
import FAQ from "@/components/faq";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Benefits />
      <Services />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
