'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { 
  Menu, 
  X, 
  Phone, 
  MessageCircle,
  Home,
  Search
} from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Detect scroll to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { 
      href: '/', 
      label: 'Home', 
      icon: Home,
      description: 'Homepage'
    },
    { 
      href: '/imoveis', 
      label: 'Properties', 
      icon: Search,
      description: 'View all properties'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background-primary/40 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20' 
          : 'bg-background-primary/20 backdrop-blur-md border-b border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo - ✨ AUMENTADO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-16 h-16 md:w-20 md:h-20 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="McSilva & Wiggit Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gradient">
                  McSilva & Wiggit
                </span>
                <div className="text-xs text-text-muted">
                  Making dreams come true since 2014
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-200 group ${
                      active 
                        ? 'text-accent-primary bg-accent-primary/10' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon size={16} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-background-secondary border border-background-tertiary rounded-lg px-3 py-2 text-sm text-text-primary whitespace-nowrap shadow-lg">
                        {item.description}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background-secondary border-l border-t border-background-tertiary rotate-45"></div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => window.open('https://wa.me/18168901804', '_blank')}
              >
                <MessageCircle size={16} />
                WhatsApp
              </Button>
              
              <Button 
                size="sm" 
                className="gap-2"
                onClick={() => window.open('tel:+18168901804', '_self')}
              >
                <Phone size={16} />
                +1 (816) 890-1804
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden pb-6 border-t border-background-tertiary mt-4 pt-4">
              <nav className="flex flex-col gap-2 mb-6">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-accent-primary text-white'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent size={18} />
                      <div className="flex-1">
                        <div className={`font-medium ${active ? 'text-white' : 'text-text-primary'}`}>
                          {item.label}
                        </div>
                        <div className={`text-sm ${active ? 'text-white/80' : 'text-text-muted'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
              
              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 px-4">
                <Button 
                  variant="outline" 
                  className="justify-start gap-3"
                  onClick={() => {
                    window.open('https://wa.me/18168901804', '_blank')
                    setIsMenuOpen(false)
                  }}
                >
                  <MessageCircle size={16} />
                  Chat on WhatsApp
                </Button>
                
                <Button 
                  className="justify-start gap-3"
                  onClick={() => {
                    window.open('tel:+18168901804', '_self')
                    setIsMenuOpen(false)
                  }}
                >
                  <Phone size={16} />
                  Call: +1 (816) 890-1804
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for sticky header */}
      {isScrolled && <div className="h-0"></div>}
    </>
  )
}