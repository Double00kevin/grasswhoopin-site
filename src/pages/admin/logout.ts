import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ cookies, redirect }) => {
  cookies.delete('gw_admin', { path: '/' });
  return redirect('/login', 302);
};
