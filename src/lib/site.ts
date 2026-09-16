import { createReader } from '@keystatic/core/reader';
import { getCollection } from 'astro:content';
import keystaticConfig from '../../keystatic.config';
import { alternateLang, pick, pickList, type Lang } from '../i18n/ui';

export const reader = createReader(process.cwd(), keystaticConfig);

type Settings = NonNullable<Awaited<ReturnType<typeof reader.singletons.settings.read>>>;
type AboutEntry = NonNullable<Awaited<ReturnType<typeof reader.singletons.about.read>>>;
type SecurityEntry = NonNullable<Awaited<ReturnType<typeof reader.singletons.security.read>>>;

export function resolveSettings(settings: Settings, lang: Lang) {
  const name = pick(settings, 'name', lang) || settings.name;
  return {
    name,
    altName: pick(settings, 'name', alternateLang(lang)) || settings.name,
    siteTitle: pick(settings, 'site_title', lang) || settings.site_title,
    github: settings.github ?? '',
    hackerone: settings.hackerone ?? '',
    email: settings.email ?? '',
    twitter: settings.twitter ?? '',
  };
}

export function resolveAbout(about: AboutEntry, lang: Lang) {
  return {
    tagline: pick(about, 'tagline', lang),
    roles: pickList(about, 'roles', lang),
    bio: pick(about, 'bio', lang),
    now: pick(about, 'now', lang),
    location: pick(about, 'location', lang),
    highlights: about.highlights.map((item) => ({
      label: pick(item, 'label', lang),
      value: pick(item, 'value', lang),
    })),
    skills: about.skills,
  };
}

export function resolveSecurity(security: SecurityEntry, lang: Lang) {
  return {
    lead: pick(security, 'lead', lang),
    focus: security.focus.map((area) => ({ name: area.name, detail: pick(area, 'detail', lang) })),
    steps: security.steps.map((step) => ({ label: step.label, text: pick(step, 'text', lang) })),
  };
}

export async function loadSiteContext(lang: Lang) {
  const [settings, about, security] = await Promise.all([
    reader.singletons.settings.read(),
    reader.singletons.about.read(),
    reader.singletons.security.read(),
  ]);
  if (!settings) throw new Error('Failed to read singleton "settings" (src/content/singletons/settings.yaml).');
  if (!about) throw new Error('Failed to read singleton "about" (src/content/singletons/about.yaml).');
  if (!security) throw new Error('Failed to read singleton "security" (src/content/singletons/security.yaml).');
  return {
    settings: resolveSettings(settings, lang),
    about: resolveAbout(about, lang),
    security: resolveSecurity(security, lang),
  };
}

export async function loadHobbies(lang: Lang, { featuredOnly = false } = {}) {
  const all = await reader.collections.hobbies.all();
  return all
    .filter((item) => !featuredOnly || item.entry.featured)
    .sort((a, b) => a.entry.order - b.entry.order)
    .map((item) => ({
      slug: item.slug,
      name: pick(item.entry, 'name', lang),
      description: pick(item.entry, 'description', lang),
      detail: pick(item.entry, 'detail', lang),
      icon: item.entry.icon ?? '',
    }));
}

export async function loadHobby(slug: string, lang: Lang) {
  const entry = await reader.collections.hobbies.read(slug);
  if (!entry) throw new Error(`Failed to read hobby entry "${slug}" (src/content/hobbies/${slug}.yaml).`);
  return {
    slug,
    name: pick(entry, 'name', lang),
    description: pick(entry, 'description', lang),
    detail: pick(entry, 'detail', lang),
    icon: entry.icon ?? '',
  };
}

export async function loadProjects(lang: Lang, { featuredOnly = false } = {}) {
  const all = await reader.collections.projects.all();
  return all
    .filter((item) => !featuredOnly || item.entry.featured)
    .sort((a, b) => a.entry.order - b.entry.order || a.entry.name.localeCompare(b.entry.name))
    .map((item) => ({
      slug: item.slug,
      name: item.entry.name,
      description: pick(item.entry, 'description', lang),
      url: item.entry.url ?? '',
      tags: item.entry.tags,
      year: item.entry.year ?? '',
      featured: item.entry.featured,
    }));
}

export type Writeup = Awaited<ReturnType<typeof loadWriteups>>[number];

export function isTechnicalCategory(category: string) {
  return category !== 'notes';
}

export const researchProjectSlugs = new Set(['agent-governance-toolkit', 'authorized-research-platform']);

export async function loadWriteups(lang: Lang, { limit, surface }: { limit?: number; surface?: 'portfolio' | 'tech' } = {}) {
  const entries = await getCollection('writeups', (entry) => entry.id.startsWith(`${lang}/`) && !entry.data.draft
    && (!surface || isTechnicalCategory(entry.data.category) === (surface === 'tech')));
  const sorted = entries
    .map((entry) => ({ ...entry, slug: entry.id.slice(lang.length + 1), readingMinutes: readingTime(entry.body ?? '') }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function hasWriteup(slug: string, lang: Lang) {
  const entries = await getCollection('writeups', (entry) => entry.id === `${lang}/${slug}` && !entry.data.draft);
  return entries.length > 0;
}

export function readingTime(body: string): number {
  const cjk = (body.match(/[　-鿿豈-﫿]/g) ?? []).length;
  const words = body.replace(/[　-鿿豈-﫿]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 500 + words / 220));
}

export function absoluteUrl(path: string, site: URL | undefined, origin: string): URL {
  return new URL(path, site ?? origin);
}

export function formatIndex(value: number): string {
  return String(value).padStart(2, '0');
}
