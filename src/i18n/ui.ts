export const locales = ['ja', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'ja';

export const ui = {
  ja: {
    'site.tagline': 'Security researcher & maker',
    'nav.about': 'プロフィール',
    'nav.security': 'セキュリティ',
    'nav.writeups': 'Writeups',
    'nav.projects': '作ったもの',
    'nav.interests': '好きなこと',
    'nav.contact': '連絡先',
    'nav.menu': 'メニュー',
    'nav.close': '閉じる',
    'nav.home': 'トップページ',
    'nav.switchLang': 'English',
    'nav.switchLangLabel': '英語版に切り替える',
    'nav.theme': 'テーマを切り替える',
    'skip': '本文へ移動',
    'newTab': '（新しいタブで開きます）',
    'hero.eyebrow': 'Profile',
    'hero.cta.writeups': 'Writeupsを読む',
    'hero.cta.security': '調査について',
    'hero.cta.contact': '連絡する',
    'hero.scroll': 'Scroll',
    'about.eyebrow': 'About',
    'about.heading': '作る目と、壊れ方を見る目。',
    'about.now': 'いま取り組んでいること',
    'about.location': '拠点',
    'security.eyebrow': 'Security research',
    'security.heading': '境界を見つけ、再現して確かめる。',
    'security.focus': 'Current focus',
    'security.areas': 'areas',
    'security.process': '調査で大切にしていること',
    'security.hackerone': 'HackerOneのプロフィールを見る',
    'security.disclosure': 'Responsible disclosure',
    'writeups.eyebrow': 'Writeups',
    'writeups.heading': '調べたことを、読める形に。',
    'writeups.intro': 'HackerOneでの報告の考え方、調査手順、作ったものの記録をまとめています。',
    'writeups.all': 'すべての記事',
    'writeups.read': '読む',
    'writeups.empty': '記事はまだありません。',
    'writeups.back': 'Writeups一覧へ',
    'writeups.published': '公開日',
    'writeups.readingTime': '約{n}分',
    'writeups.otherLang': 'この記事は英語版があります',
    'writeups.count': '{n}件',
    'projects.eyebrow': 'Projects',
    'projects.heading': '調べるための道具も、自分で作る。',
    'projects.intro': 'セキュリティ調査のための仕組みから、身近な人が使う小さな道具まで。実際に動かしながら、少しずつ育てています。',
    'projects.all': 'すべてのプロジェクト',
    'projects.github': 'GitHubで見る',
    'projects.internal': '内部プロジェクト',
    'projects.stack': '使っている技術',
    'projects.back': 'トップページへ',
    'interests.eyebrow': 'Interests',
    'interests.heading': '画面の外でも、仕組みを触る。',
    'interests.intro': 'ドローン、Linux、電子工作、無線、AI、スキー。ひとつの興味から次へ、手を動かしながら広がってきました。',
    'interests.more': 'もう少し詳しく',
    'interests.back': '好きなこと一覧へ',
    'interests.others': 'ほかの好きなことも、トップページにまとめています。',
    'interests.list': '一覧を見る',
    'contact.eyebrow': 'Contact',
    'contact.heading': '気軽に声をかけてください。',
    'contact.text': 'セキュリティの調査、作っているもの、好きなことの話ができたらうれしいです。',
    'contact.hackerone': 'HackerOne',
    'contact.email': 'メールを送る',
    'contact.github': 'GitHub',
    'contact.twitter': 'X',
    'footer.top': 'ページの上へ',
    'footer.built': 'Astro + Keystatic で作っています',
    'notFound.title': 'ページが見つかりません',
    'notFound.text': 'お探しのページは移動したか、削除された可能性があります。',
    'notFound.home': 'トップページへ戻る',
  },
  en: {
    'site.tagline': 'Security researcher & maker',
    'nav.about': 'Profile',
    'nav.security': 'Security',
    'nav.writeups': 'Writeups',
    'nav.projects': 'Projects',
    'nav.interests': 'Interests',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.home': 'Home',
    'nav.switchLang': '日本語',
    'nav.switchLangLabel': 'Switch to Japanese',
    'nav.theme': 'Toggle theme',
    'skip': 'Skip to content',
    'newTab': ' (opens in a new tab)',
    'hero.eyebrow': 'Profile',
    'hero.cta.writeups': 'Read writeups',
    'hero.cta.security': 'How I research',
    'hero.cta.contact': 'Get in touch',
    'hero.scroll': 'Scroll',
    'about.eyebrow': 'About',
    'about.heading': 'An eye for building, and an eye for how things break.',
    'about.now': 'Currently working on',
    'about.location': 'Based in',
    'security.eyebrow': 'Security research',
    'security.heading': 'Find the boundary, reproduce it, verify it.',
    'security.focus': 'Current focus',
    'security.areas': 'areas',
    'security.process': 'How I approach research',
    'security.hackerone': 'View my HackerOne profile',
    'security.disclosure': 'Responsible disclosure',
    'writeups.eyebrow': 'Writeups',
    'writeups.heading': 'Turning research into something readable.',
    'writeups.intro': 'How I think about HackerOne reports, research procedures, and notes from building things.',
    'writeups.all': 'All writeups',
    'writeups.read': 'Read',
    'writeups.empty': 'No writeups yet.',
    'writeups.back': 'Back to writeups',
    'writeups.published': 'Published',
    'writeups.readingTime': '{n} min read',
    'writeups.otherLang': 'This post is also available in Japanese',
    'writeups.count': '{n} posts',
    'projects.eyebrow': 'Projects',
    'projects.heading': 'I build the tools I research with.',
    'projects.intro': 'From research infrastructure to small tools for people around me, each one grows while it is being used.',
    'projects.all': 'All projects',
    'projects.github': 'View on GitHub',
    'projects.internal': 'Internal project',
    'projects.stack': 'Tech stack',
    'projects.back': 'Back to home',
    'interests.eyebrow': 'Interests',
    'interests.heading': 'Touching systems, away from the screen too.',
    'interests.intro': 'Drones, Linux, electronics, radio, AI, skiing. One interest led to the next, always hands-on.',
    'interests.more': 'Read more',
    'interests.back': 'Back to interests',
    'interests.others': 'The other interests are collected on the home page.',
    'interests.list': 'See the list',
    'contact.eyebrow': 'Contact',
    'contact.heading': 'Say hello.',
    'contact.text': 'Happy to talk about security research, things I am building, or anything I enjoy.',
    'contact.hackerone': 'HackerOne',
    'contact.email': 'Send an email',
    'contact.github': 'GitHub',
    'contact.twitter': 'X',
    'footer.top': 'Back to top',
    'footer.built': 'Built with Astro + Keystatic',
    'notFound.title': 'Page not found',
    'notFound.text': 'The page you are looking for may have moved or been removed.',
    'notFound.home': 'Back to home',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export type UIKey = keyof (typeof ui)['ja'];

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let text: string = ui[lang][key] ?? ui[defaultLang][key];
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        text = text.replace(`{${name}}`, String(value));
      }
    }
    return text;
  };
}

export function localizePath(path: string, lang: Lang): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return normalized;
  return normalized === '/' ? `/${lang}/` : `/${lang}${normalized}`;
}

export function alternateLang(lang: Lang): Lang {
  return lang === 'ja' ? 'en' : 'ja';
}

export function pick<T extends Record<string, unknown>>(entry: T, field: string, lang: Lang): string {
  const localized = lang === 'en' ? entry[`${field}_en`] : undefined;
  const value = (typeof localized === 'string' && localized.trim() !== '' ? localized : entry[field]) ?? '';
  return typeof value === 'string' ? value : '';
}

export function pickList(entry: Record<string, unknown>, field: string, lang: Lang): string[] {
  const localized = lang === 'en' ? entry[`${field}_en`] : undefined;
  const value = Array.isArray(localized) && localized.length > 0 ? localized : entry[field];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export const prefixedLocales = locales.filter((lang) => lang !== defaultLang);
export const prefixedLangPaths = () => prefixedLocales.map((lang) => ({ params: { lang } }));

export function langFromParam(param: string | undefined): Lang {
  if (param === undefined || param === '') return defaultLang;
  if (isLang(param)) return param;
  throw new Error(`Unknown locale "${param}"`);
}

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: lang === 'ja' ? '2-digit' : 'short',
    day: '2-digit',
  }).format(date);
}
