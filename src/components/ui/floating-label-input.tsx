"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// --- Standard Label Input Component ---
// Note: Renamed conceptually, but kept filename/export for compatibility
const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: boolean }
>(({ label, id, error, className, ...props }, ref) => {
  // Generate a unique ID if one isn't provided, necessary for label association
  const inputId = id || React.useId();

  return (
    // Use a standard div structure with Label above Input
    <div className="space-y-1.5"> {/* Add space between label and input */}
      {/* Standard Label component */}
      <Label
        htmlFor={inputId} // Match the input's ID
        className={cn(
            "text-sm font-medium leading-none", // Standard label styling
             error ? "text-destructive" : "text-foreground/90" // Error state color
         )}
      >
        {label}
      </Label>
      <Input
        ref={ref}
        id={inputId} // Use the generated or provided ID
        className={cn(
          "h-11 bg-background/50 focus:outline-none focus:ring-0 transition-colors duration-200", // Base styles
           // Use a standard border, not just bottom
          "border rounded-md",
          error
            ? "border-destructive focus-visible:ring-destructive/50" // Error border and ring
            : "border-input focus-visible:ring-ring", // Standard border and ring
          className // Allow additional classes
        )}
         // Placeholder is now always visible
         placeholder={props.placeholder || label} // Use provided placeholder or fallback to label
        {...props} // Spread remaining props (like value, onChange, etc.)
      />
    </div>
  );
});
FloatingLabelInput.displayName = "StandardLabelInput"; // Update display name


export { FloatingLabelInput };
