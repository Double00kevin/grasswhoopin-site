import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') {
    return new Response('Unauthorized', { status: 401 });
  }

  const form = await request.formData();
  const name      = form.get('name')?.toString().trim() ?? '';
  const address   = form.get('address')?.toString().trim() ?? '';
  const phone     = form.get('phone')?.toString().trim() || null;
  const frequency = form.get('frequency')?.toString() ?? 'weekly';
  const notes     = form.get('notes')?.toString().trim() || null;

  if (!name || !address) {
    return redirect('/admin?error=1', 303);
  }

  const db = locals.runtime.env.grasswhoopin_db;

  await db
    .prepare('INSERT INTO customers (name, address, phone, frequency, notes) VALUES (?, ?, ?, ?, ?)')
    .bind(name, address, phone, frequency, notes)
    .run();

  return redirect('/admin?added=1', 303);
};
