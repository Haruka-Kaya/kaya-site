export const locales = ['ja', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'ja';

export const ui = {
  ja: {
    'site.tagline': 'Maker & curious person',
    'nav.about': 'プロフィール',
    'nav.security': 'セキュリティ',
    'nav.writeups': 'こぼれ話',
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
    'hero.cta.writeups': 'こぼれ話を読む',
    'hero.cta.security': '調査について',
    'hero.cta.contact': '連絡する',
    'hero.scroll': 'Scroll',
    'about.eyebrow': 'About',
    'about.heading': '作ったり、飛ばしたり、寄り道したり。',
    'about.now': 'いま取り組んでいること',
    'about.location': '拠点',
    'security.eyebrow': 'Security research',
    'security.heading': '境界を見つけ、再現して確かめる。',
    'security.focus': 'Current focus',
    'security.areas': 'areas',
    'security.process': '調査で大切にしていること',
    'security.hackerone': 'HackerOneのプロフィールを見る',
    'security.disclosure': 'Responsible disclosure',
    'writeups.eyebrow': 'Notes & outtakes',
    'writeups.heading': 'だいたい、寄り道しながら作っています。',
    'writeups.intro': '制作中の失敗、ちょっとした発見、趣味の話。完成品だけでは見えないところも。',
    'writeups.all': 'すべての記事',
    'writeups.read': '読む',
    'writeups.empty': '記事はまだありません。',
    'writeups.back': '記事一覧へ',
    'writeups.published': '公開日',
    'writeups.readingTime': '約{n}分',
    'writeups.otherLang': 'この記事は英語版があります',
    'writeups.count': '{n}件',
    'projects.eyebrow': 'Projects',
    'projects.heading': 'こんなものを作っています。',
    'projects.intro': '身近な人が使う道具、自分で遊ぶゲーム、日常のちょっとした工夫。',
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
    'contact.text': '作っているものや趣味の話ができたらうれしいです。',
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
    'site.tagline': 'Maker & curious person',
    'nav.about': 'Profile',
    'nav.security': 'Security',
    'nav.writeups': 'Outtakes',
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
    'hero.cta.writeups': 'Read the outtakes',
    'hero.cta.security': 'How I research',
    'hero.cta.contact': 'Get in touch',
    'hero.scroll': 'Scroll',
    'about.eyebrow': 'About',
    'about.heading': 'Making things, flying things, taking detours.',
    'about.now': 'Currently working on',
    'about.location': 'Based in',
    'security.eyebrow': 'Security research',
    'security.heading': 'Find the boundary, reproduce it, verify it.',
    'security.focus': 'Current focus',
    'security.areas': 'areas',
    'security.process': 'How I approach research',
    'security.hackerone': 'View my HackerOne profile',
    'security.disclosure': 'Responsible disclosure',
    'writeups.eyebrow': 'Notes & outtakes',
    'writeups.heading': 'Most builds come with a few detours.',
    'writeups.intro': 'Things that went wrong, small discoveries, and hobbies. The parts you do not see in the finished project.',
    'writeups.all': 'All writeups',
    'writeups.read': 'Read',
    'writeups.empty': 'No writeups yet.',
    'writeups.back': 'Back to writeups',
    'writeups.published': 'Published',
    'writeups.readingTime': '{n} min read',
    'writeups.otherLang': 'This post is also available in Japanese',
    'writeups.count': '{n} posts',
    'projects.eyebrow': 'Projects',
    'projects.heading': 'Things I have been making.',
    'projects.intro': 'Useful tools for people around me, games to play, and small improvements to everyday life.',
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
    'contact.text': 'Happy to talk about things I am building or anything I enjoy.',
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
