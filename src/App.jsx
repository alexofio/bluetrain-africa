import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClientTicker from "./components/ClientTicker";
import Results from "./components/Results";
import WhereWeWork from "./components/WhereWeWork";
import Services from "./components/Services";
import Work from "./components/Work";
import ClientWall from "./components/ClientWall";
import Testimonial from "./components/Testimonial";
import InformedTeaser from "./components/informed/InformedTeaser";
import InformedIndex from "./components/informed/InformedIndex";
import InformedPost from "./components/informed/InformedPost";
import Contact from "./components/Contact";
import Booking from "./components/Booking";
import Footer from "./components/Footer";
import StickyCTA from "./components/StickyCTA";
import Ambient from "./components/ui/Ambient";
import Button from "./components/ui/Button";
import { useLang } from "./lib/i18n";
import { useRoute } from "./lib/router";

function NotFound() {
  const { t } = useLang();
  const n = t.ui.notFound;
  return (
    <section className="container-site flex min-h-[70vh] flex-col justify-center pb-24 pt-36">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-brand-bright">404</p>
      <h1 className="mt-4 max-w-[40rem] font-display text-display-lg font-bold text-white">{n.title}</h1>
      <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-silver/75">{n.body}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="#top">{n.home}</Button>
        <Button href="#/informed" variant="secondary">{t.ui.informed.readAll}</Button>
        <Button href="#contact" variant="secondary">{t.ui.footer.contact}</Button>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <ClientTicker />
      <Results />
      <WhereWeWork />
      <Services />
      <Work />
      <ClientWall />
      <Testimonial />
      <InformedTeaser />
      <Contact />
    </>
  );
}

export default function App() {
  const { t } = useLang();
  const route = useRoute();
  const page = route.name === "post" ? `post-${route.slug}` : route.name;

  // Page changes start at the top; #anchors (also when arriving from a blog page) land on their section
  useEffect(() => {
    if (route.name === "home" && route.anchor) {
      // the section may not exist until the page transition finishes, so poll briefly
      let tries = 0;
      const seek = () => {
        const el = document.getElementById(route.anchor);
        if (el) el.scrollIntoView();
        else if (tries++ < 40) setTimeout(seek, 25);
      };
      seek();
    } else if (route.name !== "home" || !route.anchor) {
      window.scrollTo(0, 0);
    }
    if (route.name === "home") document.title = t.meta.title;
    if (route.name === "book") document.title = `${t.ui.book.title} | Bluetrain Africa`;
    if (route.name === "notfound") document.title = `${t.ui.notFound.title} | Bluetrain Africa`;
    // GA4 (only when config.ga4Id is set): count each in-app page change
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: window.location.pathname, page_location: window.location.href, page_title: document.title });
    }
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Ambient />
      <div className="relative z-10">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-navy">
          {t.ui.skip}
        </a>
        <Navbar route={route} />
        <main id="main">
          {/* enter-only transition: swapping pages never waits on exit animations */}
          <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
              {route.name === "home" && <Home />}
              {route.name === "informed" && <InformedIndex />}
              {route.name === "post" && <InformedPost slug={route.slug} />}
              {route.name === "book" && <Booking preselect={route.with} />}
              {route.name === "notfound" && <NotFound />}
          </motion.div>
        </main>
        <Footer />
        {route.name === "home" && <StickyCTA />}
      </div>
    </>
  );
}
