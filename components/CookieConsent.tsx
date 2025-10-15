'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import { cookieConfig } from '@/lib/cookie-config'

// Custom CSS for purple theme
const customCSS = `
  #cc-main {
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
  }
  
  .cm, .pm {
    background: linear-gradient(to bottom, #1a1a1a, #000000) !important;
    border: 1px solid rgba(147, 51, 234, 0.3) !important;
    box-shadow: 0 20px 25px -5px rgba(147, 51, 234, 0.1), 0 10px 10px -5px rgba(147, 51, 234, 0.04) !important;
    max-width: 480px !important;
  }
  
  .cm__title, .pm__title {
    color: #fff !important;
    font-weight: 600 !important;
    font-size: 1.125rem !important;
  }
  
  .cm__desc, .pm__desc {
    color: rgba(255, 255, 255, 0.8) !important;
    font-size: 0.875rem !important;
    line-height: 1.5 !important;
  }
  
  .cm__btn, .pm__btn {
    border-radius: 0.5rem !important;
    font-weight: 500 !important;
    transition: all 0.3s !important;
    padding: 0.625rem 1.25rem !important;
    font-size: 0.875rem !important;
  }
  
  .cm__btn--primary, .pm__btn--primary {
    background: linear-gradient(to right, #6B46C1, #9333EA) !important;
    color: white !important;
    border: none !important;
    white-space: nowrap !important;
  }
  
  .cm__btn--primary:hover, .pm__btn--primary:hover {
    background: linear-gradient(to right, #4C1D95, #7E22CE) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.3) !important;
  }
  
  .cm__btn--secondary, .pm__btn--secondary {
    background: transparent !important;
    color: #9333EA !important;
    border: 1px solid #9333EA !important;
  }
  
  .cm__btn--secondary:hover, .pm__btn--secondary:hover {
    background: rgba(147, 51, 234, 0.1) !important;
    border-color: #6B46C1 !important;
  }
  
  .cm__btn--tertiary {
    background: rgba(255, 255, 255, 0.1) !important;
    color: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    white-space: nowrap !important;
  }
  
  .cm__btn--tertiary:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }
  
  .cm__footer {
    margin-top: 0.75rem !important;
    font-size: 0.75rem !important;
  }
  
  .section__toggle {
    background: #4C1D95 !important;
  }
  
  .section__toggle:checked ~ .toggle__icon {
    background: linear-gradient(to right, #6B46C1, #9333EA) !important;
  }
  
  .toggle__icon {
    background: rgba(255, 255, 255, 0.2) !important;
  }
  
  .toggle__icon-circle {
    background: white !important;
  }
  
  .pm__badge {
    background: linear-gradient(to right, #6B46C1, #9333EA) !important;
    color: white !important;
    padding: 2px 8px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    margin-left: 8px !important;
  }
  
  .section--toggle .section__title {
    color: #fff !important;
  }
  
  .section__desc {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  
  .pm__body {
    max-height: 70vh !important;
    overflow-y: auto !important;
  }
  
  .pm__body::-webkit-scrollbar {
    width: 8px !important;
  }
  
  .pm__body::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.5) !important;
  }
  
  .pm__body::-webkit-scrollbar-thumb {
    background: #6B46C1 !important;
    border-radius: 4px !important;
  }
  
  .pm__body::-webkit-scrollbar-thumb:hover {
    background: #9333EA !important;
  }
  
  table {
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }
  
  th {
    background: rgba(147, 51, 234, 0.2) !important;
    color: #fff !important;
    font-weight: 600 !important;
  }
  
  td {
    color: rgba(255, 255, 255, 0.8) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  a {
    color: #9333EA !important;
    text-decoration: none !important;
  }
  
  a:hover {
    color: #6B46C1 !important;
    text-decoration: underline !important;
  }
`

export default function CookieConsentComponent() {
  useEffect(() => {
    // Add custom styles
    const style = document.createElement('style')
    style.textContent = customCSS
    document.head.appendChild(style)
    
    // Initialize cookie consent
    CookieConsent.run(cookieConfig)
    
    // Clean up
    return () => {
      style.remove()
    }
  }, [])
  
  return null
}
