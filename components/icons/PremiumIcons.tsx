'use client'

import { 
  Building2, 
  GraduationCap, 
  Landmark,
  Users,
  TrendingUp,
  Award,
  Target,
  Handshake,
  Lightbulb,
  Globe,
  Briefcase,
  BookOpen,
  Heart,
  Shield,
  Megaphone,
  ChevronRight,
  Star,
  Sparkles,
  Trophy,
  Rocket,
  Brain,
  Eye,
  MessageSquare,
  Video,
  Mic,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'

// Category icons with premium styling
export const categoryIcons = {
  'Government': { icon: Landmark, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10' },
  'Business': { icon: Briefcase, color: 'from-purple-500 to-pink-600', bg: 'bg-purple-500/10' },
  'Education': { icon: GraduationCap, color: 'from-green-500 to-teal-600', bg: 'bg-green-500/10' },
  'Community': { icon: Users, color: 'from-orange-500 to-red-600', bg: 'bg-orange-500/10' },
  'Healthcare': { icon: Heart, color: 'from-red-500 to-pink-600', bg: 'bg-red-500/10' },
  'Tech & Innovation': { icon: Rocket, color: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-500/10' },
  'Non-profit': { icon: Handshake, color: 'from-yellow-500 to-orange-600', bg: 'bg-yellow-500/10' },
  'Media & Arts': { icon: Megaphone, color: 'from-pink-500 to-purple-600', bg: 'bg-pink-500/10' },
  'Finance': { icon: TrendingUp, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/10' },
  'Law & Legal': { icon: Shield, color: 'from-slate-500 to-gray-600', bg: 'bg-slate-500/10' }
}

export const purposeIcons = {
  'Document': { icon: BookOpen, label: 'Document Leadership' },
  'Connect': { icon: Handshake, label: 'Build Connections' },
  'Inspire': { icon: Lightbulb, label: 'Inspire Action' }
}

export const featureIcons = {
  'Video': Video,
  'Interview': Mic,
  'Schedule': Calendar,
  'Location': MapPin,
  'Time': Clock,
  'Verified': CheckCircle2,
  'Trending': TrendingUp,
  'Award': Trophy,
  'Star': Star,
  'Next': ArrowRight
}

// Animated icon wrapper
interface AnimatedIconProps {
  icon: React.ElementType
  className?: string
  gradient?: string
  size?: number
}

export function AnimatedIcon({ icon: Icon, className = '', gradient, size = 24 }: AnimatedIconProps) {
  return (
    <div className={`relative group ${className}`}>
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`} />
      )}
      <Icon size={size} className="relative z-10 transition-transform duration-300 group-hover:scale-110" />
    </div>
  )
}

// Premium badge component
export function PremiumBadge({ text, icon: Icon }: { text: string, icon?: React.ElementType }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full backdrop-blur-sm">
      {Icon && <Icon size={16} className="text-purple-400" />}
      <span className="text-sm font-medium text-purple-300">{text}</span>
      <Sparkles size={14} className="text-yellow-400 animate-pulse" />
    </div>
  )
}

// Section divider with gradient
export function SectionDivider({ type = 'gradient' }: { type?: 'gradient' | 'wave' | 'dots' }) {
  if (type === 'gradient') {
    return (
      <div className="relative h-32 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse" />
      </div>
    )
  }
  
  if (type === 'wave') {
    return (
      <div className="relative h-24 -mt-1">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-purple-500/5" />
        </svg>
      </div>
    )
  }
  
  // Dots pattern
  return (
    <div className="relative h-16 flex items-center justify-center">
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} 
            className="w-2 h-2 rounded-full bg-purple-500/20 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
