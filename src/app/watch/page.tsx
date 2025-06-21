import { Suspense } from 'react';
import WatchPageClient from "@/components/WatchPageClient";

export default function WatchPage({ searchParams }: { searchParams: { url?: string } }) {
  const videoUrl = searchParams.url || null;
  return (
    <Suspense fallback={<div>Loading Page...</div>}>
      <WatchPageClient videoUrl={videoUrl} />
    </Suspense>
  );
}