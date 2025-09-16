import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, Users, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/imoveis', label: 'Imóveis', icon: Home },
    { href: '/vendidos', label: 'Vendidos', icon: Users },
    { href: '/contato', label: 'Contato', icon: Users },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background-primary/95 backdrop-blur-sm border-b border-background-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-light rounded-lg flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">
              Imóveis Premium
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm">
              Falar Conosco
            </Button>
            <Button variant="primary" size="sm">
              Admin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-background-tertiary">
            <nav className="flex flex-col gap-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="flex flex-col gap-2 pt-4 border-t border-background-tertiary">
                <Button variant="outline" size="sm" className="justify-start">
                  Falar Conosco
                </Button>
                <Button variant="primary" size="sm" className="justify-start">
                  Admin
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}