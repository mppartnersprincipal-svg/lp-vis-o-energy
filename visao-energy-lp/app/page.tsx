import { LeadProvider } from "@/components/LeadContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { SolarHero } from "@/components/sections/SolarHero";
import { Marquee } from "@/components/sections/Marquee";
import { Stats } from "@/components/sections/Stats";
import { BillMeltdown } from "@/components/sections/BillMeltdown";
import { EconomySimulator } from "@/components/sections/EconomySimulator";
import { ProcessScrollVideo } from "@/components/sections/ProcessScrollVideo";
import { Financing } from "@/components/sections/Financing";
import { Gallery } from "@/components/sections/Gallery";
import { Guarantees } from "@/components/sections/Guarantees";
import { CoverageRadar } from "@/components/sections/CoverageRadar";
import { FAQ } from "@/components/sections/FAQ";
import { LeadSection } from "@/components/sections/LeadSection";
import { EMPRESA, SITE_URL, WHATSAPP_NUMBER } from "@/lib/constants";
import { FAQ as PERGUNTAS } from "@/lib/faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#empresa`,
      name: EMPRESA.nome,
      description: "Projeto, instalação e monitoramento de sistemas de energia solar fotovoltaica.",
      url: SITE_URL,
      image: `${SITE_URL}/images/obra-comercial.webp`,
      logo: `${SITE_URL}/images/logo-vs.png`,
      telephone: `+${WHATSAPP_NUMBER}`,
      address: { "@type": "PostalAddress", addressLocality: "Goiânia", addressRegion: "GO", addressCountry: "BR" },
      areaServed: EMPRESA.cidades.map((nome) => ({ "@type": "City", name: nome })),
      priceRange: "$$",
    },
    {
      "@type": "FAQPage",
      mainEntity: PERGUNTAS.map((f) => ({
        "@type": "Question",
        name: f.pergunta,
        acceptedAnswer: { "@type": "Answer", text: f.resposta },
      })),
    },
  ],
};

export default function Home() {
  return (
    <LeadProvider>
      <script
        type="application/ld+json"
        // Conteúdo estático controlado por nós; "<" escapado por segurança
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="conteudo">
        <SolarHero />
        <Marquee />
        <Stats />
        <BillMeltdown />
        <EconomySimulator />
        <ProcessScrollVideo />
        <Financing />
        <Gallery />
        <Guarantees />
        <CoverageRadar />
        <FAQ />
        <LeadSection />
      </main>
      <Footer />
      <FloatingActions />
    </LeadProvider>
  );
}
