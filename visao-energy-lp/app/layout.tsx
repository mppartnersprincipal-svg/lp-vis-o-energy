import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AnchorGuard } from "@/components/motion/AnchorGuard";
import { TrackingProvider } from "@/components/tracking/TrackingProvider";
import { SITE_URL } from "@/lib/constants";
import { GTM_ID } from "@/lib/tracking";
import "./globals.css";

// Sem preload: no 4G as fontes disputavam banda com o CSS (único recurso que bloqueia a 1ª pintura).
// display: swap + fallback ajustado pelo next/font = texto visível na hora, sem salto de layout.
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], display: "swap", preload: false });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap", preload: false });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["500"], display: "swap", preload: false });

const TITULO = "Energia Solar em Goiânia | Economize até 95% na Conta de Luz | Visão Solar";
const DESCRICAO =
  "Projeto, instalação e monitoramento de energia solar em Goiânia, Aparecida, Anápolis e Caldas Novas. +1.000 usinas instaladas, 12 anos de garantia e financiamento com 90 dias de carência.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Visão Solar",
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRICAO },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${manrope.variable} ${jetbrains.variable} antialiased`}>
      <body>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-sol-500 focus:px-5 focus:py-3 focus:font-bold focus:text-noite-950">
          Pular para o conteúdo
        </a>
        <AnchorGuard />
        <SmoothScroll />
        <TrackingProvider />
        {children}
      </body>
    </html>
  );
}
