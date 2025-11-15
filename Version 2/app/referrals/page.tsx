import ReferralHero from '@/components/Referral/Hero'
import ReferralFormSection from '@/components/Referral/ReferralFormSection'
import AcceptedReferrals from '@/components/Referral/AcceptedReferrals'
import type { Metadata } from 'next'
import StepByStepProcess from '@/components/How We Work/StepByStepProcess'

export const metadata: Metadata = {
  title: 'Make a Referral - Emerge Family Support | Professional Referral Form',
  description: 'Professional referral form for Local Authorities, Education, Health professionals, Youth Justice and Probation teams. Submit family support referrals for trauma-informed interventions.',
  keywords: 'family support referral, social work referral, local authority referral, parenting assessment referral, therapeutic services referral, emergency family support',
  authors: [{ name: 'Emerge Family Support' }],
  openGraph: {
    title: 'Make a Referral - Emerge Family Support | Professional Referral Form',
    description: 'Professional referral form for Local Authorities and partner agencies. Submit family support referrals for trauma-informed interventions and assessments.',
    type: 'website',
    images: [
      {
        url: '/hero.jpg', 
        
        alt: 'Emerge Family Support - Professional Referrals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Make a Referral - Emerge Family Support',
    description: 'Professional referral form for Local Authorities and partner agencies for family support services.',
    images: ['/hero.jpg'],
  },
}

export default function ReferralPage() {
  return (
    <div>
      <ReferralHero />
      <AcceptedReferrals />
      <StepByStepProcess />
      <ReferralFormSection />
    </div>
  )
}