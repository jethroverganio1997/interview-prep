"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedShinyText } from "@/components/magic/animated-shiny-text";
import { BorderBeam } from "@/components/magic/border-beam";
import { ArrowRight } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="hero"
      className="relative mx-auto py-16 max-w-[80rem] px-6 text-center md:px-8"
    >
      {/* Announcement Badge */}
      <div className="group inline-flex h-7 -translate-y-4 animate-fade-in items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white opacity-0 transition-all ease-in hover:cursor-pointer hover:bg-white/20 dark:text-black backdrop-blur-sm [--animation-delay:0ms]">
        <AnimatedShinyText className="inline-flex items-center justify-center">
          <span>✨ Introducing Magic UI Template</span>{" "}
          <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>

      {/* Main Headline */}
      <h1 className="-translate-y-4 animate-fade-in text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-6xl md:text-7xl lg:text-8xl">
        Magic UI is the new way
        <br className="hidden md:block" /> to build landing pages.
      </h1>

      {/* Subheadline */}
      <p className="mb-12 -translate-y-4 animate-fade-in text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl px-2">
        Beautifully designed, animated components and templates built with
        <br className="hidden md:block" /> Tailwind CSS,{" "}
        <Link
          href="https://nextjs.org"
          className="underline underline-offset-2"
        >
          Next.js
        </Link>
        , and
        <Link
          href="https://ui.shadcn.com"
          className="underline underline-offset-2"
        >
          {" "}
          shadcn/ui
        </Link>
        .
      </p>

      {/* CTA Button */}
      <Button
        asChild
        size="lg"
        className="-translate-y-4 animate-fade-in gap-1 rounded-lg text-white opacity-0 ease-in-out [--animation-delay:600ms] dark:text-black group"
      >
        <Link href="/auth/sign-up">
          <span>Get Started for free </span>
          <ArrowRight className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Link>
      </Button>

      {/* Hero Image with Border Beam and Glow Effect */}
      <div
        ref={ref}
        className="relative mt-32 animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:bg-gradient-to-t after:from-background after:from-30% after:to-transparent"
      >
        <div
          className={`rounded-xl border border-white/40 bg-background bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:size-full before:opacity-0 before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] before:[filter:blur(80px)] ${
            isInView ? "before:animate-image-glow" : ""
          }`}
        >
          <BorderBeam
            size={200}
            duration={12}
            delay={0}
            colorFrom="var(--color-one)"
            colorTo="var(--color-two)"
          />

          {/* Hero Images */}
          <div className="relative block size-full rounded-[inherit] border object-contain dark:hidden aspect-[4/3] sm:aspect-video overflow-hidden">
            <Image
              src="/images/hero-light.png"
              alt="Hero section illustration"
              fill
              className="object-cover object-top rounded-[inherit]"
              priority
            />
          </div>

          <div className="relative hidden size-full rounded-[inherit] border object-contain dark:block aspect-[4/3] sm:aspect-video overflow-hidden">
            <Image
              src="/images/hero-dark.png"
              alt="Hero section illustration"
              fill
              className="object-cover object-top rounded-[inherit]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
