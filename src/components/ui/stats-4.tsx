
"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as RechartsPrimitive from "recharts";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-auto-scroll";


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-black/40 text-white shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Chart related components and types
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }
  
  const styles = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
.map(([key, itemConfig]) => {
  const color =
    itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
    itemConfig.color;
  return color ? `  --color-${key}: ${color};` : null;
})
.join("\n")}
}
`
    )
    .join("\n");
    
  return React.createElement("style", {
    dangerouslySetInnerHTML: { __html: styles },
  });
};

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const data = [
  { date: "Nov 24", lead: 120, efficiency: 60, conversion: 70 },
  { date: "Nov 25", lead: 135, efficiency: 65, conversion: 68 },
  { date: "Nov 26", lead: 125, efficiency: 62, conversion: 78 },
  { date: "Nov 27", lead: 180, efficiency: 72, conversion: 80 },
  { date: "Nov 28", lead: 165, efficiency: 70, conversion: 82 },
  { date: "Nov 29", lead: 210, efficiency: 80, conversion: 88 },
  { date: "Nov 30", lead: 190, efficiency: 78, conversion: 85 },
  { date: "Dec 01", lead: 230, efficiency: 85, conversion: 92 },
  { date: "Dec 02", lead: 220, efficiency: 82, conversion: 90 },
  { date: "Dec 03", lead: 250, efficiency: 90, conversion: 95 },
  { date: "Dec 08", lead: 265, efficiency: 92, conversion: 98 },
];


type ChangeType = 'positive' | 'negative';

export interface StatDetail {
  label: string;
  value: string;
  change: string;
  changeType?: ChangeType;
}

export interface StatsSummaryProps {
  lead: StatDetail;
  efficiency: StatDetail;
  conversion: StatDetail;
}

type SummaryItem = {
  name: string;
  dataKey: 'lead' | 'efficiency' | 'conversion';
  value: string;
  change: string;
  changeType: ChangeType;
  color: string;
  chartType: 'area' | 'line' | 'bar';
};


const StatCard = ({ item }: { item: SummaryItem }) => {
  const gradientId = `gradient-${item.dataKey}`;
  const filterId = `glow-${item.dataKey}`;
  const ChartComponent =
    item.chartType === 'area' ? RechartsPrimitive.AreaChart :
    item.chartType === 'line' ? RechartsPrimitive.LineChart :
    RechartsPrimitive.BarChart;
  const ChartElement =
    item.chartType === 'area' ? RechartsPrimitive.Area :
    item.chartType === 'line' ? RechartsPrimitive.Line :
    RechartsPrimitive.Bar;

  return (
    <Card className="p-0 border-white/20">
      <CardContent className="p-4 pb-0">
        <dl className="space-y-2">
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-white/80">{item.name}</dt>
            <dd
              className={cn("text-lg font-semibold")}
              style={{ color: item.color }}
            >
              {item.value}
            </dd>
            <dd
              className={cn(
                "text-sm",
                item.changeType === "positive" ? "text-green-500" : "text-red-500"
              )}
            >
              {item.change}
            </dd>
          </div>
        </dl>
        <div className="mt-2 h-16 overflow-hidden">
          <ChartContainer
            className="w-full h-full"
            config={{
              [item.dataKey]: {
                label: item.name,
                color: item.color,
              },
            }}
          >
            <ChartComponent
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${item.dataKey})`} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={`var(--color-${item.dataKey})`} stopOpacity={0.1} />
                </linearGradient>
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <RechartsPrimitive.XAxis dataKey="date" hide={true} />
              <ChartElement
                dataKey={item.dataKey}
                type="monotone"
                stroke={`var(--color-${item.dataKey})`}
                strokeWidth={2}
                fill={item.chartType === 'area' ? `url(#${gradientId})` : `var(--color-${item.dataKey})`}
                fillOpacity={item.chartType === 'area' ? 1 : 0.4}
                style={item.chartType === 'area' ? { filter: `url(#${filterId})` } : {}}
              />
            </ChartComponent>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};


export default function Stats4({ stats }: { stats: StatsSummaryProps }) {
    const isMobile = useIsMobile();
    const autoplayPlugin = React.useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    const summary: SummaryItem[] = React.useMemo(
      () => [
        {
          name: stats.lead.label,
          dataKey: 'lead',
          value: stats.lead.value,
          change: stats.lead.change,
          changeType: stats.lead.changeType ?? 'positive',
          color: 'hsl(270 80% 55%)',
          chartType: 'area',
        },
        {
          name: stats.efficiency.label,
          dataKey: 'efficiency',
          value: stats.efficiency.value,
          change: stats.efficiency.change,
          changeType: stats.efficiency.changeType ?? 'positive',
          color: 'hsl(217 91% 60%)',
          chartType: 'line',
        },
        {
          name: stats.conversion.label,
          dataKey: 'conversion',
          value: stats.conversion.value,
          change: stats.conversion.change,
          changeType: stats.conversion.changeType ?? 'positive',
          color: 'hsl(142 76% 36%)',
          chartType: 'bar',
        },
      ],
      [stats],
    );

    const renderContent = () => {
        if (isMobile) {
            return (
                <Carousel
                    opts={{ loop: true, align: "center" }}
                    plugins={[autoplayPlugin.current]}
                    className="w-full max-w-xs"
                >
                    <CarouselContent>
                        {summary.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <StatCard item={item} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            );
        }

        return (
            <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {summary.map((item) => (
                    <StatCard key={item.name} item={item} />
                ))}
            </div>
        );
    };

    return (
        <div className="flex items-center justify-center w-full bg-black">
            {renderContent()}
        </div>
    );
}
