"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Markdown } from "./markdown";
import { useTextStream, type Mode } from "./response-stream";

type ReasoningContextType = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const ReasoningContext = createContext<ReasoningContextType | undefined>(
  undefined
);

function useReasoningContext() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error(
      "useReasoningContext must be used within a Reasoning provider"
    );
  }
  return context;
}

export type ReasoningProps = {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Reasoning({
  children,
  className,
  open,
  onOpenChange,
}: ReasoningProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <ReasoningContext.Provider
      value={{
        isOpen,
        onOpenChange: handleOpenChange,
      }}
    >
      <div className={className}>{children}</div>
    </ReasoningContext.Provider>
  );
}

export type ReasoningTriggerProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLButtonElement>;

function ReasoningTrigger({
  children,
  className,
  ...props
}: ReasoningTriggerProps) {
  const { isOpen, onOpenChange } = useReasoningContext();

  return (
    <button
      className={cn("flex cursor-pointer items-center gap-2", className)}
      onClick={() => onOpenChange(!isOpen)}
      {...props}
    >
      <span className="text-primary">{children}</span>
      <div
        className={cn(
          "transform transition-transform",
          isOpen ? "rotate-180" : ""
        )}
      >
        <ChevronDownIcon className="size-4" />
      </div>
    </button>
  );
}

export type ReasoningContentProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function ReasoningContent({
  children,
  className,
  ...props
}: ReasoningContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { isOpen } = useReasoningContext();

  useEffect(() => {
    if (!contentRef.current || !innerRef.current) return;

    const observer = new ResizeObserver(() => {
      if (contentRef.current && innerRef.current && isOpen) {
        contentRef.current.style.maxHeight = `${innerRef.current.scrollHeight}px`;
      }
    });

    observer.observe(innerRef.current);

    if (isOpen) {
      contentRef.current.style.maxHeight = `${innerRef.current.scrollHeight}px`;
    }

    return () => observer.disconnect();
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden transition-[max-height] duration-300 ease-out",
        className
      )}
      style={{
        maxHeight: isOpen ? contentRef.current?.scrollHeight : "0px",
      }}
      {...props}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

export type ReasoningResponseProps = {
  text: string | AsyncIterable<string>;
  className?: string;
  speed?: number;
  mode?: Mode;
  onComplete?: () => void;
  fadeDuration?: number;
  segmentDelay?: number;
  characterChunkSize?: number;
  fixedText?: string; // New prop for the fixed text
};

function ReasoningResponse({
  text,
  className,
  speed = 20,
  mode = "typewriter",
  onComplete,
  fadeDuration,
  segmentDelay,
  characterChunkSize,
  fixedText,
}: ReasoningResponseProps) {
  const { isOpen } = useReasoningContext();
  const [showFixedText, setShowFixedText] = useState(false);
  const fixedTextRef = useRef<HTMLDivElement>(null);

  const { displayedText } = useTextStream({
    textStream: text,
    speed,
    mode,
    onComplete: () => {
      // Show fixed text after markdown streaming completes
      setShowFixedText(true);
      onComplete?.();
    },
    fadeDuration,
    segmentDelay,
    characterChunkSize,
  });

  return (
    <div
      className={cn(
        "text-muted-foreground prose prose-sm dark:prose-invert text-sm transition-opacity duration-300 ease-out",
        className
      )}
      style={{
        opacity: isOpen ? 1 : 0,
      }}
    >
      <Markdown>{displayedText}</Markdown>
      {fixedText && (
        <div
          ref={fixedTextRef}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            showFixedText ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="flex flex-col items-center justify-center gap-1 mt-2">
            <div className="text-xs text-primary rounded-lg bg-secondary/40 px-2 py-1">
              Réassigner la tâche 'Déployer en staging' d'Alex à Mike pour
              équilibrer la charge
            </div>
            <div className="text-xs text-primary rounded-lg bg-secondary/40 px-2 py-1">
              Ajouter du temps tampon à 'Tester passerelle de paiement' -
              étendre la deadline de 2 jours
            </div>
            <div className="text-xs text-primary rounded-lg bg-secondary/40 px-2 py-1">
              Créer un jalon de contrôle 'Revue pré-lancement' avant la Version
              Alpha
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Reasoning, ReasoningTrigger, ReasoningContent, ReasoningResponse };
