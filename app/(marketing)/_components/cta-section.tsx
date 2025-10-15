"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Marquee } from "@/components/magic/marquee"
import { CtaCard } from "@/components/ui/cta-card"
import {
  BarChart,
  ChevronRight,
  FileText,
  Globe,
  HeartHandshake,
  Rss,
  Shield,
} from "lucide-react"
import { LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface TileConfig {
  icon: LucideIcon
  bg: string
}

const tiles: TileConfig[] = [
  {
    icon: HeartHandshake,
    bg: "pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 opacity-70 blur-[20px]",
  },
  {
    icon: Globe,
    bg: "pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-70 blur-[20px]",
  },
  {
    icon: FileText,
    bg: "pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 opacity-70 blur-[20px]",
  },
  {
    icon: Shield,
    bg: "pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 opacity-70 blur-[20px]",
  },
  {
    icon: Rss,
    bg: "pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 opacity-70 blur-[20px]",
  },
  {
    icon: BarChart,
    bg: "pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 opacity-70 blur-[20px]",
  },
]

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  let currentIndex = newArray.length

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ]
  }

  return newArray
}

export default function CTASection() {
  // Initialize state with tiles (no shuffle on server)
  const [randomTiles1, setRandomTiles1] = useState(tiles)
  const [randomTiles2, setRandomTiles2] = useState(tiles)
  const [randomTiles3, setRandomTiles3] = useState(tiles)
  const [randomTiles4, setRandomTiles4] = useState(tiles)

  // Only shuffle on client side after mount
  useEffect(() => {
    setRandomTiles1(shuffleArray(tiles))
    setRandomTiles2(shuffleArray(tiles))
    setRandomTiles3(shuffleArray(tiles))
    setRandomTiles4(shuffleArray(tiles))
  }, [])

  return (
    <section id="cta">
      <div className="py-14">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            {/* Multi-layer Marquee */}
            <Marquee reverse className="-delay-[200ms] [--duration:10s]" repeat={5}>
              {randomTiles1.map((tile, id) => (
                <CtaCard key={`row1-${id}`} id={`row1-${id}`}>
                  <tile.icon className="size-full" />
                  <div className={tile.bg} />
                </CtaCard>
              ))}
            </Marquee>

            <Marquee reverse className="[--duration:25s]" repeat={5}>
              {randomTiles2.map((tile, id) => (
                <CtaCard key={`row2-${id}`} id={`row2-${id}`}>
                  <tile.icon className="size-full" />
                  <div className={tile.bg} />
                </CtaCard>
              ))}
            </Marquee>

            <Marquee reverse className="-delay-[200ms] [--duration:20s]" repeat={5}>
              {randomTiles1.map((tile, id) => (
                <CtaCard key={`row3-${id}`} id={`row3-${id}`}>
                  <tile.icon className="size-full" />
                  <div className={tile.bg} />
                </CtaCard>
              ))}
            </Marquee>

            <Marquee reverse className="[--duration:30s]" repeat={5}>
              {randomTiles2.map((tile, id) => (
                <CtaCard key={`row4-${id}`} id={`row4-${id}`}>
                  <tile.icon className="size-full" />
                  <div className={tile.bg} />
                </CtaCard>
              ))}
            </Marquee>

            <Marquee reverse className="-delay-[200ms] [--duration:20s]" repeat={5}>
              {randomTiles3.map((tile, id) => (
                <CtaCard key={`row5-${id}`} id={`row5-${id}`}>
                  <tile.icon className="size-full" />
                  <div className={tile.bg} />
                </CtaCard>
              ))}
            </Marquee>

            <Marquee reverse className="[--duration:30s]" repeat={5}>
              {randomTiles4.map((tile, id) => (
                <CtaCard key={`row6-${id}`} id={`row6-${id}`}>
                  <tile.icon className="size-full" />
                  <div className={tile.bg} />
                </CtaCard>
              ))}
            </Marquee>

            {/* Center Content */}
            <div className="absolute z-10 mb-24">
              <div className="mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
                <HeartHandshake className="mx-auto size-16 text-black dark:text-white lg:size-24" />
              </div>
              <div className="z-10 mt-4 flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold lg:text-4xl">
                  Stop wasting time on design.
                </h1>
                <p className="mt-2">Start your 7-day free trial. No credit card required.</p>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group mt-4 rounded-[2rem] px-6"
                >
                  <Link href="/auth/sign-up">
                    Get Started
                    <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div className="absolute inset-0 -z-10 rounded-full bg-background opacity-40 blur-xl dark:bg-background" />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-background to-70% dark:to-background" />
          </div>
        </div>
      </div>
    </section>
  )
}
