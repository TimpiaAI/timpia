// src/components/site-footer.tsx

"use client"; 

import Link from "next/link";
import { Mail, Facebook, Linkedin, Instagram, Phone } from "lucide-react";
import Logo from '@/components/logo';
import { useLocale, useTranslations } from 'next-intl';

export default function SiteFooter() {
    const currentYear = new Date().getFullYear();
    const footerTranslations = useTranslations('layout.footer');
    const layoutTranslations = useTranslations('layout');
    const locale = useLocale();
    const basePath = `/${locale}`;

  const contactEmail = "contact@timpia.ro";
  const contactPhone = "0787 578 482";
  const contactPhoneHref = contactPhone.replace(/\s/g, '');

  return (
    <footer className="bg-background text-foreground border-t mt-auto">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="space-y-4 md:col-span-1">
           <Link href={basePath} className="flex items-center space-x-2">
             <Logo width={28} height={28} />
             <span className="font-bold text-xl">{layoutTranslations('brand')}</span>
          </Link>
          <p className="text-sm text-muted-foreground">
             {footerTranslations('description')}
          </p>
           <div className="flex space-x-3 pt-2">
             <a href="https://www.facebook.com/profile.php?id=61577792843081" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
               <Facebook className="h-5 w-5" />
             </a>
             <a href="https://www.instagram.com/timpia.ro/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
               <Instagram className="h-5 w-5" />
             </a>
             <a href="https://www.linkedin.com/in/pic%C4%83-ovidiu-%C8%99tefan-71138b365/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
               <Linkedin className="h-5 w-5" />
             </a>
             <a 
                href="https://www.tiktok.com/@timpia.ro" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                </svg>
             </a>
           </div>
        </div>

        <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">{footerTranslations('usefulLinks')}</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link href={`${basePath}#solutii-section`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('services')}</Link></li>
                <li><Link href={`${basePath}#team-section`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('team')}</Link></li>
                <li><Link href={`${basePath}#contact-section`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('contact')}</Link></li>
                <li><Link href={`${basePath}/blog`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('blog')}</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">{footerTranslations('legal')}</h3>
              <ul className="space-y-1.5 text-sm">
                 <li><Link href={`${basePath}/termeni-si-conditii`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('terms')}</Link></li>
                 <li><Link href={`${basePath}/politica-confidentialitate`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('privacy')}</Link></li>
                 <li><Link href={`${basePath}/gdpr`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('gdpr')}</Link></li>
                  <li><Link href={`${basePath}/cookies`} className="text-muted-foreground hover:text-primary transition-colors">{footerTranslations('cookies')}</Link></li>
              </ul>
            </div>
        </div>

         <div className="space-y-3 md:col-span-1">
           <h3 className="font-semibold mb-3">{footerTranslations('contactTitle')}</h3>
            <div className="flex items-start gap-2 text-sm mb-1.5">
               <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"/>
                <a href={`mailto:${contactEmail}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {contactEmail}
                </a>
            </div>
            <div className="flex items-start gap-2 text-sm mb-1.5">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"/>
                <a href={`tel:${contactPhoneHref}`} className="text-muted-foreground hover:text-primary transition-colors">
                  {contactPhone}
                </a>
            </div>
         </div>
      </div>

      <div className="border-t border-border/50">
         <div className="container py-4 text-center text-xs text-muted-foreground">
          {footerTranslations('copyright', { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
