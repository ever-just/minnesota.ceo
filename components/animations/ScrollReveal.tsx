'use client'

import { motion, useAnimation, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, ReactNode } from 'react'

export interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  threshold?: number
  triggerOnce?: boolean
  animationVariant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate'
}

const animationVariants: Record<string, Variants> = {
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
    }
  },
  fadeIn: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    }
  },
  slideLeft: {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
    }
  },
  slideRight: {
    hidden: {
      opacity: 0,
      x: -100,
    },
    visible: {
      opacity: 1,
      x: 0,
    }
  },
  scale: {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    }
  },
  rotate: {
    hidden: {
      opacity: 0,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      rotate: 0,
    }
  }
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  threshold = 0.2,
  triggerOnce = true,
  animationVariant = 'fadeUp'
}: ScrollRevealProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold,
    triggerOnce
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    } else if (!triggerOnce) {
      controls.start('hidden')
    }
  }, [controls, inView, triggerOnce])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={animationVariants[animationVariant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth animation
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
