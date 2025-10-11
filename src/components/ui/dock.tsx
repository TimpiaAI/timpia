'use client';

import {
  motion,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface DockProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (id: string) => void;
}


function Dock({ tabs, activeTab, setActiveTab }: DockProps) {

  return (
    <div className='flex w-full justify-center'>
        <div className="flex items-center space-x-2 p-1.5 rounded-xl bg-muted/70 border border-border/50 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative text-sm font-medium px-4 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-36",
                  activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-dock-pill"
                    className="absolute inset-0 bg-primary rounded-lg z-0"
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                </span>
              </button>
            ))}
        </div>
    </div>
  );
}


export { Dock };
