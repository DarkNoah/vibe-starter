"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "./header";
import { Sparkle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeroSectionWrapper() {
  const { t } = useTranslation();

  return (
    <>
      <HeroHeader />
      <main>
        <section className="">
          <div className="py-20 md:py-36">
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
              <div>
                <Link
                  href="#"
                  className="hover:bg-foreground/5 mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pl-1 pr-3 transition-colors duration-150"
                >
                  <div
                    aria-hidden
                    className="border-background bg-linear-to-b dark:inset-shadow-2xs to-foreground from-primary relative flex size-5 items-center justify-center rounded border shadow-md shadow-black/20 ring-1 ring-black/10"
                  >
                    <div className="absolute inset-x-0 inset-y-1.5 border-y border-dotted border-white/25"></div>
                    <div className="absolute inset-x-1.5 inset-y-0 border-x border-dotted border-white/25"></div>
                    <Sparkle className="size-3 fill-background stroke-background drop-shadow" />
                  </div>
                  <span className="font-medium">
                    {t("introducingAI", "Introducing AI Agents")}
                  </span>
                </Link>
                <h1 className="mx-auto mt-8 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                  {t("heroTitle", "Build 10x Faster with Starter")}
                </h1>
                <p className="text-muted-foreground mx-auto my-6 max-w-xl text-balance text-xl">
                  {t(
                    "heroSubtitle",
                    "Craft. Build. Ship Modern Websites With AI Support."
                  )}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <Button asChild size="lg">
                    <Link href="#link">
                      <span className="text-nowrap">
                        {t("startBuilding", "Start Building")}
                      </span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="#link">
                      <span className="text-nowrap">
                        {t("watchVideo", "Watch Video")}
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div
              aria-hidden
              className="dark:from-primary/5 dark:to-background to-primary/5 from-background absolute inset-0 mx-auto w-[88vw] rounded-[50%] bg-gradient-to-t opacity-30 blur-3xl"
            ></div>
            <div className="relative mx-auto mt-16 max-w-6xl px-6">
              <Image
                src="/hero-section-main-app-dark.png"
                alt="Payouts"
                width={1444}
                height={924}
                quality={100}
                className="relative rounded-xl border-2 shadow-2xl shadow-black/40"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
