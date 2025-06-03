import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add CLERK_SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    );
  }

  try {
    const evt = await verifyWebhook(req, { signingSecret: SIGNING_SECRET });

    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, first_name, last_name, image_url } = evt.data;

      await db.insert(users).values({
        clerkId: id,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;

      if (!id) {
        console.error('Missing user id');
        return new Response('Missing user id', { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, id));
    }

    if (eventType === 'user.updated') {
      const { id, first_name, last_name, image_url } = evt.data;
      await db
        .update(users)
        .set({ name: `${first_name} ${last_name}`, imageUrl: image_url })
        .where(eq(users.clerkId, id));
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
