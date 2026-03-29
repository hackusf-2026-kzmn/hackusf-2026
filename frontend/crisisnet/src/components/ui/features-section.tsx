import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, Radio, LucideIcon, Radar, BarChart3, Link2, Radio as RadioIcon, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export function Features() {
  return (
    <div className="px-6 md:px-[60px]">
      <div className="grid gap-4 lg:grid-cols-2">
        <FeatureCard className="flex flex-col">
          <CardHeader className="pb-3">
            <CardHeading
              icon={Activity}
              title="Real-time threat scoring"
              description="AI-driven severity analysis across storm category, population density, and historical damage patterns."
            />
          </CardHeader>

          <div className="relative border-t border-dashed flex-1 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
              className="w-full h-full object-cover object-center"
              alt="data dashboard illustration"
              width={1207}
              height={929}
            />
          </div>
        </FeatureCard>

        <FeatureCard className="flex flex-col">
          <CardHeader className="pb-3">
            <CardHeading
              icon={Radio}
              title="Multi-source monitoring"
              description="Continuous ingestion from NWS, FEMA, and local news — anomalies flagged in seconds."
            />
          </CardHeader>

          <div className="relative flex-1 border-t border-dashed overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80"
              className="w-full h-full object-cover object-center"
              alt="monitoring dashboard illustration"
              width={1207}
              height={929}
            />
          </div>
        </FeatureCard>

        <FeatureCard className="p-6 lg:col-span-2">
          <p className="mx-auto mt-4 mb-6 max-w-lg text-balance text-center font-display text-[18px] font-bold uppercase tracking-tight">
            Google ADK Orchestration · ~94s per cycle
          </p>

          <div className="flex items-center justify-center gap-0 overflow-x-auto pb-4">
            {/* Scout */}
            <PipelineNode
              icon={Radar}
              label="Scout"
              sublabel="NWS · FEMA · News"
              pattern="border"
            />

            <PipelineArrow />

            {/* Parallel fork */}
            <div className="flex flex-col items-center gap-3">
              <div className="font-mono text-[13px] text-[#16a34a] tracking-[2px] mb-1">PARALLEL</div>
              <PipelineNode
                icon={BarChart3}
                label="Triage"
                sublabel="Severity 0–100"
                pattern="primary"
              />
              <PipelineNode
                icon={Link2}
                label="Resource"
                sublabel="Program Match"
                pattern="green"
              />
            </div>

            <PipelineArrow />

            {/* Comms */}
            <PipelineNode
              icon={RadioIcon}
              label="Comms"
              sublabel="EN · ES · HT"
              pattern="primary"
            />

            <PipelineArrow label="API" />

            {/* Output */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="bg-gradient-to-b from-border size-fit rounded-2xl to-transparent p-px">
                <div className="bg-gradient-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center justify-center rounded-[15px] p-5">
                  <div className="size-11 rounded-md border-2 border-[#16a34a] bg-[#16a34a]/10 flex items-center justify-center">
                    <span className="font-mono text-[13px] text-[#16a34a] font-bold">EOC</span>
                  </div>
                </div>
              </div>
              <span className="font-mono text-[13px] text-[#6b7869] tracking-[2px] text-center uppercase">
                Dispatch
              </span>
              <span className="font-mono text-[12px] text-[#6b7869]/60 tracking-wider text-center">
                Hillsborough EOC
              </span>
            </div>
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card
    className={cn(
      "group relative rounded-none shadow-zinc-950/5",
      className
    )}
  >
    <CardDecorator />
    {children}
  </Card>
);

const CardDecorator = () => (
  <>
    <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
    <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
    <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
    <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
  </>
);

interface CardHeadingProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CardHeading = ({
  icon: Icon,
  title,
  description,
}: CardHeadingProps) => (
  <div className="p-6">
    <span className="font-mono text-[13px] text-[#6b7869] tracking-[2px] uppercase flex items-center gap-2">
      <Icon className="size-3.5" />
      {title}
    </span>
    <p className="mt-6 font-display text-[18px] font-bold uppercase tracking-tight text-foreground">{description}</p>
  </div>
);

interface PipelineNodeProps {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  pattern: "border" | "primary" | "green";
}

const PipelineNode = ({ icon: Icon, label, sublabel, pattern }: PipelineNodeProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className="bg-gradient-to-b from-border size-fit rounded-2xl to-transparent p-px">
      <div className="bg-gradient-to-b from-background to-muted/25 relative flex aspect-square w-fit items-center justify-center rounded-[15px] p-5">
        <div
          className={cn("size-12 rounded-full border flex items-center justify-center", {
            "border-primary bg-[repeating-linear-gradient(-45deg,hsl(var(--border)),hsl(var(--border))_1px,transparent_1px,transparent_4px)]":
              pattern === "border",
            "border-primary bg-background bg-[repeating-linear-gradient(-45deg,hsl(var(--primary)),hsl(var(--primary))_1px,transparent_1px,transparent_4px)]":
              pattern === "primary",
            "border-[#16a34a] bg-background bg-[repeating-linear-gradient(-45deg,#16a34a,#16a34a_1px,transparent_1px,transparent_4px)]":
              pattern === "green",
          })}
        >
          <Icon className="size-5 text-foreground" />
        </div>
      </div>
    </div>
    <span className="font-mono text-[13px] text-[#6b7869] tracking-[2px] text-center uppercase">
      {label}
    </span>
    <span className="font-mono text-[12px] text-[#6b7869]/60 tracking-wider text-center">
      {sublabel}
    </span>
  </div>
);

interface PipelineArrowProps {
  label?: string;
}

const PipelineArrow = ({ label }: PipelineArrowProps) => (
  <div className="flex flex-col items-center mx-5">
    {label && (
      <span className="font-mono text-[13px] text-[#16a34a] tracking-[2px] mb-0.5">{label}</span>
    )}
    <div className="flex items-center gap-0">
      <div className="w-24 h-px bg-[#d4dbc8]" />
      <ChevronRight className="size-3.5 text-[#16a34a] -ml-1" />
    </div>
  </div>
);
