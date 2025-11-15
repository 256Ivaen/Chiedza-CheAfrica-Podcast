import type { Metadata } from 'next'
import Hero from '../components/Home/Hero'
import FAQWithSpiral from '@/components/ui components/FAQs'
import AboutSection from '@/components/Home/About'
import ServicesSection from '@/components/Home/Services'
import OurManagement from '@/components/Home/OurManagement'

export const metadata: Metadata = {
  title: 'Emerge Family Support - Specialist Family Support & Therapeutic Services',
  description: 'Social-work-led, trauma-informed family support services. Strengthening families, reducing risk, and preventing escalation into statutory care. 24/7 community-based interventions across the UK.',
  keywords: 'family support, parenting assessments, therapeutic services, children with disabilities, trauma-informed care, social work, family assessment, PAMs assessment, ParentAssess, CUBAS, kinship assessments, SGO, fostering assessments, adoption assessments, reverse parenting, family therapy, disability support, respite care, contact supervision, emergency response, family crisis support',
  authors: [{ name: 'Emerge Family Support' }],
  creator: 'Emerge Family Support',
  publisher: 'Emerge Family Support',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Emerge Family Support - Specialist Family Support & Therapeutic Services',
    description: 'Children at the Centre — Families Empowered to Thrive. Social-work-led, trauma-informed family support services across the UK.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Emerge Family Support',
    images: [
      {
        url: '/hero.jpg', 
        
        alt: 'Emerge Family Support - Children at the Centre — Families Empowered to Thrive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emerge Family Support - Specialist Family Support & Therapeutic Services',
    description: 'Social-work-led, trauma-informed family support services. Strengthening families, reducing risk across the UK.',
    images: ['/hero.jpg'],
    creator: '@EmergeFamilySupport',
  },
  alternates: {
    canonical: 'https://emergefamilysupport.co.uk',
  },
  category: 'Social Services',
  classification: 'Family Support Services, Therapeutic Interventions, Social Work',
}

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <OurManagement />
      <FAQWithSpiral />
    </div>
  )
}