'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export interface StaggeredListProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  animationDuration?: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export default function StaggeredList({
  children,
  className = '',
  staggerDelay = 0.1,
  animationDuration = 0.5
}: StaggeredListProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={item}
          transition={{
            duration: animationDuration,
            delay: index * staggerDelay
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
