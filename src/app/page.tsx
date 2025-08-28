import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Benefits from "@/components/benefits";
import Services from "@/components/services";
import Portfolio from "@/components/portfolio";
import Reviews from "@/components/reviews";
import FAQ from "@/components/faq";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Mascot from "@/components/mascot";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Benefits />
      <Services />
      <Portfolio />
      <Reviews />
      <Mascot />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
