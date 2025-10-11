
"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react"; // Renamed Link to LinkIcon to avoid conflict
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";


interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number; // Represents a value e.g. progress, importance
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const isMobile = useIsMobile();

  const rotationAngleMotion = useMotionValue(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);


  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setIsAutoRotating(true);
    }
  };

  const toggleItem = (id: number) => {
    const isCurrentlyExpanded = expandedItems[id];
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {}; // Reset all others
      newState[id] = !prev[id];
      return newState;
    });

    if (!isCurrentlyExpanded) {
      setActiveNodeId(id);
      setIsAutoRotating(false);

      const relatedItems = getRelatedItems(id);
      const newPulseEffect: Record<number, boolean> = {};
      relatedItems.forEach((relId) => {
        newPulseEffect[relId] = true;
      });
      setPulseEffect(newPulseEffect);
      centerViewOnNode(id);
    } else {
      setActiveNodeId(null);
      setIsAutoRotating(true);
      setPulseEffect({});
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    if (isAutoRotating) {
      const rotate = () => {
        rotationAngleMotion.set((rotationAngleMotion.get() + 0.1) % 360);
        animationFrameId = requestAnimationFrame(rotate);
      };
      animationFrameId = requestAnimationFrame(rotate);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoRotating, rotationAngleMotion]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex === -1) return;
    const totalNodes = timelineData.length;
    const targetRotationDegrees = 270 - (nodeIndex / totalNodes) * 360;

    animate(rotationAngleMotion, targetRotationDegrees, {
      type: "spring",
      stiffness: 100,
      damping: 20,
    });
  };

  const calculateNodePosition = (index: number, total: number) => {
    const currentRotation = rotationAngleMotion.get();
    const angle = ((index / total) * 360 + currentRotation) % 360;
    const radius = isMobile ? 130 : 220; // Adjusted radius
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian) * 0.7; // Make orbit slightly elliptical for perspective

    const perspectiveScale = 0.7 + 0.3 * ((Math.sin(radian) + 1) / 2); // Scale based on Y position
    const zIndex = Math.round(100 + 50 * Math.sin(radian)); // Nodes at bottom appear on top
    const opacity = 0.5 + 0.5 * ((Math.sin(radian) + 1) / 2); // Fade nodes at the back

    return { x, y, angle, zIndex, opacity, perspectiveScale };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/10 border-green-500/30";
      case "in-progress":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      case "pending":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/30";
    }
  };

  return (
    <div
      className="w-full h-[600px] md:h-[700px] lg:h-full flex flex-col items-center justify-center bg-black overflow-hidden relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-radial-gradient-black opacity-80"></div>
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232A2A2A\' fill-opacity=\'0.4\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M11 0l5 20-5 20-5-20L6 0h5zm44 0l5 20-5 20-5-20L45 0h5zm-22 40l5 20-5 20-5-20L23 40h5zm44 0l5 20-5 20-5-20L67 40h5z\'/%3E%3C/g%3E%3C/svg%3E")',
            }}
            animate={{ backgroundPosition: ["0 0", "80px 80px"]}}
            transition={{ duration: 20, ease: "linear", repeat: Infinity}}
          />
      </div>
      <div
        className="relative w-full h-full flex items-center justify-center"
        ref={orbitRef}
        style={{ perspective: "1200px" }}
      >
        {/* Central Glow Element */}
        <motion.div 
            className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 flex items-center justify-center z-10 blur-2xl opacity-50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg z-[11]"></div>


        {/* Orbital Path Visual (optional) */}
        <motion.div
          className="absolute w-[440px] h-[308px] md:w-[440px] md:h-[308px] rounded-full border border-dashed border-white/10"
          style={{ rotate: rotationAngleMotion, transformStyle: "preserve-3d" }}
        />

        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          const nodeBaseScale = isMobile ? 0.9 : 1;
          const expandedScale = isMobile ? 1.3 : 1.5;

          return (
            <motion.div
              key={item.id}
              ref={(el) => (nodeRefs.current[item.id] = el)}
              className="absolute cursor-pointer group"
              style={{
                zIndex: isExpanded ? 200 : position.zIndex,
                x: position.x,
                y: position.y,
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
              animate={{
                opacity: activeNodeId && !isExpanded && !isRelated && activeNodeId !== item.id ? 0.3 : position.opacity,
                scale: isExpanded ? expandedScale * position.perspectiveScale : nodeBaseScale * position.perspectiveScale,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <motion.div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative overflow-hidden",
                  isExpanded
                    ? "bg-white text-black border-purple-400 shadow-lg shadow-purple-500/50"
                    : isRelated
                    ? "bg-white/20 text-white border-blue-400/70 animate-pulse-border-blue"
                    : "bg-black/50 text-white border-white/30 hover:border-white/70 hover:bg-white/10"
                )}
                whileHover={{ scale: isExpanded ? 1 : 1.15 }}
              >
                <Icon size={isMobile ? 16 : 20} />
                {isPulsing && !isExpanded && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-400"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "circOut" }}
                  />
                )}
              </motion.div>

              <motion.div
                className={cn(
                  "absolute whitespace-nowrap text-xs font-medium tracking-wide pointer-events-none",
                  "top-full mt-2 left-1/2 -translate-x-1/2"
                )}
                initial={{ opacity:0, y: 5}}
                animate={{ opacity: isExpanded || activeNodeId === item.id || isRelated ? 1 : 0.7, y:0 }}
                transition={{delay: 0.1}}
              >
                {item.title}
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10, transition: {duration: 0.2} }}
                    transition={{ type: "spring", stiffness: 250, damping: 25, delay: 0.05 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 z-10 top-12" // Adjusted top positioning
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
                  >
                    <Card className="bg-gray-900/80 backdrop-blur-lg border-purple-500/30 shadow-xl shadow-purple-500/20 overflow-hidden">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-purple-500/30"></div>
                      <CardHeader className="pb-3 pt-4 px-4">
                        <div className="flex justify-between items-center mb-1">
                          <Badge
                            variant="outline"
                            className={cn("px-2.5 py-0.5 text-xs border-opacity-50", getStatusStyles(item.status))}
                          >
                            {item.status.replace("-", " ").toUpperCase()}
                          </Badge>
                          <span className="text-xs font-mono text-white/60">
                            {item.date}
                          </span>
                        </div>
                        <CardTitle className="text-base text-white/95 mt-1">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-white/80 px-4 pb-4 pt-0">
                        <p className="leading-relaxed min-h-[40px]">{item.content}</p>

                        <div className="mt-3 pt-2 border-t border-white/10">
                          <div className="flex justify-between items-center text-[11px] mb-0.5 text-white/70">
                            <span className="flex items-center gap-1">
                              <Zap size={10} />
                              Nivel Angajament
                            </span>
                            <span className="font-mono">{item.energy}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${item.energy}%` }}
                              transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                            />
                          </div>
                        </div>

                        {item.relatedIds.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-white/10">
                            <div className="flex items-center mb-1.5">
                              <LinkIcon size={10} className="text-white/60 mr-1.5" />
                              <h4 className="text-[11px] uppercase tracking-wider font-semibold text-white/60">
                                Noduri Conectate
                              </h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {item.relatedIds.map((relatedId) => {
                                const relatedItem = timelineData.find(
                                  (i) => i.id === relatedId
                                );
                                return (
                                  <Button
                                    key={relatedId}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center h-auto px-2 py-0.5 text-[10px] rounded-sm border-white/20 bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleItem(relatedId);
                                    }}
                                  >
                                    {relatedItem?.title}
                                    <ArrowRight
                                      size={10}
                                      className="ml-1 text-white/50 group-hover:translate-x-0.5 transition-transform"
                                    />
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Add a CSS class for the border pulse animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
    try {
        styleSheet.insertRule(`
            @keyframes border-pulse-blue {
                0%, 100% { border-color: rgba(96, 165, 250, 0.5); box-shadow: 0 0 0px rgba(96, 165, 250, 0.2); }
                50% { border-color: rgba(96, 165, 250, 1); box-shadow: 0 0 8px rgba(96, 165, 250, 0.5); }
            }
        `, styleSheet.cssRules.length);
        styleSheet.insertRule(`
            .animate-pulse-border-blue {
                animation: border-pulse-blue 2s infinite ease-in-out;
            }
        `, styleSheet.cssRules.length);
         styleSheet.insertRule(`
            .bg-radial-gradient-black {
                background-image: radial-gradient(ellipse at center, rgba(20,20,25,0) 0%, #000000 70%);
            }
        `, styleSheet.cssRules.length);
    } catch (error) {
        console.warn("Could not insert CSS rule for border pulse animation:", error);
    }
}
