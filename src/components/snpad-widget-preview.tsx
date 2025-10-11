
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Eye, PowerOff } from 'lucide-react';

const WIDGET_SCRIPT_ID = 'snpad-widget-preview-script';
const WIDGET_CONTAINER_ID = 'snpad-widget-container'; // Make sure this matches the ID in loader.js

export default function SnpadWidgetPreview() {
    const [isPreviewActive, setIsPreviewActive] = useState(false);

    // Function to safely remove the widget and script
    const cleanupWidget = useCallback(() => {
        const script = document.getElementById(WIDGET_SCRIPT_ID);
        if (script) {
            script.remove();
        }
        const widgetContainer = document.getElementById(WIDGET_CONTAINER_ID);
        if (widgetContainer) {
            widgetContainer.remove();
        }
        // Also remove the style tag if it exists
        const styleTag = document.querySelector('style[data-snpad-widget-styles]');
        if (styleTag) {
            styleTag.remove();
        }
    }, []);

    const handleTogglePreview = () => {
        if (isPreviewActive) {
            cleanupWidget();
            setIsPreviewActive(false);
        } else {
            // Ensure any previous instances are cleaned up before adding a new one
            cleanupWidget();

            const script = document.createElement('script');
            script.id = WIDGET_SCRIPT_ID;
            script.src = '/chatbots/snpad/loader.js';
            script.async = true;
            script.onload = () => {
                console.log("SNPAd loader.js loaded for preview.");
                // The loader script should handle creating the widget itself
            };
            script.onerror = () => {
                console.error("Failed to load SNPAd loader.js for preview.");
                alert("Nu am putut încărca scriptul de previzualizare. Verificați consola.");
            };
            document.body.appendChild(script);
            setIsPreviewActive(true);
        }
    };
    
    // Ensure cleanup on component unmount
    useEffect(() => {
        return () => {
            if (isPreviewActive) {
                cleanupWidget();
            }
        };
    }, [isPreviewActive, cleanupWidget]);

    return (
        <Button
            onClick={handleTogglePreview}
            variant={isPreviewActive ? "destructive" : "secondary"}
            size="sm"
            className="flex items-center gap-2"
        >
            {isPreviewActive ? (
                <>
                    <PowerOff className="h-4 w-4" /> Oprește Preview
                </>
            ) : (
                <>
                    <Eye className="h-4 w-4" /> Previzualizează Widget
                </>
            )}
        </Button>
    );
}
