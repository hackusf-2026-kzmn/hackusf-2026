"use client";

export interface Toast {
  id: number;
  message: string;
  type: "processing" | "success";
}

interface ToastContainerProps {
  toasts: Toast[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed top-16 right-4 z-[1000] flex flex-col gap-1.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-[#1a1a1a] border border-[#3a3a3a] px-4 py-2.5 font-mono text-[11px] text-[#888] shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-toast-in flex gap-2 items-center min-w-[260px] ${
            t.type === "processing"
              ? "border-l-[3px] border-l-[#06b6d4]"
              : "border-l-[3px] border-l-[#c8ff00]"
          }`}
        >
          <span>{t.type === "processing" ? "⚡" : "✅"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
