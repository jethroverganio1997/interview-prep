"use client"

import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { ReactNode, useEffect } from "react"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface CtaCardProps {
  children: ReactNode
  id?: string
}

export function CtaCard({ children, id }: CtaCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: {
          delay: Math.random() * 2,
          ease: "easeOut",
          duration: 1
        },
      })
    }
  }, [isInView, controls])

  return (
    <motion.div
      id={id}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(
        "relative size-20 cursor-pointer overflow-hidden rounded-2xl border p-4",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      {children}
    </motion.div>
  )
}
