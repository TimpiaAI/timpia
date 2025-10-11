"use client"; 

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building } from "lucide-react"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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


export default function TermeniSiConditiiPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState('');

  useEffect(() => {
    setLastUpdatedDate(new Date().toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);


  return (
    <div className="container py-16 md:py-24">
        <motion.div
           variants={headerVariants}
           initial="hidden"
           animate="visible"
           className="text-center mb-12 md:mb-16"
        >
             <h1 className="mb-3">Termeni și Condiții de Utilizare</h1>
             <p className="text-lg text-muted-foreground">Regulile de utilizare a platformei TIMPIA S.R.L.</p>
        </motion.div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
         >
            <Card className="max-w-4xl mx-auto shadow-xl border border-border/30 overflow-hidden bg-card/95 backdrop-blur-lg rounded-xl">
                <CardHeader className="flex-row items-center gap-4 p-6 bg-gradient-to-b from-muted/50 to-transparent border-b border-border/20">
                  <motion.div variants={cardHeaderIconVariants}>
                      <FileText className="h-7 w-7 text-primary" />
                  </motion.div>
                  <CardTitle as="h2" className="text-2xl">TIMPIA S.R.L. - Termeni</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg dark:prose-invert max-w-none space-y-6 px-6 py-8 md:px-8 md:py-10">
                    {lastUpdatedDate ? (
                        <motion.p variants={itemVariants} className="text-muted-foreground text-sm !mt-0">
                            Ultima actualizare: {lastUpdatedDate}
                        </motion.p>
                    ) : (
                         <motion.p variants={itemVariants} className="text-muted-foreground text-sm !mt-0 h-5 w-48 bg-muted rounded animate-pulse"></motion.p>
                    )}

                     <motion.section variants={itemVariants} aria-labelledby="introducere">
                        <h2 id="introducere">1. Introducere și Date Companie</h2>
                         <p>
                            Prezentul document stabilește termenii și condițiile de utilizare a website-ului https://timpia.ro („Website-ul”), operat de **TIMPIA S.R.L.**, persoană juridică română, cu sediul social în Mun. Brașov, Str. Zizinului, nr. 6, bl. 40, sc. A, et. 5, ap. 15, județul Brașov, înregistrată la Registrul Comerțului sub nr. J20/2504/2024, având Cod Unic de Înregistrare 52050273.
                        </p>
                        <p>Prin accesarea și utilizarea Website-ului, utilizatorul („Utilizatorul”) acceptă în mod expres și necondiționat acești Termeni și Condiții.</p>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="descriere-platforma">
                        <h2 id="descriere-platforma">2. Descrierea Platformei</h2>
                        <p>
                           TIMPIA S.R.L. este o companie care oferă soluții de inteligență artificială precum:
                       </p>
                        <ul className="list-disc space-y-2 pl-6">
                           <li>Chatbot-uri bazate pe documente proprii (RAG – Retrieval-Augmented Generation)</li>
                           <li>Voice Agents demo</li>
                           <li>Automatizări simple sau playbook-uri AI</li>
                       </ul>
                        <p>
                           Scopul Website-ului este de a prezenta aceste soluții și de a facilita interacțiuni și testări de tip „proof of concept”.
                       </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="proprietate-intelectuala">
                       <h2 id="proprietate-intelectuala">3. Drepturi de Proprietate Intelectuală</h2>
                        <p>
                           Toate elementele disponibile pe Website (texte, cod, design, logo, ilustrații, demo-uri) sunt proprietatea exclusivă a TIMPIA S.R.L. sau sunt folosite cu licență legală.
                       </p>
                       <p>Utilizatorilor nu le este permis:</p>
                       <ul className="list-disc space-y-2 pl-6">
                            <li>să copieze, distribuie sau modifice conținutul fără acord prealabil;</li>
                           <li>să folosească demo-urile AI în scopuri comerciale fără permisiune scrisă.</li>
                       </ul>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="design-implementare">
                        <h2 id="design-implementare">4. Design și Implementare Tehnică</h2>
                        <p>
                            Designul vizual al chatbot-ului (fereastra de chat, culori, logo) este discutat și <strong>personalizat</strong> pentru a se alinia cu identitatea de brand a fiecărui client.
                        </p>
                        <p>Oferim două metode principale de implementare:</p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><strong>Implementare directă în frontend:</strong> Codul chatbot-ului este integrat direct în codul sursă al website-ului clientului, pentru performanță și control maxim.</li>
                            <li><strong>Tag script:</strong> O metodă simplă, care implică adăugarea unui tag `&lt;script&gt;` în website. Acest script încarcă un fișier `loader.js` care afișează chatbot-ul dintr-un `index.html` găzduit pe serverele securizate TIMPIA S.R.L.</li>
                        </ul>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="contract-plata">
                        <h2 id="contract-plata">5. Contract, Plată și Facturare</h2>
                        <p>
                            Orice colaborare comercială va fi guvernată de un <strong>contract de prestare servicii</strong>, care va fi semnat de ambele părți înainte de începerea implementării și efectuarea oricărei plăți.
                        </p>
                        <p>
                            Plățile se vor efectua prin platforma securizată <strong>Stripe</strong>, conform termenelor stabilite în contract. Facturile fiscale corespunzătoare vor fi emise și transmise clientului prin sistemul național <strong>e-Factura</strong>.
                        </p>
                     </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="perioada-testare">
                       <h2 id="perioada-testare">6. Perioadă de Testare</h2>
                       <p>
                            TIMPIA S.R.L. poate oferi acces gratuit (trial) la unele funcționalități. Acestea nu implică nicio obligație comercială din partea utilizatorului.
                       </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="limitare-raspundere">
                       <h2 id="limitare-raspundere">7. Limitarea Răspunderii și Acuratețe</h2>
                       <p>
                           Website-ul și demo-urile sunt oferite „ca atare”. Nu garantăm funcționalitatea neîntreruptă sau fără erori. Deși depunem toate eforturile pentru a asigura acuratețea, chatbot-ul poate prezenta erori minime.
                       </p>
                       <p>TIMPIA S.R.L. nu își asumă răspunderea pentru:</p>
                        <ul className="list-disc space-y-2 pl-6">
                           <li>eventuale daune rezultate din utilizarea demo-urilor AI;</li>
                           <li>pierderi financiare, decizii greșite sau interpretări eronate bazate pe conținutul generat automat.</li>
                        </ul>
                    </motion.section>
                    
                    <motion.section variants={itemVariants} aria-labelledby="securitate-date-client">
                        <h2 id="securitate-date-client">8. Confidențialitatea și Securitatea Datelor</h2>
                        <p>
                            Fișierele și informațiile furnizate de client (documente, baze de date etc.) sunt utilizate <strong>exclusiv pentru antrenarea și funcționarea chatbot-ului</strong> dedicat companiei respective.
                        </p>
                        <p>
                            Ne angajăm să protejăm aceste date. Folosim baze de date vectoriale securizate, precum cele oferite de <strong>Pinecone</strong>, care asigură stocarea criptată și izolarea datelor. Aceste informații nu sunt partajate cu terți și nu sunt folosite pentru antrenarea altor modele AI. Pentru detalii complete, consultați <Link href="/politica-confidentialitate" className="text-primary hover:underline">Politica de Confidențialitate</Link>.
                        </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="modificari-termeni">
                        <h2 id="modificari-termeni">9. Modificări</h2>
                        <p>
                            Ne rezervăm dreptul de a modifica în orice moment conținutul Website-ului, funcționalitățile sau acești Termeni și Condiții. Versiunea actualizată va fi afișată public, iar utilizarea în continuare a site-ului implică acceptarea automată a noilor termeni.
                       </p>
                    </motion.section>

                    <motion.section variants={itemVariants} aria-labelledby="lege-aplicabila">
                       <h2 id="lege-aplicabila">10. Legea Aplicabilă</h2>
                       <p>
                           Acești termeni sunt guvernați de legislația din România. Orice dispută va fi soluționată pe cale amiabilă, iar în lipsa unei rezolvări, va fi de competența instanțelor din București.
                       </p>
                    </motion.section>

                     <motion.section variants={itemVariants} aria-labelledby="contact-termeni">
                        <h2 id="contact-termeni">11. Contact</h2>
                        <p>
                           Pentru întrebări sau cereri, ne poți scrie la:<br />
                            📧 <a href="mailto:contact@timpia.ro" className="text-primary hover:underline">contact@timpia.ro</a><br />
                            🌐 <a href="https://timpia.ro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://timpia.ro</a>
                        </p>
                    </motion.section>
                </CardContent>
             </Card>
         </motion.div>
    </div>
  );
}
