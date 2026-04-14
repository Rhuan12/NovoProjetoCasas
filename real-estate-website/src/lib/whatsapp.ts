// src/lib/whatsapp.ts - Utilitário completo para integração com WhatsApp

/**
 * Configuração do WhatsApp
 * ⚠️ IMPORTANTE: Adicione no .env.local:
 * NEXT_PUBLIC_WHATSAPP_NUMBER=18168901804
 */
export const WHATSAPP_CONFIG = {
  // Número no formato internacional (código país + DDD + número)
  // Sem espaços, hífens, parênteses ou outros caracteres
  number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '18168901804',
  
  // Mensagem padrão se não for especificada
  defaultMessage: 'Olá! Vim através do site e gostaria de mais informações.',
  
  // Configurações de formatação
  formatting: {
    useBold: true,
    useEmojis: true,
    useLineBreaks: true
  }
}

/**
 * Interface para dados de propriedade
 */
export interface PropertyData {
  id: string
  title: string
  price?: number | null
  city?: string | null
  neighborhood?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  area_sqm?: number | null
}

/**
 * Interface para dados do usuário
 */
export interface UserData {
  name: string
  email: string
  phone: string
  message?: string
}

/**
 * Formata preço em reais
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price) return 'Consultar'
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

/**
 * Gera URL completa do imóvel
 */
export function getPropertyUrl(propertyId: string): string {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL || 'https://imoveis-premium.com.br'
  
  return `${baseUrl}/imoveis/${propertyId}`
}

/**
 * Cria mensagem formatada para interesse em imóvel
 */
export function createPropertyInterestMessage(
  property: PropertyData,
  user: UserData
): string {
  const { useBold, useEmojis } = WHATSAPP_CONFIG.formatting
  
  const bold = (text: string) => useBold ? `*${text}*` : text
  const emoji = (icon: string) => useEmojis ? icon : ''
  
  const propertyUrl = getPropertyUrl(property.id)
  
  // Características do imóvel
  const features: string[] = []
  if (property.bedrooms) features.push(`${property.bedrooms} quartos`)
  if (property.bathrooms) features.push(`${property.bathrooms} banheiros`)
  if (property.area_sqm) features.push(`${property.area_sqm}m²`)
  const featuresText = features.join(' • ')
  
  // Localização
  const location = [property.neighborhood, property.city]
    .filter(Boolean)
    .join(', ')
  
  // Montar mensagem
  let message = `${emoji('🏠')} ${bold('TENHO INTERESSE NO IMÓVEL')}\n\n`
  
  message += `${emoji('📋')} ${bold('Dados do Imóvel:')}\n`
  message += `• ${bold('Título:')} ${property.title}\n`
  if (location) message += `• ${bold('Localização:')} ${location}\n`
  if (featuresText) message += `• ${bold('Características:')} ${featuresText}\n`
  if (property.price) message += `• ${bold('Valor:')} ${formatPrice(property.price)}\n`
  message += `• ${bold('Link:')} ${propertyUrl}\n\n`
  
  message += `${emoji('👤')} ${bold('Meus Dados:')}\n`
  message += `• ${bold('Nome:')} ${user.name}\n`
  message += `• ${bold('Email:')} ${user.email}\n`
  message += `• ${bold('Telefone:')} ${user.phone}\n\n`
  
  if (user.message?.trim()) {
    message += `${emoji('💬')} ${bold('Mensagem:')}\n${user.message}\n\n`
  }
  
  message += `Aguardo retorno para agendar uma visita! ${emoji('😊')}`
  
  return message
}

/**
 * Cria mensagem simples de interesse
 */
export function createSimpleInterestMessage(
  propertyTitle: string,
  propertyId: string
): string {
  const propertyUrl = getPropertyUrl(propertyId)
  const { useEmojis } = WHATSAPP_CONFIG.formatting
  const emoji = (icon: string) => useEmojis ? icon : ''
  
  return `${emoji('🏠')} Olá! Tenho interesse no imóvel "${propertyTitle}".\n\nLink: ${propertyUrl}\n\nPoderia me passar mais informações? ${emoji('😊')}`
}

/**
 * Cria mensagem para contato geral
 */
export function createGeneralContactMessage(
  name?: string,
  message?: string
): string {
  const { useEmojis } = WHATSAPP_CONFIG.formatting
  const emoji = (icon: string) => useEmojis ? icon : ''
  
  let msg = `${emoji('👋')} Olá! `
  
  if (name) {
    msg += `Meu nome é ${name}. `
  }
  
  if (message) {
    msg += `\n\n${message}`
  } else {
    msg += 'Gostaria de saber mais sobre os imóveis disponíveis.'
  }
  
  return msg
}

/**
 * Cria mensagem para agendamento de visita
 */
export function createVisitScheduleMessage(
  property: PropertyData,
  user: UserData,
  preferredDate?: string
): string {
  const { useBold, useEmojis } = WHATSAPP_CONFIG.formatting
  const bold = (text: string) => useBold ? `*${text}*` : text
  const emoji = (icon: string) => useEmojis ? icon : ''
  
  const propertyUrl = getPropertyUrl(property.id)
  
  let message = `${emoji('📅')} ${bold('AGENDAR VISITA')}\n\n`
  
  message += `${emoji('🏠')} ${bold('Imóvel:')}\n`
  message += `${property.title}\n`
  message += `${propertyUrl}\n\n`
  
  message += `${emoji('👤')} ${bold('Dados:')}\n`
  message += `• Nome: ${user.name}\n`
  message += `• Telefone: ${user.phone}\n`
  message += `• Email: ${user.email}\n\n`
  
  if (preferredDate) {
    message += `${emoji('🗓️')} ${bold('Data Preferencial:')}\n${preferredDate}\n\n`
  }
  
  message += `Gostaria de agendar uma visita ao imóvel. Qual o melhor horário? ${emoji('😊')}`
  
  return message
}

/**
 * Gera URL do WhatsApp com mensagem
 */
export function generateWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodedMessage}`
}

/**
 * Abre WhatsApp em nova janela
 */
export function openWhatsApp(message: string, newWindow: boolean = true): void {
  const url = generateWhatsAppUrl(message)
  
  if (newWindow) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    window.location.href = url
  }
}

/**
 * Hook personalizado para integração com WhatsApp (React)
 */
export function useWhatsApp() {
  const sendPropertyInterest = (property: PropertyData, user: UserData) => {
    const message = createPropertyInterestMessage(property, user)
    openWhatsApp(message)
  }
  
  const sendSimpleInterest = (propertyTitle: string, propertyId: string) => {
    const message = createSimpleInterestMessage(propertyTitle, propertyId)
    openWhatsApp(message)
  }
  
  const sendGeneralContact = (name?: string, message?: string) => {
    const msg = createGeneralContactMessage(name, message)
    openWhatsApp(msg)
  }
  
  const scheduleVisit = (
    property: PropertyData, 
    user: UserData, 
    preferredDate?: string
  ) => {
    const message = createVisitScheduleMessage(property, user, preferredDate)
    openWhatsApp(message)
  }
  
  return {
    sendPropertyInterest,
    sendSimpleInterest,
    sendGeneralContact,
    scheduleVisit,
    openWhatsApp
  }
}

/**
 * Utilitários para formatação de texto WhatsApp
 */
export const WhatsAppFormatter = {
  bold: (text: string) => `*${text}*`,
  italic: (text: string) => `_${text}_`,
  strikethrough: (text: string) => `~${text}~`,
  monospace: (text: string) => `\`\`\`${text}\`\`\``,
  lineBreak: () => '\n',
  doubleLineBreak: () => '\n\n',
  
  // Lista formatada
  list: (items: string[]) => items.map(item => `• ${item}`).join('\n'),
  
  // Seção com título
  section: (title: string, content: string) => `*${title}*\n${content}\n\n`,
  
  // Link formatado
  link: (text: string, url: string) => `${text}: ${url}`
}

/**
 * Exemplos de uso:
 * 
 * // 1. Enviar interesse em imóvel
 * const message = createPropertyInterestMessage(property, userData)
 * openWhatsApp(message)
 * 
 * // 2. Usando o hook
 * const { sendPropertyInterest } = useWhatsApp()
 * sendPropertyInterest(property, userData)
 * 
 * // 3. Mensagem simples
 * const simpleMsg = createSimpleInterestMessage(property.title, property.id)
 * openWhatsApp(simpleMsg)
 * 
 * // 4. Formatação customizada
 * const customMsg = [
 *   WhatsAppFormatter.bold('INTERESSE EM IMÓVEL'),
 *   WhatsAppFormatter.doubleLineBreak(),
 *   WhatsAppFormatter.section('Dados', 'Nome: João\nTelefone: (11) 99999-9999'),
 *   WhatsAppFormatter.link('Ver imóvel', 'https://...')
 * ].join('')
 */