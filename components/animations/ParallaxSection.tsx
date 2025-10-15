'use client'

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { ReactNode, useRef } from 'react'

export interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  offset?: number
  speed?: number
  type?: 'vertical' | 'horizontal' | 'zoom' | 'rotate'
}

export default function ParallaxSection({
  children,
  className = '',
  offset = 50,
  speed = 0.5,
  type = 'vertical'
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  let transformValue: MotionValue<any>

  switch (type) {
    case 'vertical':
      transformValue = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed])
      break
    case 'horizontal':
      transformValue = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed])
      break
    case 'zoom':
      transformValue = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2])
      break
    case 'rotate':
      transformValue = useTransform(scrollYProgress, [0, 1], [-5, 5])
      break
    default:
      transformValue = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed])
  }

  const getMotionProps = () => {
    switch (type) {
      case 'vertical':
        return { y: transformValue }
      case 'horizontal':
        return { x: transformValue }
      case 'zoom':
        return { scale: transformValue }
      case 'rotate':
        return { rotate: transformValue }
      default:
        return { y: transformValue }
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={getMotionProps()}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 100
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
