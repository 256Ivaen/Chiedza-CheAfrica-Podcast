import AllServicesSection from '@/components/Services/AllServicesSection'
import ServicesHero from '@/components/Services/Hero'
import { ServicesIntroCard } from '@/components/Services/ServicesIntroSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services - Emerge Family Support | Specialist Family Support & Therapeutic Services',
  description: 'Comprehensive family support services including parenting assessments, therapeutic interventions, disability support, and auxiliary services. Social-work-led, trauma-informed care across the UK.',
  keywords: 'family assessments, parenting assessments, PAMs assessment, ParentAssess, CUBAS, therapeutic services, disability support, respite care, contact supervision, kinship assessments, SGO, fostering assessments, reverse parenting, family therapy, trauma-informed care',
  authors: [{ name: 'Emerge Family Support' }],
  openGraph: {
    title: 'Our Services - Emerge Family Support | Specialist Family Support & Therapeutic Services',
    description: 'Comprehensive family support services including parenting assessments, therapeutic interventions, disability support, and auxiliary services.',
    type: 'website',
    images: [
      {
        url: '/hero.jpg', 
        
        alt: 'Emerge Family Support Services - Comprehensive Family Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services - Emerge Family Support',
    description: 'Social-work-led family support services including assessments, therapeutic interventions, and disability support.',
    images: ['/hero.jpg'],
  },
}

export default function ServicesPage() {
  return (
    <div>
      <ServicesHero />
      <ServicesIntroCard />
      <AllServicesSection />
    </div>
  )
}