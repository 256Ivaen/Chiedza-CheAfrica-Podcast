import ContactHero from '@/components/Contact/Hero'
import ContactFormSection from '@/components/Contact/GeneralContactForm'
import type { Metadata } from 'next'
import FAQPage from '@/components/ui components/FAQs'

export const metadata: Metadata = {
  title: 'Contact Us - Emerge Family Support | Get in Touch',
  description: 'Contact Emerge Family Support for general inquiries, family support information, or partnership opportunities. 24/7 trauma-informed family support services across the UK.',
  keywords: 'contact family support, emerge contact, trauma-informed support, family help, social work inquiries, partnership opportunities, family services contact',
  authors: [{ name: 'Emerge Family Support' }],
  openGraph: {
    title: 'Contact Us - Emerge Family Support | Get in Touch',
    description: 'Get in touch with Emerge Family Support for general inquiries, family support information, or partnership opportunities. We operate 24/7 across the community.',
    type: 'website',
    images: [
      {
        url: '/hero.jpg', 
        
        alt: 'Emerge Family Support - Contact Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Emerge Family Support',
    description: 'Get in touch for general inquiries, family support information, or partnership opportunities with our trauma-informed service.',
    images: ['/hero.jpg'],
  },
}

export default function ContactPage() {
  return (
    <div>
      <ContactHero />
      <ContactFormSection />
      <FAQPage />
    </div>
  )
}