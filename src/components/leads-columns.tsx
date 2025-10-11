// src/components/leads-columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Mail, Phone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Lead } from "@/components/dashboard-client-page"
import { Badge } from "./ui/badge"

const formatTimestamp = (ts: Lead['timestamp']) => {
    if (!ts) return 'N/A';
    return new Date(ts.seconds * 1000).toLocaleString('ro-RO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const renderWithFallback = (value: any, fallback = "N/A") => {
    if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground/60 italic">{fallback}</span>;
    }
    // Handle array values (like services)
    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-muted-foreground/60 italic">{fallback}</span>;
        return (
            <div className="flex flex-wrap gap-1">
                {value.map(item => <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>)}
            </div>
        );
    }
    // Handle booleans
    if (typeof value === 'boolean') {
        return value ? 'Da' : 'Nu';
    }
    // Handle website links
    if (typeof value === 'string' && (value.startsWith('http') || value.includes('.'))) {
        const displayUrl = value.replace(/^(https?:\/\/)?(www\.)?/, '');
        const fullUrl = value.startsWith('http') ? value : `https://${value}`;
        return <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">{displayUrl} <ExternalLink className="h-3 w-3"/></a>;
    }
    // Handle all other values
    return <span>{String(value)}</span>;
};

// --- Dynamic Column Generation ---
export const generateDynamicColumns = (data: Lead[]): ColumnDef<Lead>[] => {
    if (!data || data.length === 0) {
        return [];
    }

    const allKeys = new Set<string>();
    data.forEach(row => {
        Object.keys(row).forEach(key => {
            // Only consider adding a key if at least one row has a non-empty value for it.
            if (row[key] !== null && row[key] !== undefined && row[key] !== '') {
                allKeys.add(key);
            }
        });
    });

    const staticFields = new Set(['id', 'timestamp']); // Fields to exclude from dynamic generation
    const dynamicKeys = Array.from(allKeys).filter(key => !staticFields.has(key));
    
    // Custom sort order
    const preferredOrder = ['name', 'fullName', 'Nume complet', 'email', 'companyEmail', 'Email', 'phone', 'Telefon', 'companyName', 'Firmă', 'companyWebsite', 'website', 'standardPackage'];
    dynamicKeys.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a);
        const indexB = preferredOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Both are in preferred order
        if (indexA !== -1) return -1; // A is preferred, B is not
        if (indexB !== -1) return 1;  // B is preferred, A is not
        return a.localeCompare(b);   // Alphabetical for the rest
    });


    const baseColumns: ColumnDef<Lead>[] = [
        {
            accessorKey: "timestamp",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Dată <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => formatTimestamp(row.getValue("timestamp"))
        }
    ];

    const dynamicColumns: ColumnDef<Lead>[] = dynamicKeys.map(key => ({
        accessorKey: key,
        // Format header from camelCase or snake_case to Title Case
        header: key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
        cell: ({ row }) => renderWithFallback(row.getValue(key))
    }));
    
    const actionColumn: ColumnDef<Lead> = {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original;
            const email = lead.email || lead.companyEmail || lead.Email;
            const phone = lead.phone || lead.Telefon;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Deschide meniu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                        {email && (
                            <>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(email)}>
                                    Copiază Email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <a href={`mailto:${email}`} className="flex items-center w-full">
                                        <Mail className="mr-2 h-4 w-4"/> Trimite Email
                                    </a>
                                </DropdownMenuItem>
                            </>
                        )}
                        {phone && (
                            <DropdownMenuItem>
                                <a href={`tel:${phone}`} className="flex items-center w-full">
                                    <Phone className="mr-2 h-4 w-4"/> Sună Clientul
                                </a>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };

    return [...baseColumns, ...dynamicColumns, actionColumn];
};
