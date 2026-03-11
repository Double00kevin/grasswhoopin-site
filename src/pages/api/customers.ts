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

export const DELETE: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const id         = new URL(request.url).searchParams.get('id');
  const customerId = id ? parseInt(id, 10) : NaN;
  if (!id || isNaN(customerId)) return badRequest('Missing or invalid id');

  const db = locals.runtime.env.grasswhoopin_db;
  await db.prepare('UPDATE customers SET active = 0 WHERE id = ?').bind(customerId).run();

  return ok();
};

export const PATCH: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const id         = new URL(request.url).searchParams.get('id');
  const customerId = id ? parseInt(id, 10) : NaN;
  if (!id || isNaN(customerId)) return badRequest('Missing or invalid id');

  const db = locals.runtime.env.grasswhoopin_db;
  await db.prepare('UPDATE customers SET active = 1 WHERE id = ?').bind(customerId).run();

  return ok();
};

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
  if (cookies.get('gw_admin')?.value !== 'authorized') return unauthorized();

  const id         = new URL(request.url).searchParams.get('id');
  const customerId = id ? parseInt(id, 10) : NaN;
  if (!id || isNaN(customerId)) return badRequest('Missing or invalid id');

  const form  = await request.formData();
  const name  = form.get('name')?.toString().trim() ?? '';
  const phone = form.get('phone')?.toString().trim() || null;
  const notes = form.get('notes')?.toString().trim() || null;

  if (!name) return badRequest('Name required');

  const db = locals.runtime.env.grasswhoopin_db;
  await db
    .prepare('UPDATE customers SET name = ?, phone = ?, notes = ? WHERE id = ?')
    .bind(name, phone, notes, customerId)
    .run();

  return ok();
};
