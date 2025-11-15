import FlexibleTimelines from '@/components/How We Work/FlexibleTimelines'
import HowWeWorkHero from '@/components/How We Work/Hero'
import OurCorePrinciples from '@/components/How We Work/OurCorePrinciples'
import ProcessCTASection from '@/components/How We Work/ProcessCTASection'
import StepByStepProcess from '@/components/How We Work/StepByStepProcess'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How We Work - Emerge Family Support | Our Process & Approach',
  description: 'Learn about our structured process for family support - from referral to sustainable outcomes. Transparent, trauma-informed approach with social-work-led oversight and evidence-based interventions.',
  keywords: 'family support process, referral process, social work assessment, trauma-informed approach, family intervention, therapeutic process, support timeline, safeguarding, clinical supervision, outcomes monitoring',
  authors: [{ name: 'Emerge Family Support' }],
  openGraph: {
    title: 'How We Work - Emerge Family Support | Our Process & Approach',
    description: 'Learn about our structured process for family support - from referral to sustainable outcomes. Transparent, trauma-informed approach with social-work-led oversight.',
    type: 'website',
    images: [
      {
        url: '/hero.jpg', 
        
        alt: 'Emerge Family Support - How We Work Process',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How We Work - Emerge Family Support',
    description: 'Structured process for family support with transparent, trauma-informed approach and social-work-led oversight.',
    images: ['/hero.jpg'],
  },
}

export default function HowWeWorkPage() {
  return (
    <div>
      <HowWeWorkHero />
      <OurCorePrinciples/>
      <StepByStepProcess/>
      <ProcessCTASection/>
      <FlexibleTimelines/>
    </div>
  )
}