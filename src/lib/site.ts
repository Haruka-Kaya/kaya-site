import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

type Settings = Awaited<ReturnType<typeof reader.singletons.settings.read>>;

export function resolveSettings(settings: Settings) {
  const name = settings?.name ?? '賀屋 悠';
  return {
    name,
    siteTitle: settings?.site_title ?? `${name} | 自己紹介`,
    github: settings?.github ?? 'https://github.com/Haruka-Kaya',
    hackerone: settings?.hackerone ?? 'https://hackerone.com/haruka-kaya',
    email: settings?.email ?? '',
    twitter: settings?.twitter ?? '',
  };
}

export function absoluteUrl(path: string, site: URL | undefined, origin: string): URL {
  return new URL(path, site ?? origin);
}

export function sortBySlugOrder<T extends { slug: string }>(items: readonly T[], order: string[]): T[] {
  return items
    .filter((item) => order.includes(item.slug))
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export function formatIndex(value: number): string {
  return String(value).padStart(2, '0');
}
