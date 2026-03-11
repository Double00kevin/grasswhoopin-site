// MANUAL PAYMENT LOGGING ONLY — no cards, no processors
// Records cash, check, Venmo, Zelle, or any offline payment against a customer account.

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  console.log('=== PAYMENTS API CALLED ===', request.url);

  if (cookies.get('gw_admin')?.value !== 'authorized') {
    return new Response('Unauthorized', { status: 401 });
  }

  const form       = await request.formData();
  const customerId = form.get('customer_id')?.toString() ?? '';
  const amountRaw  = form.get('amount')?.toString().trim() ?? '';
  const amount     = parseFloat(amountRaw);
  const notes      = form.get('notes')?.toString().trim() || null;

  if (!customerId || !amountRaw || isNaN(amount) || amount <= 0) {
    return redirect('/admin?error=1', 303);
  }

  try {
    const db = locals.runtime.env.grasswhoopin_db;

    await db
      .prepare('INSERT INTO payments (customer_id, amount, notes) VALUES (?, ?, ?)')
      .bind(parseInt(customerId, 10), amount, notes)
      .run();

    return redirect('/admin?payment=1', 303);
  } catch (err) {
    console.error('PAYMENTS API ERROR:', (err as any)?.message || String(err));
    if ((err as any)?.cause) console.error('Cause:', (err as any).cause);
    return redirect('/admin?error=1', 303);
  }
};
