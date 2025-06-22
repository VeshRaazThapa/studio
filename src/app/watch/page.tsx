import { Suspense } from 'react';
import WatchPageClient from "@/components/WatchPageClient";

export default async function WatchPage({ searchParams }: { searchParams: Promise<{ url?: string }> }) {
  const params = await searchParams;
  const videoUrl = params.url || null;
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <WatchPageClient videoUrl={videoUrl} />
    </Suspense>
  );
}