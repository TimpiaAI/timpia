"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose, 
  SheetTrigger
} from "@/components/ui/sheet"
import { Menu, X, ArrowRight, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Logo from '@/components/logo'; 

interface NavItem {
  title: string;
  href: string;
  className?: string;
}

interface MobileNavProps {
  navItems: NavItem[];
  onLinkClick?: (href: string) => void; 
}

export function MobileNav({ navItems, onLinkClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
       setIsOpen(false); 
       if (onLinkClick) {
           onLinkClick(href);
       } else if (href.startsWith('/#')) { 
            e.preventDefault();
            const sectionId = href.substring(href.indexOf('#') + 1);
            const targetElement = document.getElementById(sectionId);
            
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300); 
            }
       }
  };

   const sheetVariants = {
     hidden: (side: "left" | "right" | "top" | "bottom") => ({
      x: side === 'right' ? "100%" : side === 'left' ? "-100%" : 0,
      y: side === 'top' ? "-100%" : side === 'bottom' ? "100%" : 0,
      opacity: 0,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 30, duration: 0.4 }
    },
    exit: (side: "left" | "right" | "top" | "bottom") => ({
      x: side === 'right' ? "100%" : side === 'left' ? "-100%" : 0,
      y: side === 'top' ? "-100%" : side === 'bottom' ? "100%" : 0,
      opacity: 0,
      transition: { type: "tween", ease: "easeInOut", duration: 0.25 }
    })
   };

   const listVariants = {
     hidden: {},
     visible: {
       transition: { staggerChildren: 0.07, delayChildren: 0.15 }
     },
   };

   const itemVariants = {
     hidden: { opacity: 0, x: 20 },
     visible: {
       opacity: 1,
       x: 0,
       transition: { type: "spring", stiffness: 300, damping: 24 }
     },
   };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
           <AnimatePresence initial={false} mode="wait">
             <motion.div
               key={isOpen ? "close" : "menu"}
               initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
               animate={{ rotate: 0, opacity: 1, scale: 1 }}
               exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
               transition={{ duration: 0.2 }}
               className="flex items-center justify-center"
             >
               {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </motion.div>
           </AnimatePresence>
          <span className="sr-only">Deschide meniul</span>
        </Button>
      </SheetTrigger>
       <AnimatePresence>
        {isOpen && (
          <SheetContent
            side="right"
            className="w-[300px] sm:w-[350px] p-0 flex flex-col border-l bg-background/90 backdrop-blur-xl"
            as={motion.div} 
            custom="right" 
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sheetVariants}
            key="mobile-nav-content" 
          >
            <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
               <Link href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center space-x-2">
                     <motion.div
                       whileHover={{ rotate: 10, scale: 1.1 }}
                       transition={{ type: 'spring', stiffness: 300}}
                     >
                       <Logo width={24} height={24} />
                     </motion.div>
                    <SheetTitle className="text-lg font-bold">Timpia AI</SheetTitle>
                </Link>
            </SheetHeader>
             <motion.nav
                className="flex flex-col space-y-2 p-4 flex-grow overflow-y-auto"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {navItems.map((item) => (
                   <motion.div key={item.title} variants={itemVariants}>
                        <Link
                            href={item.href}
                            className={cn(
                                "block text-base font-medium text-muted-foreground hover:text-primary p-3 rounded-md hover:bg-accent/80 transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                item.className 
                            )}
                            onClick={(e) => handleLinkClick(e, item.href)}
                        >
                            {item.title}
                        </Link>
                   </motion.div>
                ))}
              </motion.nav>
             <div className="p-4 border-t mt-auto bg-muted/30">
                 <Button 
                    asChild 
                    className="w-full group bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:shadow-lg" 
                    onClick={(e) => handleLinkClick(e, '/#contact-section')}
                  >
                     <Link href="/#contact-section">
                         Programează un Demo <Calendar className="ml-2 h-4 w-4"/>
                     </Link>
                 </Button>
             </div>
          </SheetContent>
         )}
       </AnimatePresence>
    </Sheet>
  )
}
