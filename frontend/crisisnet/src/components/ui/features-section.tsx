import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Radio, LucideIcon, Radar, BarChart3, Link2, Radio as RadioIcon, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

const featureTranslations = {
  en: {
    card2Title: "Multi-source monitoring",
    card2Desc: "Continuous ingestion from NWS, FEMA, and local news — anomalies flagged in seconds.",
    pipelineLabel: "Google ADK Orchestration · ~94s per cycle",
    parallel: "PARALLEL",
    programMatch: "Program Match",
    dispatch: "Dispatch",
    eoc: "Hillsborough EOC",
  },
  es: {
    card2Title: "Monitoreo multi-fuente",
    card2Desc: "Ingesta continua de NWS, FEMA y noticias locales — anomalías detectadas en segundos.",
    pipelineLabel: "Orquestación Google ADK · ~94s por ciclo",
    parallel: "PARALELO",
    programMatch: "Emparejar Programas",
    dispatch: "Despacho",
    eoc: "Hillsborough EOC",
  },
};

export function Features({ lang = "en" }: { lang?: "en" | "es" }) {
  const ft = featureTranslations[lang];
  return (
    <div className="px-6 md:px-[60px]">
      <div className="grid gap-4">
        <FeatureCard className="flex flex-col">
          <CardHeader className="pb-3">
            <CardHeading
              icon={Radio}
              title={ft.card2Title}
              description={ft.card2Desc}
            />
          </CardHeader>

          <div className="relative border-t border-dashed overflow-hidden">
            <video
              src="/crisis-net_video1080p.mp4"
              className="w-full object-contain"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </FeatureCard>

        <FeatureCard className="p-6">
          <p className="mx-auto mt-4 mb-6 max-w-lg text-balance text-center font-display text-[18px] font-bold uppercase tracking-tight">
            {ft.pipelineLabel}
          </p>

          <div className="flex items-center justify-center gap-0 overflow-x-auto pb-4">
            {/* Scout */}
            <PipelineNode
              icon={Radar}
              label="Scout"
              sublabel="NWS Alerts"
              pattern="border"
            />

            <PipelineArrow />

            {/* Parallel fork */}
            <div className="flex flex-col items-center gap-3">
              <div className="font-mono text-[13px] text-[#16a34a] tracking-[2px] mb-1">{ft.parallel}</div>
              <PipelineNode
                icon={BarChart3}
                label="Triage"
                sublabel="Severity 0–100"
                pattern="primary"
              />
              <PipelineNode
                icon={Link2}
                label="Resource"
                sublabel={ft.programMatch}
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
                {ft.dispatch}
              </span>
              <span className="font-mono text-[12px] text-[#6b7869]/60 tracking-wider text-center">
                {ft.eoc}
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
