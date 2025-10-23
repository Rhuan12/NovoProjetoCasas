import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'McSilva & Wiggit - Premium Real Estate',
  description: 'Experts in premium properties. Find your perfect home with our personalized service. Making dreams come true since 2014.',
  keywords: ['real estate', 'properties', 'houses', 'apartments', 'premium homes', 'luxury real estate'],
  authors: [{ name: 'McSilva & Wiggit' }],
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  
  openGraph: {
    title: 'McSilva & Wiggit - Premium Real Estate',
    description: 'Experts in premium properties. Find your perfect home with our personalized service.',
    type: 'website',
    locale: 'en_US',
    siteName: 'McSilva & Wiggit',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'McSilva & Wiggit Logo',
      },
    ],
  },
  
  twitter: {
    card: 'summary',
    title: 'McSilva & Wiggit - Premium Real Estate',
    description: 'Making dreams come true since 2014',
    images: ['/icon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PP72K9M6');`
        }} />
        {/* End Google Tag Manager */}

        {/* Meta Pixel Code */}
        <script dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2082436685850546');
fbq('track', 'PageView');
          `
        }} />
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2082436685850546&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PP72K9M6"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
