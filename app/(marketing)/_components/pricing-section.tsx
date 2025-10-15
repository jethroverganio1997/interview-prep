"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Interval = "month" | "year";

interface PriceTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  isMostPopular: boolean;
  isFeatured?: boolean;
}

const pricingTiers: PriceTier[] = [
  {
    id: "price_1",
    name: "Basic",
    description: "A basic plan for startups and individual users",
    features: [
      "AI-powered analytics",
      "Basic support",
      "5 projects limit",
      "Access to basic AI tools",
    ],
    monthlyPrice: 10,
    yearlyPrice: 100,
    isMostPopular: false,
  },
  {
    id: "price_2",
    name: "Premium",
    description: "A premium plan for growing businesses",
    features: [
      "Advanced AI insights",
      "Priority support",
      "Unlimited projects",
      "Access to all AI tools",
      "Custom integrations",
    ],
    monthlyPrice: 20,
    yearlyPrice: 200,
    isMostPopular: true,
    isFeatured: true,
  },
  {
    id: "price_3",
    name: "Enterprise",
    description:
      "An enterprise plan with advanced features for large organizations",
    features: [
      "Custom AI solutions",
      "24/7 dedicated support",
      "Unlimited projects",
      "Access to all AI tools",
      "Custom integrations",
      "Data security and compliance",
    ],
    monthlyPrice: 50,
    yearlyPrice: 500,
    isMostPopular: false,
  },
  {
    id: "price_4",
    name: "Ultimate",
    description: "The ultimate plan with all features for industry leaders",
    features: [
      "Bespoke AI development",
      "White-glove support",
      "Unlimited projects",
      "Priority access to new AI tools",
      "Custom integrations",
      "Highest data security and compliance",
    ],
    monthlyPrice: 80,
    yearlyPrice: 800,
    isMostPopular: false,
  },
];

export default function PricingSection() {
  const [interval, setInterval] = useState<Interval>("month");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState("");

  const handleSubscribe = async (priceId: string) => {
    setLoadingId(priceId);
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setLoadingId("");
  };

  return (
    <section id="pricing" className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mx-auto max-w-5xl text-center mb-16">
          <h4 className="text-xl font-bold tracking-tight text-black dark:text-white">
            Pricing
          </h4>

          <h2 className="text-5xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            Simple pricing for everyone.
          </h2>

          <p className="mt-6 text-xl leading-8 text-black/80 dark:text-white">
            Choose an <strong>affordable plan</strong> that&apos;s packed with
            the best features for engaging your audience, creating customer
            loyalty, and driving sales.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex w-full items-center justify-center space-x-2 mb-12">
          <Switch
            id="interval"
            checked={interval === "year"}
            onCheckedChange={(checked) =>
              setInterval(checked ? "year" : "month")
            }
          />
          <span>Annual</span>
          <span className="inline-block whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold uppercase leading-5 tracking-wide text-white dark:bg-white dark:text-black">
            2 MONTHS FREE ✨
          </span>
        </div>

        {/* Pricing Grid */}
        <div className="mx-auto grid w-full justify-center gap-6 px-8 sm:px-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.id}
              className={cn(
                "relative flex max-w-[400px] flex-col overflow-hidden rounded-2xl border  shadow-sm",
                tier.isFeatured && "border-2 border-primary shadow-lg scale-105"
              )}
            >
              {tier.isFeatured && <BorderBeam />}

              {tier.isMostPopular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="shadow-sm">Most Popular</Badge>
                </div>
              )}

              {/* Header */}
              <CardHeader>
                <div className="flex flex-col items-start">
                  <CardTitle className="text-2xl font-bold mb-2 text-black dark:text-white">
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-base text-black/80 dark:text-white/80">
                    {tier.description}
                  </CardDescription>
                </div>
              </CardHeader>

              {/* Price Display */}
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={interval}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="flex items-baseline justify-start mb-8"
                  >
                    <span className="text-4xl font-bold text-black dark:text-white">
                      $
                      {interval === "month"
                        ? tier.monthlyPrice
                        : tier.yearlyPrice}
                    </span>
                    <span className="text-base">/ {interval}</span>
                  </motion.div>
                </AnimatePresence>

                {/* CTA Button */}
                <div>
                  <Button
                    className={cn(
                      "group relative w-full gap-2 overflow-hidden text-lg font-semibold tracking-tighter",
                      "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2"
                    )}
                    variant={tier.isFeatured ? "default" : "outline"}
                    size="lg"
                    disabled={isLoading}
                    onClick={() => handleSubscribe(tier.id)}
                  >
                    <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black" />
                    {isLoading && loadingId === tier.id ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Subscribing
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </div>

                {/* Features List */}
                <div className="relative space-y-4 py-6">
                  <div className="h-px w-full bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0 dark:from-neutral-800/0 dark:via-neutral-500/30 dark:to-neutral-800/0" />
                  {tier.features && tier.features.length > 0 && (
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="size-5 shrink-0 text-primary mt-0.5" />
                          <span className="text-sm text-black dark:text-white">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
