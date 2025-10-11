"use client";

import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'timpia-analytics-consent';

type ConsentState = 'granted' | 'denied' | null;

export default function AnalyticsConsentManager() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'granted' || stored === 'denied') {
        setConsent(stored);
        setBannerVisible(false);
      } else {
        setBannerVisible(true);
      }
    } catch {
      setBannerVisible(true);
    }
  }, []);

  const handleConsent = (next: Exclude<ConsentState, null>) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
    setConsent(next);
    setBannerVisible(false);
  };

  const manageButton = useMemo(() => {
    if (consent === null) {
      return null;
    }
    return (
      <button
        type="button"
        className="fixed bottom-4 right-4 z-[60] rounded-full border border-primary/50 bg-foreground/90 px-4 py-2 text-xs font-semibold text-background shadow-lg backdrop-blur transition hover:bg-primary hover:text-background"
        onClick={() => setBannerVisible((visible) => !visible)}
        aria-label="Gestionează preferințele de tracking"
      >
        Preferințe tracking
      </button>
    );
  }, [consent]);

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script id="tiktok-pixel" strategy="lazyOnload">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('D1N8BNBC77UD8FVUSNLG');ttq.page();}(window, document, 'ttq');
            `}
          </Script>
          <Script id="meta-pixel-init" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1099504865002091');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1099504865002091&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
        </>
      )}

      {manageButton}

      {bannerVisible && (
        <div className="fixed bottom-4 left-0 right-0 z-[70] px-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-foreground/95 p-6 shadow-2xl backdrop-blur text-background">
            <h2 className="text-base font-semibold text-background">Permiți cookie-uri de analiză?</h2>
            <p className="mt-2 text-sm text-background/80">
              Folosim TikTok Pixel și Meta Pixel pentru a îmbunătăți experiența și a înțelege performanța
              campaniilor. Poți schimba alegerea ta oricând din butonul „Preferințe tracking”.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" onClick={() => handleConsent('granted')} className="bg-primary text-background hover:bg-primary/90">
                Accept analytics
              </Button>
              <Button type="button" variant="outline" onClick={() => handleConsent('denied')} className="border-background/60 text-background hover:bg-background/10">
                Refuz
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
