'use client';
import { trpc } from '@/trpc/client';
export function ClientGreeting() {
  const [data] = trpc.hello.useSuspenseQuery({ text: 'Amazon' });

  if (!data) return <div>Loading...</div>;

  return <div>Page Client says: {data.greeting}</div>;
}
