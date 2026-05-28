import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Assessment — VedaAI',
  description: 'Create a new AI-powered assessment',
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
