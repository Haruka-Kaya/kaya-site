import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ redirect }) => redirect('/share/ai.html', 302);
