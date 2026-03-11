import type { APIRoute } from 'astro';

function unauthorized() {
  return new Response('Unauthorized', { status: 401 });
}

function badRequest(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

function ok() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const form        = await request.formData();
  const customer_id = form.get('customer_id')?.toString() ?? '';
  const address     = form.get('address')?.toString().trim() ?? '';
  const label       = form.get('label')?.toString().trim() || null;
  const frequency   = form.get('frequency')?.toString() ?? 'weekly';
  const quotedRaw   = form.get('quoted_price')?.toString().trim() || null;
  const quoted_price = quotedRaw ? parseFloat(quotedRaw) : null;

  if (!customer_id || !address) return redirect('/admin?error=1', 303);

  const db = locals.runtime.env.grasswhoopin_db;
  await db
    .prepare('INSERT INTO yards (customer_id, label, address, frequency, quoted_price) VALUES (?, ?, ?, ?, ?)')
    .bind(parseInt(customer_id, 10), label, address, frequency, quoted_price)
    .run();

  return redirect('/admin?added=1', 303);
};

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const id     = new URL(request.url).searchParams.get('id');
  const yardId = id ? parseInt(id, 10) : NaN;
  if (!id || isNaN(yardId)) return badRequest('Missing or invalid id');

  const form        = await request.formData();
  const address     = form.get('address')?.toString().trim() ?? '';
  const label       = form.get('label')?.toString().trim() || null;
  const frequency   = form.get('frequency')?.toString() ?? 'weekly';
  const quotedRaw   = form.get('quoted_price')?.toString().trim() || null;
  const quoted_price = quotedRaw ? parseFloat(quotedRaw) : null;

  if (!address) return badRequest('Address required');

  const db = locals.runtime.env.grasswhoopin_db;
  await db
    .prepare('UPDATE yards SET label = ?, address = ?, frequency = ?, quoted_price = ? WHERE id = ?')
    .bind(label, address, frequency, quoted_price, yardId)
    .run();

  return ok();
};

export const DELETE: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const id     = new URL(request.url).searchParams.get('id');
  const yardId = id ? parseInt(id, 10) : NaN;
  if (!id || isNaN(yardId)) return badRequest('Missing or invalid id');

  const db = locals.runtime.env.grasswhoopin_db;
  await db.prepare('UPDATE yards SET active = 0 WHERE id = ?').bind(yardId).run();

  return ok();
};

export const PATCH: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const id     = new URL(request.url).searchParams.get('id');
  const yardId = id ? parseInt(id, 10) : NaN;
  if (!id || isNaN(yardId)) return badRequest('Missing or invalid id');

  const db = locals.runtime.env.grasswhoopin_db;
  await db.prepare('UPDATE yards SET active = 1 WHERE id = ?').bind(yardId).run();

  return ok();
};
