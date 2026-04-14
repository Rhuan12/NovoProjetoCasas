'use client'

import { Header } from '@/components/Header'
import { AboutOwners } from '@/components/AboutOwners'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { Phone, Mail, MapPin, MessageCircle, Building, Heart, Shield, Award } from 'lucide-react'
import Image from 'next/image'

export default function WhoWeArePage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />

      {/* HERO */}
      <section className="bg-background-primary px-4 py-16 flex flex-col items-center text-center gap-6">
        <Image
          src="/logo-cara.png"
          alt="McSilva & Wiggit"
          width={200}
          height={200}
          className="mx-auto"
          priority
          unoptimized
        />
        <h1 className="text-3xl md:text-5xl font-bold text-accent-primary leading-tight">
          Who We Are
        </h1>
        <p className="text-base md:text-lg text-primary/80 max-w-xl">
          A story of dedication, professionalism and commitment to making dreams come true.
        </p>
      </section>

      {/* OWNERS — sem cabeçalho duplicado */}
      <AboutOwners showHeader={false} />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
            <Building size={40} className="text-black" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent-primary mb-6">
            Ready to Find<br />Your Dream Home?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Contact us now and discover how we can help you to find your next residence!
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 border-2 border-white/30 rounded-full p-2">
            <a
              href="https://wa.me/18168901804"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent-primary text-black px-6 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors w-full sm:w-auto"
            >
              <MessageCircle size={18} />
              WhatsApp: +1 (816) 890-1804
            </a>
            <a
              href="tel:+18168901804"
              className="inline-flex items-center justify-center gap-2 bg-accent-primary text-black px-6 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors w-full sm:w-auto"
            >
              <Phone size={18} />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-48 h-48 border-4 border-white/10 rounded-[3rem] -translate-x-24 -translate-y-24" />
        <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-white/10 rounded-[3rem] translate-x-32 translate-y-32" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12 pb-12 border-b border-white/10">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <a href="tel:+18168901804" className="text-base">+1 (816) 890-1804</a>
              </div>
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <a href="mailto:marketingmwhomes@gmail.com" className="text-base">
                  marketingmwhomes@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-base">800 E 101st Terrace</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Building size={28} className="text-accent-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-accent-primary">MCSILVA & WIGGIT</h3>
                </div>
                <p className="text-sm text-white/60">Making dreams come true since 2014</p>
              </div>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-white/20 rounded-2xl px-8 py-5 text-center backdrop-blur-sm bg-white/5">
              <p className="text-white/90 text-sm font-medium">
                © 2024 McSilva & Wiggit. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
