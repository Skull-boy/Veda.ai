import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 px-6 text-center">
      <div className="w-16 h-16 bg-brand-100 rounded-24 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L24 7.5V20.5L14 26L4 20.5V7.5L14 2Z" stroke="#4a54ec" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M14 10V16M14 19V20" stroke="#4a54ec" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h1 className="font-display font-bold text-3xl text-ink-900 mb-2">Page not found</h1>
      <p className="text-ink-500 font-sans mb-8 max-w-xs">
        The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
