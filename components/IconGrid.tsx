'use client'

import { createElement } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Building2, 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Award,
  TrendingUp,
  Globe,
  Lightbulb,
  Target,
  Zap,
  Shield
} from 'lucide-react'
import { IconType } from 'react-icons'
import { 
  FaChartLine, 
  FaHandshake, 
  FaRocket, 
  FaUsers,
  FaLightbulb,
  FaGlobe
} from 'react-icons/fa'

interface IconItem {
  icon: React.ElementType
  title: string
  description: string
  color: string
}

const iconItems: IconItem[] = [
  {
    icon: Users,
    title: 'Community Leaders',
    description: 'Connecting with local change-makers',
    color: 'from-purple-500 to-purple-700'
  },
  {
    icon: Building2,
    title: 'Business Executives',
    description: 'Fortune 500 and startup founders',
    color: 'from-purple-600 to-purple-800'
  },
  {
    icon: GraduationCap,
    title: 'Education Pioneers',
    description: 'University presidents and innovators',
    color: 'from-purple-500 to-purple-700'
  },
  {
    icon: Heart,
    title: 'Non-Profit Heroes',
    description: 'Making a difference every day',
    color: 'from-purple-600 to-purple-800'
  },
  {
    icon: Briefcase,
    title: 'Government Officials',
    description: 'Shaping policy and progress',
    color: 'from-purple-500 to-purple-700'
  },
  {
    icon: Award,
    title: 'Award Winners',
    description: 'Recognized excellence in leadership',
    color: 'from-purple-600 to-purple-800'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12
    }
  }
}

export default function IconGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {iconItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10"
                 style={{
                   backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                 }}
            />
            <div className="glass-effect rounded-xl p-6 h-full border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`w-16 h-16 rounded-lg bg-gradient-to-br ${item.color} p-3 mb-4`}
              >
                {createElement(item.icon, { className: "w-full h-full text-white" })}
              </motion.div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
              
              <motion.div
                className="mt-4 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                <span className="text-sm font-medium">Learn more</span>
                <Zap className="w-4 h-4 ml-2" />
              </motion.div>
            </div>
          </motion.div>
        ))}
    </motion.div>
  )
}
