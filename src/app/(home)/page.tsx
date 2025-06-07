import { HydrateClient, trpc } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import { ClientGreeting } from './client';
import { Suspense } from 'react';

export default async function Home() {
  void trpc.hello.prefetch({ text: 'Amazon' });

  return (
    <HydrateClient>
      <div>...</div>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense>
          <ClientGreeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
