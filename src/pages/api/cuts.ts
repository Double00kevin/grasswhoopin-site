import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') {
    return new Response('Unauthorized', { status: 401 });
  }

  const form = await request.formData();
  const customerId = form.get('customer_id')?.toString() ?? '';
  const notes      = form.get('notes')?.toString().trim() || null;

  if (!customerId) {
    return redirect('/admin?error=1', 303);
  }

  const db = locals.runtime.env.grasswhoopin_db;

  await db
    .prepare('INSERT INTO cuts (customer_id, notes) VALUES (?, ?)')
    .bind(parseInt(customerId, 10), notes)
    .run();

  return redirect('/admin?whooped=1', 303);
};
