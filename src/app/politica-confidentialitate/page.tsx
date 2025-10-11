"use client"; 

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Mail, Building } from "lucide-react"; 
import React, { useEffect, useState } from 'react'; 
import Link from "next/link";
// Metadata is now handled by the parent layout (app/layout.tsx)

// Animation variants
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

const headerVariants = {
   hidden: { opacity: 0, y: -30, filter: "blur(4px)" },
   visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } }
};

const cardHeaderIconVariants = {
    hidden: { scale: 0, rotate: -60, opacity:0 },
    visible: { scale: 1, rotate: 0, opacity:1, transition: { delay: 0.3, type: 'spring', stiffness: 180, damping: 12 } }
};

function useCurrentDate(locale: string, options: Intl.DateTimeFormatOptions) {
    const [date, setDate] = useState('');
    useEffect(() => {
        setDate(new Date().toLocaleDateString(locale, options));
    }, [locale, options]);
    return date;
}

export default function PoliticaConfidentialitatePage() {
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
             <h1 className="mb-3">Politică de Confidențialitate</h1>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Cum protejăm datele tale pe platforma TIMPIA S.R.L.</p>
        </motion.div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
         >
             <Card className="max-w-4xl mx-auto shadow-xl border border-border/30 overflow-hidden bg-card/95 backdrop-blur-lg rounded-xl">
                <CardHeader className="flex-row items-center gap-4 p-6 bg-gradient-to-b from-muted/50 to-transparent border-b border-border/20">
                  <motion.div variants={cardHeaderIconVariants}>
                      <ShieldCheck className="h-7 w-7 text-primary" />
                  </motion.div>
                  <CardTitle as="h2" className="text-2xl">Confidențialitate TIMPIA S.R.L.</CardTitle>
                </CardHeader>
                 <CardContent className="prose prose-lg dark:prose-invert max-w-none space-y-6 px-6 py-8 md:px-8 md:py-10">
                    {lastUpdatedDate ? (
                        <motion.p variants={itemVariants} className="text-muted-foreground text-sm !mt-0">
                            Ultima actualizare: {lastUpdatedDate}
                        </motion.p>
                    ) : (
                        <motion.p variants={itemVariants} className="text-muted-foreground text-sm !mt-0 h-5 w-48 bg-muted rounded animate-pulse"></motion.p>
                    )}

                     <motion.p variants={itemVariants}>
                        Această Politică de Confidențialitate explică modul în care **TIMPIA S.R.L.** (denumită în continuare „Compania”, „noi” sau „Timpia”), persoană juridică română, cu sediul social în Mun. Brașov, Str. Zizinului, nr. 6, bl. 40, sc. A, et. 5, ap. 15, județul Brașov, înregistrată la Registrul Comerțului sub nr. J20/2504/2024, având Cod Unic de Înregistrare 52050273, colectează, utilizează, stochează și protejează informațiile personale ale utilizatorilor care accesează website-ul https://timpia.ro („Website-ul”).
                    </motion.p>
                    <motion.p variants={itemVariants}>
                        Accesând și utilizând acest website, ești de acord cu practicile descrise în această politică.
                    </motion.p>

                     <motion.section variants={itemVariants} aria-labelledby="date-colectate">
                         <h2 id="date-colectate">1. Ce date colectăm</h2>
                         <p>Putem colecta următoarele tipuri de date:</p>
                         <ul className="list-disc space-y-2 pl-6">
                             <li><strong>Date de identificare:</strong> Nume, prenume, adresă de email, număr de telefon (dacă le trimiți prin formulare sau email)</li>
                             <li><strong>Date tehnice:</strong> Adresa IP, tipul dispozitivului, browserul, sistemul de operare, date despre sesiune</li>
                             <li><strong>Date comportamentale:</strong> Activitatea ta pe site (pagini vizitate, clicuri, durată)</li>
                             <li><strong>Alte date furnizate voluntar:</strong> Prin formulare de contact, cereri de ofertă sau înscriere în liste de email</li>
                         </ul>
                     </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="cum-colectam">
                         <h2 id="cum-colectam">2. Cum colectăm datele</h2>
                         <p>Datele sunt colectate prin:</p>
                         <ul className="list-disc space-y-2 pl-6">
                            <li>Completarea formularului de contact</li>
                            <li>Interacțiuni directe prin email</li>
                            <li>Tehnologii automate (ex: cookies, Google Analytics)</li>
                         </ul>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="scopuri-colectare">
                        <h2 id="scopuri-colectare">3. Scopurile colectării datelor</h2>
                         <p>Folosim datele tale pentru:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>A răspunde solicitărilor și întrebărilor tale</li>
                            <li>A îți oferi acces la demo-uri sau servicii personalizate</li>
                            <li>A îmbunătăți funcționalitatea site-ului și experiența de navigare</li>
                            <li>A realiza statistici anonime privind performanța site-ului</li>
                            <li>Comunicări legate de produse, noutăți sau actualizări (doar dacă ne-ai dat acordul)</li>
                        </ul>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="temei-legal">
                        <h2 id="temei-legal">4. Temeiul legal al prelucrării</h2>
                        <p>Prelucrăm datele tale personale în baza:</p>
                         <ul className="list-disc space-y-2 pl-6">
                            <li>Consimțământului tău explicit (ex: bifarea unui formular)</li>
                            <li>Interesului legitim de a îmbunătăți platforma</li>
                            <li>Obligației de a răspunde solicitărilor formulate de utilizatori</li>
                        </ul>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="transmitere-date">
                        <h2 id="transmitere-date">5. Cui transmitem datele</h2>
                        <p>
                            Datele tale <strong className="text-primary">NU sunt vândute</strong> și NU sunt partajate cu terți neautorizați.
                        </p>
                         <p>În unele cazuri, putem colabora cu furnizori de servicii precum:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Google (Analytics, reCAPTCHA)</li>
                            <li>Stripe (pentru plăți, dacă e cazul)</li>
                            <li>Email hosting (ex: Google Workspace)</li>
                        </ul>
                        <p>
                            Acești furnizori au obligația de a respecta standarde stricte de confidențialitate și protecție a datelor.
                        </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="perioada-stocare">
                        <h2 id="perioada-stocare">6. Perioada de stocare</h2>
                        <p>Datele sunt păstrate:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Pe durata comunicării cu tine</li>
                            <li>Sau maximum 12 luni de la ultima interacțiune, dacă nu se transformă într-o colaborare</li>
                        </ul>
                        <p>
                            Poți cere oricând ștergerea acestora.
                        </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="securitate-date">
                        <h2 id="securitate-date">7. Securitatea datelor</h2>
                        <p>
                            Luăm măsuri rezonabile de securitate pentru a proteja datele tale, inclusiv:
                        </p>
                         <ul className="list-disc space-y-2 pl-6">
                            <li>Acces limitat la date</li>
                            <li>Parole criptate (unde e cazul)</li>
                            <li>Servere securizate în spațiul UE sau SUA (cu măsuri conforme GDPR)</li>
                         </ul>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="drepturi-gdpr">
                        <h2 id="drepturi-gdpr">8. Drepturile tale</h2>
                         <p>Ai următoarele drepturi conform GDPR:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Dreptul de acces la datele tale</li>
                            <li>Dreptul la rectificare</li>
                            <li>Dreptul la ștergere („dreptul de a fi uitat”)</li>
                            <li>Dreptul la portabilitate</li>
                            <li>Dreptul de a depune o plângere la ANSPDCP (autoritatea română de protecție a datelor)</li>
                        </ul>
                         <p>
                            Pentru exercitarea oricăruia dintre aceste drepturi, scrie-ne la: <Mail className="inline-block h-4 w-4 mr-1 align-middle"/> <a href="mailto:contact@timpia.ro" className="text-primary hover:underline font-medium">contact@timpia.ro</a>
                        </p>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="cookies-info">
                        <h2 id="cookies-info">9. Cookie-uri</h2>
                        <p>
                            Website-ul poate utiliza cookie-uri proprii și ale terților (ex: Google Analytics) pentru:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Analiză de trafic (anonimizat)</li>
                            <li>Funcționalitate de bază (ex: reținere preferințe temă)</li>
                        </ul>
                         <p>
                            Poți modifica setările cookie din browser-ul tău oricând. Vezi pagina noastră <Link href="/cookies" className="text-primary hover:underline font-medium">Politica Cookies</Link> pentru mai multe detalii.
                        </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="modificari-politica">
                        <h2 id="modificari-politica">10. Modificări ale politicii</h2>
                         <p>
                            Ne rezervăm dreptul de a modifica această Politică de Confidențialitate oricând. Versiunea actualizată va fi afișată pe Website cu mențiunea „Ultima actualizare”. Utilizarea continuă a site-ului după modificări constituie acceptarea acestora.
                        </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="contact-info">
                        <h2 id="contact-info">11. Contact</h2>
                        <p>
                            Pentru orice întrebări legate de confidențialitate sau protecția datelor personale, ne poți contacta la:
                            <br />
                             <Mail className="inline-block h-4 w-4 mr-1 align-middle"/> <a href="mailto:contact@timpia.ro" className="text-primary hover:underline font-medium">contact@timpia.ro</a>
                         </p>
                     </motion.section>
                </CardContent>
             </Card>
         </motion.div>
    </div>
  );
}
