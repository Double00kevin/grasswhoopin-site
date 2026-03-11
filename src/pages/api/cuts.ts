import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') {
    return new Response('Unauthorized', { status: 401 });
  }

  const form     = await request.formData();
  const yardId   = form.get('yard_id')?.toString() ?? '';
  const priceRaw = form.get('price')?.toString().trim() || null;
  const price    = priceRaw ? parseFloat(priceRaw) : null;
  const notes    = form.get('notes')?.toString().trim() || null;

  if (!yardId) {
    return redirect('/admin?error=1', 303);
  }

  try {
    const db = locals.runtime.env.grasswhoopin_db;

    await db
      .prepare('INSERT INTO cuts (yard_id, price, notes) VALUES (?, ?, ?)')
      .bind(parseInt(yardId, 10), price, notes)
      .run();

    return redirect('/admin?whooped=1', 303);
  } catch (err) {
    console.error('[/api/cuts] POST error:', err);
    return redirect('/admin?error=1', 303);
  }
};
