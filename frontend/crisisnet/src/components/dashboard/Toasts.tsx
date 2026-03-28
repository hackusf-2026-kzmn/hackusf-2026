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
          className={`bg-white border border-[#d4dbc8] px-4 py-2.5 font-mono text-[11px] text-[#52665e] shadow-[0_8px_24px_rgba(0,0,0,0.1)] animate-toast-in flex gap-2 items-center min-w-[260px] ${
            t.type === "processing"
              ? "border-l-[3px] border-l-[#06b6d4]"
              : "border-l-[3px] border-l-[#16a34a]"
          }`}
        >
          <span>{t.type === "processing" ? "⚡" : "✅"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
