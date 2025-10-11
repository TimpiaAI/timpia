
"use client"; 

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Mail, CheckCircle, ExternalLink, Settings } from "lucide-react"; 
import React, { useEffect, useState } from 'react'; 
import type { Metadata } from 'next';

// Metadata for Server Components or for reference
// export const metadata: Metadata = {
//   title: 'Politică de Cookie-uri | Timpia AI',
//   description: 'Detalii despre cum Timpia AI utilizează cookie-uri pentru a îmbunătăți experiența ta pe website. Află ce cookie-uri folosim și cum le poți gestiona.',
// };


// --- Enhanced Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0, scale: 0.98 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 16, duration: 0.7 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20, filter: "blur(3px)" },
  visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeOut" } 
   },
};

const headerVariants = {
   hidden: { opacity: 0, y: -30, filter: "blur(4px)" },
   visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } }
};

const cardHeaderIconVariants = {
    hidden: { scale: 0, rotate: -90, opacity: 0 },
    visible: {
       scale: 1,
       rotate: 0,
       opacity: 1,
       transition: { delay: 0.4, type: 'spring', stiffness: 160, damping: 10 } 
   }
};

function useCurrentDate(locale: string, options: Intl.DateTimeFormatOptions) {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString(locale, options));
    }, [locale, options]); 

    return date;
}


export default function CookiesPage() {
    const lastUpdatedDate = useCurrentDate('ro-RO', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

  return (
    <div className="container py-16 md:py-24">
       <motion.div
           variants={headerVariants}
           initial="hidden"
           animate="visible"
           className="text-center mb-12 md:mb-16"
        >
             <h1 className="mb-3">Politică de Cookie-uri</h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Cum folosim cookie-uri pe Timpia AI.</p>
        </motion.div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
         >
              <motion.div
                 whileHover={{ scale: 1.01, boxShadow: "0 10px 20px -5px hsla(var(--primary)/0.15)" }}
                 transition={{ type: "spring", stiffness: 250, damping: 18 }}
              >
                 <Card className="max-w-4xl mx-auto shadow-xl border border-border/30 overflow-hidden bg-card/95 backdrop-blur-lg rounded-xl transition-shadow duration-300">
                     <CardHeader className="flex-row items-center gap-4 p-6 bg-gradient-to-b from-muted/50 to-transparent border-b border-border/20">
                         <motion.div variants={cardHeaderIconVariants}>
                             <Cookie className="h-7 w-7 text-primary" />
                         </motion.div>
                         <CardTitle as="h2" className="text-2xl">Timpia AI - Cookies</CardTitle>
                     </CardHeader>
                      <CardContent className="prose prose-lg dark:prose-invert max-w-none space-y-6 px-6 py-8 md:px-8 md:py-10">
                        {lastUpdatedDate ? (
                             <motion.p variants={itemVariants} className="text-muted-foreground text-sm !mt-0">
                                Ultima actualizare: {lastUpdatedDate}
                            </motion.p>
                        ): (
                             <motion.p variants={itemVariants} className="text-muted-foreground text-sm !mt-0 h-5 w-48 bg-muted rounded animate-pulse"></motion.p> 
                         )}
                         <motion.p variants={itemVariants}>
                             Această Politică de Cookie-uri explică modul în care website-ul https://timpia.ro („Website-ul”) utilizează cookie-uri și tehnologii similare pentru a îmbunătăți experiența utilizatorilor. Prin utilizarea acestui site, ești de acord cu utilizarea cookie-urilor, în conformitate cu această politică.
                         </motion.p>

                         <motion.section variants={itemVariants} aria-labelledby="ce-sunt-cookies">
                            <h2 id="ce-sunt-cookies">Ce sunt cookie-urile?</h2>
                            <p>
                                Cookie-urile sunt fișiere text mici care sunt stocate pe dispozitivul tău (calculator, telefon, tabletă) atunci când vizitezi un website. Ele permit recunoașterea dispozitivului tău și memorarea anumitor informații despre preferințele tale sau comportamentul de navigare.
                            </p>
                        </motion.section>

                         <motion.section variants={itemVariants} aria-labelledby="tipuri-cookies">
                            <h2 id="tipuri-cookies">Ce tipuri de cookie-uri folosim?</h2>
                             <motion.ul
                                className="list-none space-y-4 pl-0" 
                                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                                initial="hidden"
                                whileInView="visible" 
                                viewport={{ once: true, amount: 0.3 }}
                             >
                                 <motion.li variants={listItemVariants} className="flex items-start">
                                     <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-1 shrink-0"/>
                                     <div>
                                        <strong>a) Cookie-uri strict necesare:</strong> Acestea sunt esențiale pentru funcționarea corectă a site-ului și nu pot fi dezactivate în sistemele noastre. Ele sunt de obicei setate ca răspuns la acțiunile tale, cum ar fi completarea unui formular sau autentificarea.
                                     </div>
                                 </motion.li>
                                 <motion.li variants={listItemVariants} className="flex items-start">
                                     <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/>
                                     <div>
                                         <strong>b) Cookie-uri de performanță / analiză:</strong> Aceste cookie-uri ne permit să numărăm vizitele și sursele de trafic, astfel încât să putem îmbunătăți performanța site-ului. Folosim Google Analytics pentru a analiza comportamentul vizitatorilor în mod anonim.
                                     </div>
                                 </motion.li>
                                 <motion.li variants={listItemVariants} className="flex items-start">
                                     <CheckCircle className="h-5 w-5 text-purple-600 mr-3 mt-1 shrink-0"/>
                                     <div>
                                        <strong>c) Cookie-uri funcționale:</strong> Acestea permit site-ului să ofere funcționalități îmbunătățite și personalizate, cum ar fi reținerea preferințelor utilizatorului.
                                     </div>
                                 </motion.li>
                                  <motion.li variants={listItemVariants} className="flex items-start">
                                     <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-1 shrink-0"/> 
                                     <div>
                                         <strong>d) Cookie-uri de marketing (opțional):</strong> Aceste cookie-uri pot fi setate de servicii terțe (ex: YouTube, rețele sociale) pentru a urmări utilizatorii pe mai multe site-uri și pentru a afișa reclame relevante. <strong className="text-primary">Momentan nu folosim activ cookie-uri de marketing.</strong>
                                     </div>
                                 </motion.li>
                            </motion.ul>
                         </motion.section>

                          <motion.section variants={itemVariants} aria-labelledby="control-cookies">
                            <h2 id="control-cookies">Cum poți controla cookie-urile?</h2>
                             <p>La prima accesare a Website-ului, ți se va afișa un banner de consimțământ care îți permite:</p>
                             <ul className="list-disc space-y-2 pl-6">
                                <li>Să accepți toate cookie-urile</li>
                                <li>Să le personalizezi (activezi/dezactivezi după categorie)</li>
                                <li>Să le refuzi</li>
                             </ul>
                             <p className="mt-4">Poți, de asemenea, modifica setările cookie-urilor oricând din browserul tău:</p>
                             <ul className="list-disc space-y-2 pl-6 text-sm">
                                 <li><strong>Google Chrome:</strong> Setări → Confidențialitate și securitate → Cookie-uri</li>
                                 <li><strong>Firefox:</strong> Setări → Confidențialitate și securitate</li>
                                 <li><strong>Safari:</strong> Preferințe → Confidențialitate</li>
                                <li><strong>Microsoft Edge:</strong> Setări → Cookie-uri și permisiuni site</li>
                            </ul>
                              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1.5">
                                <Settings className="h-4 w-4"/> Link util pentru gestionare generală:
                                 <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center">
                                    www.allaboutcookies.org <ExternalLink className="inline h-3 w-3 ml-0.5"/>
                                </a>
                              </p>
                         </motion.section>

                          <motion.section variants={itemVariants} aria-labelledby="cookies-terte">
                             <h2 id="cookies-terte">Cookie-uri terțe</h2>
                             <p>
                                 Unele pagini pot include conținut de la servicii terțe (ex: videoclipuri YouTube, formulare embed) care pot seta propriile cookie-uri. Timpia AI nu controlează aceste cookie-uri și îți recomandăm să consulți politicile acelor terți.
                             </p>
                         </motion.section>

                          <motion.section variants={itemVariants} aria-labelledby="durata-cookies">
                            <h2 id="durata-cookies">Durata de viață a cookie-urilor</h2>
                            <p>Cookie-urile pot fi:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                 <li><strong>Cookie-uri de sesiune:</strong> sunt șterse automat când închizi browserul.</li>
                                 <li><strong>Cookie-uri persistente:</strong> rămân pe dispozitiv pentru o perioadă prestabilită sau până le ștergi manual.</li>
                            </ul>
                        </motion.section>

                        <motion.section variants={itemVariants} aria-labelledby="actualizari-politica-cookies">
                            <h2 id="actualizari-politica-cookies">Actualizări ale politicii</h2>
                             <p>
                                 Putem modifica această politică din când în când, pentru a reflecta schimbările în tehnologie sau legislație. Orice modificări vor fi publicate pe această pagină cu data actualizării.
                             </p>
                         </motion.section>

                        <motion.section variants={itemVariants} aria-labelledby="contact-cookies">
                            <h2 id="contact-cookies">Contact</h2>
                             <p>
                                 Pentru întrebări sau solicitări legate de cookie-uri, te rugăm să ne contactezi la:
                                 <br />
                                <Mail className="inline-block h-4 w-4 mr-1 align-middle"/> <a href="mailto:contact@timpia.ro" className="text-primary hover:underline font-medium">contact@timpia.ro</a>
                             </p>
                        </motion.section>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    </div>
  );
}
