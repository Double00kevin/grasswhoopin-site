import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') {
    return new Response('Unauthorized', { status: 401 });
  }

  const form          = await request.formData();
  const name          = form.get('name')?.toString().trim() ?? '';
  const phone         = form.get('phone')?.toString().trim() || null;
  const customer_notes = form.get('customer_notes')?.toString().trim() || null;
  const address       = form.get('address')?.toString().trim() ?? '';
  const label         = form.get('label')?.toString().trim() || null;
  const frequency     = form.get('frequency')?.toString() ?? 'weekly';
  const quotedRaw     = form.get('quoted_price')?.toString().trim() || null;
  const quoted_price  = quotedRaw ? parseFloat(quotedRaw) : null;

  if (!name || !address) return redirect('/admin?error=1', 303);

  const db = locals.runtime.env.grasswhoopin_db;

  const customerResult = await db
    .prepare('INSERT INTO customers (name, phone, notes) VALUES (?, ?, ?)')
    .bind(name, phone, customer_notes)
    .run();

  const customerId = customerResult.meta.last_row_id;

  await db
    .prepare('INSERT INTO yards (customer_id, label, address, frequency, quoted_price) VALUES (?, ?, ?, ?, ?)')
    .bind(customerId, label, address, frequency, quoted_price)
    .run();

  return redirect('/admin?added=1', 303);
};
