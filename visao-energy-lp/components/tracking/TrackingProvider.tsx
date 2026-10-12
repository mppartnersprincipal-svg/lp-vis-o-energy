"use client";

import Script from "next/script";
import { GTM_ID } from "@/lib/tracking";
import { UTMCapture } from "./UTMCapture";
import { useClickTracking, useScrollDepthTracking, useSectionViewTracking } from "./TrackingEvents";

/**
 * GTM + eventos padrão MP Assessoria. GA4, Meta Pixel e Google Ads são
 * configurados como tags dentro do container GTM (nunca hardcoded aqui).
 */
export function TrackingProvider() {
  useClickTracking();
  useScrollDepthTracking();
  useSectionViewTracking();

  return (
    <>
      <UTMCapture />
      {/* Coletor first-party do /dashboard (anônimo, independente do GTM) */}
      <Script src="/js/tracker.js" strategy="afterInteractive" />
      {GTM_ID && (
        <Script id="gtm" strategy="lazyOnload">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
    </>
  );
}
