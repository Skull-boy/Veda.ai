export default function Loading() {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="h-16 bg-white border-b border-surface-200" />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="h-48 skeleton rounded-16" />
        <div className="h-24 skeleton rounded-16" />
        <div className="h-64 skeleton rounded-16" />
        <div className="h-64 skeleton rounded-16" />
      </div>
    </div>
  );
}
