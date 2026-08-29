import type { Metadata } from 'next';
import './globals.css';

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3000'),
);

export const metadata: Metadata = {
  metadataBase,
  title: 'UCL Distance Learning | Student Learning Environment',
  description: 'A university distance-learning environment for modules, assessments, live teaching and academic support.',
  openGraph: {
    title: 'UCL Distance Learning',
    description: 'A reliable student learning environment for university study.',
    type: 'website',
    images: [{ url: '/ucl-logo.png', width: 1269, height: 492, alt: 'University College London' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UCL Distance Learning',
    description: 'A reliable student learning environment for university study.',
    images: ['/ucl-logo.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
