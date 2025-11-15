import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicesData, getServiceById } from '@/assets/services';
import ServiceDetails from '@/components/Services/ServiceDetails';

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    id: service.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);
  
  if (!service) {
    return {
      title: 'Service Not Found - Emerge Family Support',
    };
  }

  return {
    title: `${service.title} - Emerge Family Support`,
    description: service.shortDescription,
    keywords: service.features.join(', '),
    openGraph: {
      title: `${service.title} - Emerge Family Support`,
      description: service.shortDescription,
      type: 'website',
      images: [
        {
          url: service.image.src,
          alt: service.title,
        },
      ],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  const IconComponent = service.icon;
  const serviceForClient = {
    id: service.id,
    title: service.title,
    shortDescription: service.shortDescription,
    fullDescription: service.fullDescription,
    color: service.color,
    accentColor: service.accentColor,
    image: service.image,
    features: service.features,
    detailedFeatures: service.detailedFeatures,
    category: service.category,
    iconElement: <IconComponent className="h-6 w-6 text-white" />
  };

  return <ServiceDetails service={serviceForClient} />;
}