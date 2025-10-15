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

  // Call all hooks unconditionally to follow React hooks rules
  const verticalTransform = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed])
  const horizontalTransform = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed])
  const zoomTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2])
  const rotateTransform = useTransform(scrollYProgress, [0, 1], [-5, 5])

  // Select which transform to use based on type
  let transformValue: MotionValue<any>
  switch (type) {
    case 'vertical':
      transformValue = verticalTransform
      break
    case 'horizontal':
      transformValue = horizontalTransform
      break
    case 'zoom':
      transformValue = zoomTransform
      break
    case 'rotate':
      transformValue = rotateTransform
      break
    default:
      transformValue = verticalTransform
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
