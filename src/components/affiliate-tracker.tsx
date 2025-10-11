// src/components/affiliate-tracker.tsx
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function AffiliateTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const affiliateCodeMatch = pathname.match(/^\/c\/([a-zA-Z0-9]+)/);
        
        if (affiliateCodeMatch) {
            const affiliateCode = affiliateCodeMatch[1];
            
            // 1. Set a cookie to track the affiliate
            setCookie('affiliateCode', affiliateCode, 30); // Cookie expires in 30 days

            // 2. Post to the webhook
            const webhookUrl = 'https://n8n-mui5.onrender.com/webhook/4ffeb22e-9280-4743-a136-4eedc276c8e3';
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    affiliateCode: affiliateCode,
                    event: 'link_visit',
                    timestamp: new Date().toISOString(),
                    visitedUrl: window.location.href,
                }),
            }).catch(error => {
                console.error('Failed to send affiliate tracking data to webhook:', error);
            });
            
            // 3. Redirect to the homepage to hide the affiliate code from the URL
            window.history.replaceState({}, document.title, "/");
        }
    }, [pathname]);

    // This component does not render anything
    return null;
}
