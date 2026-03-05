import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Intro from '@/components/sections/Intro';
import Hero from '@/components/sections/Hero';
import Products from '@/components/sections/Products';
import About from '@/components/sections/About';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" role="main">
        <Intro />
        <Hero />
        <Products />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
