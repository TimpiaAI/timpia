import { TrendingUp, PhoneOff, Zap, Lightbulb, Handshake, ShieldCheck, Clock, Users, Bot, FileText, BarChart, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ClientShowcaseItem {
  clientName: string;
  industry: string;
  imageSrc: string;
  imageHint: string;
  description: string;
  link?: string;
  results?: Array<{
    value: string;
    text: string;
    icon: LucideIcon;
    color: string;
  }>;
}

export const clientShowcaseData: ClientShowcaseItem[] = [
  {
    clientName: "Colegiul de Științe 'Grigore Antipa'",
    industry: "Educație & Administrație Publică",
    imageSrc: "https://www.youtube.com/embed/2trQdp_JFoM",
    imageHint: "science college chatbot",
    description: "Problemă: Secretariatul era copleșit de întrebări repetitive despre admitere. Soluție: Am implementat un asistent AI care oferă răspunsuri instant, 24/7, direct pe website, eliberând personalul pentru sarcini complexe.",
    link: "#",
    results: [
        {
            value: "-80%",
            text: "reducere a apelurilor și emailurilor repetitive",
            icon: PhoneOff,
            color: "text-emerald-500"
        },
        {
            value: "+45%",
            text: "creștere a satisfacției elevilor și părinților",
            icon: Users,
            color: "text-blue-500"
        },
        {
            value: "24/7",
            text: "disponibilitate a informațiilor despre admitere",
            icon: Clock,
            color: "text-indigo-500"
        },
        {
            value: "-15h",
            text: "economisite săptămânal de personalul secretariatului",
            icon: Zap,
            color: "text-amber-500"
        }
    ]
  },
  {
    clientName: "SNPad",
    industry: "Marketing & Publicitate",
    imageSrc: "https://i.imgur.com/jEqmb1G.png",
    imageHint: "advertising agency chatbot",
    description: "Problemă: Managementul campaniilor necesita suport constant, iar apelurile importante se pierdeau. Soluție: Am creat un ecosistem AI complet (Chatbot RAG, Agent Vocal, Outbound) care preia apelurile, oferă suport și califică lead-uri, totul integrat într-un dashboard centralizat.",
    link: "#",
    results: [
        {
            value: "+30%",
            text: "eficiență în managementul campaniilor",
            icon: Zap,
            color: "text-emerald-500"
        },
        {
            value: "100%",
            text: "preluare a apelurilor pierdute, inclusiv în afara orelor de program",
            icon: PhoneOff,
            color: "text-blue-500"
        },
         {
            value: "-90%",
            text: "reducere a timpului de răspuns pentru clienți",
            icon: Clock,
            color: "text-amber-500"
        },
        {
            value: "4k+",
            text: "mesaje de suport automatizate lunar",
            icon: Bot,
            color: "text-indigo-500"
        }
    ]
  },
];
