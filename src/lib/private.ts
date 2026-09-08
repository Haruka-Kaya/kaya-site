import type { AstroCookies } from 'astro';
import { COOKIE, privateHeaders, sessionOK } from './share';

/** 非公開ページの入口。共有パスワードのセッションを流用し、noindex と no-store を必ず付ける。
 *  認証していない間はページ本文を一切組み立てないこと (レスポンスに載ると意味がなくなる)。 */
export function privateGate(cookies: AstroCookies, headers: Headers): boolean {
  for (const [key, value] of Object.entries(privateHeaders)) headers.set(key, value);
  headers.set('Referrer-Policy', 'no-referrer');
  return sessionOK(cookies.get(COOKIE)?.value);
}
