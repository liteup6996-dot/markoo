import type { Metadata } from 'next';
import './globals.css';

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3000'),
);

export const metadata: Metadata = {
  metadataBase,
  title: 'Campus Learning | Distance Learning LMS',
  description: 'A university-grade distance-learning environment for modules, assessments, live teaching and academic support.',
  openGraph: {
    title: 'Campus Learning',
    description: 'A reliable distance-learning environment for university study.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Campus Learning — Distance Learning Environment' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Learning',
    description: 'A reliable distance-learning environment for university study.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
