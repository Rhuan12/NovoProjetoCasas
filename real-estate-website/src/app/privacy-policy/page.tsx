import { Header } from '@/components/Header'
import { Shield } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy – MW Homes KC',
  description: 'How MW Homes KC collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />

      <div className="py-14 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/10 rounded-2xl mb-4">
              <Shield size={32} className="text-accent-primary" />
            </div>
            <p className="text-accent-primary font-bold text-xs uppercase tracking-widest mb-2">
              Legal
            </p>
            <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
            <p className="text-text-muted text-sm mt-2">
              MW Homes KC &nbsp;·&nbsp; Last updated: June 2025
            </p>
          </div>

          {/* Body */}
          <div className="space-y-10 text-text-secondary leading-relaxed">

            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">Information we collect</h2>
              <p>
                When you submit a maintenance request through our Resident Portal, we collect your
                phone number, property address, a description of the issue, your preferred visit
                time, and any photos you choose to upload. We do <strong className="text-text-primary">not</strong> require
                your name or email address to submit a request.
              </p>
              <p className="mt-3">
                We also automatically collect basic technical information — such as your IP address,
                browser type, device type, referring URL, and pages visited — through analytics
                tools including Google Tag Manager and Meta Pixel.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">How we use your information</h2>
              <p>
                We use the information you provide solely to process and respond to your maintenance
                request, schedule a visit, and coordinate repairs at your property. We use technical
                and analytics data to understand site performance, improve the resident experience,
                and measure the effectiveness of our outreach.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">Sharing your information</h2>
              <p>
                We do not sell your personal information. We share data only with service providers
                who help us operate our business — including our hosting provider (Supabase), analytics
                platforms (Google, Meta), and maintenance personnel who need access to your request
                details to complete the work. We may also disclose information if required by law.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">Data retention</h2>
              <p>
                Maintenance request records, including uploaded photos, are retained for as long as
                necessary to manage your tenancy and comply with applicable legal obligations. You
                may request deletion of your data at any time by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">Your choices</h2>
              <p>
                You may request access to, correction of, or deletion of your personal data at any
                time by contacting us at the information below. If you opt out of marketing
                communications, you can reply <strong className="text-text-primary">STOP</strong> to
                any text message from us.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-text-primary mb-3">Contact</h2>
              <p>
                If you have questions about this policy or wish to exercise your rights, please
                reach out to us:
              </p>
              <ul className="mt-3 space-y-1 text-text-muted text-sm">
                <li>
                  <span className="text-text-secondary font-medium">Phone: </span>
                  <a href="tel:+18168901804" className="text-accent-primary hover:underline">
                    (816) 890-1804
                  </a>
                </li>
                <li>
                  <span className="text-text-secondary font-medium">WhatsApp: </span>
                  <a
                    href="https://wa.me/18168901804"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:underline"
                  >
                    Chat with us
                  </a>
                </li>
                <li>
                  <span className="text-text-secondary font-medium">Location: </span>
                  Kansas City, MO
                </li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
