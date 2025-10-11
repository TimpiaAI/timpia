"use client"; 

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBadge, CheckCircle, Mail, ExternalLink, Info, Building } from "lucide-react"; 
import React, { useEffect, useState } from 'react'; 
import Link from "next/link";
// Metadata is now handled by the parent layout (app/layout.tsx)


// Animation variants (similar to other policy pages)
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
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

const headerVariants = {
   hidden: { opacity: 0, y: -30, filter: "blur(4px)" },
   visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } }
};

const cardHeaderIconVariants = {
    hidden: { scale: 0, rotate: -60, opacity: 0 },
    visible: { scale: 1, rotate: 0, opacity: 1, transition: { delay: 0.3, type: 'spring', stiffness: 180, damping: 12 } }
};

function useCurrentDate(locale: string, options: Intl.DateTimeFormatOptions) {
    const [date, setDate] = useState('');
    useEffect(() => {
        setDate(new Date().toLocaleDateString(locale, options));
    }, [locale, options]);
    return date;
}

export default function GDPRPage() {
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
            <h1 className="mb-3">Politică de Conformitate GDPR</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Angajamentul nostru față de protecția datelor tale pe platforma TIMPIA S.R.L.
            </p>
        </motion.div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
             <Card className="max-w-4xl mx-auto shadow-xl border border-border/30 overflow-hidden bg-card/95 backdrop-blur-lg rounded-xl">
                <CardHeader className="flex-row items-center gap-4 p-6 bg-gradient-to-b from-muted/50 to-transparent border-b border-border/20">
                  <motion.div variants={cardHeaderIconVariants}>
                      <FileBadge className="h-7 w-7 text-primary" />
                  </motion.div>
                  <CardTitle as="h2" className="text-2xl">Conformitate TIMPIA S.R.L. GDPR</CardTitle>
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
                         Această Politică de Conformitate are scopul de a informa utilizatorii website-ului https://timpia.ro („Website-ul”) cu privire la măsurile luate de TIMPIA S.R.L. pentru a respecta cerințele Regulamentului (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal („GDPR”).
                    </motion.p>

                    <motion.section variants={itemVariants} aria-labelledby="operator-date">
                        <h2 id="operator-date">1. Operator de date</h2>
                        <p>
                           Operatorul de date cu caracter personal este societatea **TIMPIA S.R.L.**, persoană juridică română, cu sediul social în Mun. Brașov, Str. Zizinului, nr. 6, bl. 40, sc. A, et. 5, ap. 15, județul Brașov, înregistrată la Registrul Comerțului sub nr. J20/2504/2024, având Cod Unic de Înregistrare 52050273.
                        </p>
                        <p>
                            Pentru orice solicitare legată de datele tale personale, ne poți contacta la: <Mail className="inline-block h-4 w-4 mr-1 align-middle"/> <a href="mailto:contact@timpia.ro" className="text-primary hover:underline font-medium">contact@timpia.ro</a>
                         </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="tipuri-date-prelucrate">
                        <h2 id="tipuri-date-prelucrate">2. Tipuri de date prelucrate</h2>
                        <p>Prelucrăm următoarele categorii de date:</p>
                         <ul className="list-disc space-y-2 pl-6">
                             <li><strong>Date de identificare:</strong> nume, prenume, email, telefon (dacă le trimiți voluntar prin formulare).</li>
                             <li><strong>Date tehnice:</strong> adresă IP (anonimizată parțial), locație aproximativă, tip dispozitiv, browser.</li>
                            <li><strong>Date de utilizare:</strong> interacțiuni pe Website (pagini vizitate, clicuri, durata sesiunii), preferințe (ex: tema dark/light).</li>
                         </ul>
                     </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="scop-temei-legal">
                         <h2 id="scop-temei-legal">3. Scopul și temeiul legal al prelucrării</h2>
                         <p><strong>Scopuri:</strong></p>
                         <ul className="list-disc space-y-2 pl-6">
                             <li>Comunicarea cu utilizatorii care ne contactează.</li>
                             <li>Răspuns la solicitări (ex: cereri de ofertă, demo).</li>
                             <li>Oferirea de acces la demo-uri sau servicii personalizate.</li>
                             <li>Analiză internă (anonimizată) pentru optimizarea experienței pe site.</li>
                         </ul>
                         <p className="mt-4"><strong>Temeiuri legale:</strong></p>
                         <ul className="list-disc space-y-2 pl-6">
                            <li><strong>Consimțământul utilizatorului</strong> (art. 6 alin. 1 lit. a din GDPR) - pentru cookie-uri non-esențiale și comunicări de marketing (dacă este cazul).</li>
                             <li><strong>Interesul legitim al operatorului</strong> (art. 6 alin. 1 lit. f) - pentru a răspunde la solicitări, a îmbunătăți serviciile și a asigura securitatea site-ului.</li>
                             <li><strong>Executarea unei cereri pre-contractuale</strong> (art. 6 alin. 1 lit. b) - când ne contactezi pentru o ofertă sau demo.</li>
                         </ul>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="stocare-securitate">
                        <h2 id="stocare-securitate">4. Stocarea și securitatea datelor</h2>
                        <p>Datele sunt stocate:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Pe servere securizate (în UE sau în țări cu nivel adecvat de protecție conform GDPR, ex: SUA sub Data Privacy Framework).</li>
                           <li>Folosim furnizori care respectă standardele GDPR (ex: Vercel, Google Cloud, Notion).</li>
                           <li>Accesul la date este limitat și protejat prin autentificare și măsuri de securitate adecvate.</li>
                        </ul>
                         <p>Implementăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele împotriva accesului neautorizat, pierderii sau alterării.</p>
                     </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="durata-pastrare">
                        <h2 id="durata-pastrare">5. Durata de păstrare</h2>
                        <p>Datele sunt păstrate doar cât este necesar pentru scopurile menționate:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Pe durata necesară răspunderii la solicitări și comunicării.</li>
                            <li>Maximum 12 luni de la ultima interacțiune relevantă, dacă nu se stabilește o relație contractuală.</li>
                            <li>Datele din cookie-uri analitice sunt păstrate conform politicilor Google Analytics (de obicei agregate și anonimizate).</li>
                         </ul>
                         <p>Poți solicita oricând ștergerea datelor tale personale, conform drepturilor tale.</p>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="drepturi-utilizator-gdpr">
                        <h2 id="drepturi-utilizator-gdpr">6. Drepturile tale conform GDPR</h2>
                         <p>Conform Regulamentului (UE) 2016/679, ai următoarele drepturi cu privire la datele tale personale:</p>
                        <motion.ul
                           className="space-y-3"
                           variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                           initial="hidden"
                           whileInView="visible"
                           viewport={{ once: true, amount: 0.3 }}
                           >
                           <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul de acces:</strong> Poți cere informații despre datele tale pe care le prelucrăm.
                            </motion.li>
                            <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul la rectificare:</strong> Poți cere corectarea datelor inexacte.
                             </motion.li>
                             <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul la ștergere („dreptul de a fi uitat”):</strong> Poți cere ștergerea datelor în anumite condiții.
                             </motion.li>
                              <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul la restricționarea prelucrării:</strong> Poți cere limitarea modului în care prelucrăm datele.
                             </motion.li>
                              <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul la portabilitate:</strong> Poți cere transmiterea datelor tale către alt operator (unde este aplicabil).
                             </motion.li>
                              <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul de opoziție:</strong> Te poți opune prelucrării bazate pe interes legitim.
                             </motion.li>
                              <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul de a retrage consimțământul:</strong> O poți face oricând pentru prelucrările bazate pe consimțământ.
                             </motion.li>
                             <motion.li variants={listItemVariants} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0"/> <strong>Dreptul de a depune o plângere:</strong> La Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (<a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium ml-1">ANSPDCP <ExternalLink className="inline h-3 w-3 ml-0.5"/></a>).
                            </motion.li>
                        </motion.ul>
                         <p className="mt-4">
                            Pentru exercitarea drepturilor tale, contactează-ne la adresa de email menționată la final.
                        </p>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="transmitere-date-terti">
                        <h2 id="transmitere-date-terti">7. Transmiterea datelor către terți</h2>
                         <p>
                             Datele tale <strong className="text-primary">NU sunt vândute</strong> sau închiriate către terți. Putem partaja date cu furnizori de servicii (împuterniciți) care ne ajută să operăm Website-ul (ex: hosting Vercel, analiză Google Analytics, procesare plăți Stripe - dacă e cazul), dar aceștia sunt obligați contractual să respecte confidențialitatea și securitatea datelor conform GDPR.
                         </p>
                         <p>
                             Transferurile internaționale (dacă au loc, ex: către SUA) se fac doar către entități care asigură un nivel adecvat de protecție, conform deciziilor Comisiei Europene sau prin Clauze Contractuale Standard.
                         </p>
                     </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="cookies-gdpr">
                        <h2 id="cookies-gdpr">8. Cookie-uri și tehnologii similare</h2>
                         <p>
                             Website-ul utilizează cookie-uri strict necesare pentru funcționalitate și cookie-uri de analiză (Google Analytics) cu consimțământul tău. La prima accesare, ți se va cere acordul printr-un banner. Vezi pagina noastră <Link href="/cookies" className="text-primary hover:underline font-medium">Politica Cookies</Link> pentru detalii complete despre cookie-urile folosite și cum le poți gestiona.
                         </p>
                     </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="modificari-gdpr">
                        <h2 id="modificari-gdpr">9. Modificări</h2>
                        <p>
                            Ne rezervăm dreptul de a modifica această Politică de Conformitate GDPR. Versiunile actualizate vor fi publicate pe Website, iar data ultimei actualizări va fi revizuită. Te încurajăm să consulți periodic această pagină.
                        </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="contact-gdpr">
                         <h2 id="contact-gdpr">Contact</h2>
                        <p>
                            Pentru orice întrebări, solicitări privind datele tale personale sau conformitatea cu GDPR, te rugăm să ne scrii la: <Mail className="inline-block h-4 w-4 mr-1 align-middle"/> <a href="mailto:contact@timpia.ro" className="text-primary hover:underline font-medium">contact@timpia.ro</a>
                         </p>
                     </motion.section>

                </CardContent>
            </Card>
        </motion.div>
    </div>
  );
}
