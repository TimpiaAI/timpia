// src/components/video-player-modal.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

export default function VideoPlayerModal({ videoUrl, onClose }: VideoPlayerModalProps) {
  return (
    <AnimatePresence>
      {videoUrl && (
        <Dialog open={!!videoUrl} onOpenChange={(open) => !open && onClose()}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          <DialogContent className="max-w-3xl w-full p-0 bg-transparent border-0 shadow-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="aspect-video"
            >
              <iframe
                src={`${videoUrl}?autoplay=1&rel=0`}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              ></iframe>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
