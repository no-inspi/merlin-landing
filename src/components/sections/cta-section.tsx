import Image from "next/image";
import { siteConfig } from "@/lib/config";

import {
  InputButton,
  InputButtonAction,
  InputButtonInput,
  InputButtonProvider,
  InputButtonSubmit,
} from "../ui/input-button";

export function CTASection() {
  const { ctaSection } = siteConfig;

  return (
    <section
      id="cta"
      className="flex flex-col items-center justify-center w-full"
    >
      <div className="w-full">
        <div className="h-[400px] md:h-[400px] overflow-hidden shadow-xl w-full border border-border rounded-xl bg-secondary relative z-20">
          <Image
            src={ctaSection.backgroundImage}
            alt="Agent CTA Background"
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
            fill
            priority
          />
          <div className="absolute inset-0 -top-32 md:-top-40 flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl md:text-7xl font-medium tracking-tighter max-w-xs md:max-w-xl text-center">
              {ctaSection.title}
            </h1>
            <div className="absolute bottom-10 flex flex-col items-center justify-center gap-2 w-full">
              <form
                // onSubmit={handleSubmit}
                action="https://getlaunchlist.com/s/5GcQpz"
                method="POST"
                target="_blank"
                className="w-full flex flex-col items-center gap-2"
              >
                <InputButtonProvider>
                  <InputButton>
                    <InputButtonAction>Rejoins la waitlist</InputButtonAction>
                    <InputButtonSubmit>Rejoindre</InputButtonSubmit>
                  </InputButton>
                  <InputButtonInput
                    type="email"
                    name="email"
                    placeholder="your-email@example.com"
                    required
                  />
                </InputButtonProvider>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
