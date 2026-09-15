import { describe, expect, it } from 'vitest';
import {
  alternateLang,
  formatDate,
  langFromParam,
  localizePath,
  pick,
  pickList,
  prefixedLangPaths,
  ui,
  useTranslations,
} from '../src/i18n/ui';
import { readingTime } from '../src/lib/site';

describe('i18n helpers', () => {
  it('localizes paths with a prefix only for non-default locales', () => {
    expect(localizePath('/', 'ja')).toBe('/');
    expect(localizePath('/', 'en')).toBe('/en/');
    expect(localizePath('/writeups', 'ja')).toBe('/writeups');
    expect(localizePath('/writeups', 'en')).toBe('/en/writeups');
    expect(localizePath('hobbies/fpvdrone', 'en')).toBe('/en/hobbies/fpvdrone');
  });

  it('maps route params to locales and only prefixes non-default ones', () => {
    expect(langFromParam(undefined)).toBe('ja');
    expect(langFromParam('')).toBe('ja');
    expect(langFromParam('en')).toBe('en');
    expect(() => langFromParam('fr')).toThrow();
    expect(prefixedLangPaths()).toEqual([{ params: { lang: 'en' } }]);
    expect(prefixedLangPaths()).not.toBe(prefixedLangPaths());
    expect(alternateLang('ja')).toBe('en');
    expect(alternateLang('en')).toBe('ja');
  });

  it('picks localized fields with a Japanese fallback', () => {
    const entry = { name: 'ドローン', name_en: 'Drones', detail: '詳細', detail_en: '' };
    expect(pick(entry, 'name', 'ja')).toBe('ドローン');
    expect(pick(entry, 'name', 'en')).toBe('Drones');
    expect(pick(entry, 'detail', 'en')).toBe('詳細');
    expect(pick({ name: null }, 'name', 'ja')).toBe('');
    expect(pickList({ roles: ['a'], roles_en: ['b'] }, 'roles', 'en')).toEqual(['b']);
    expect(pickList({ roles: ['a'], roles_en: [] }, 'roles', 'en')).toEqual(['a']);
  });

  it('translates with variables and has the same keys in every locale', () => {
    const t = useTranslations('en');
    expect(t('writeups.readingTime', { n: 4 })).toBe('4 min read');
    expect(useTranslations('ja')('writeups.readingTime', { n: 4 })).toBe('約4分');
    expect(Object.keys(ui.ja).sort()).toEqual(Object.keys(ui.en).sort());
  });

  it('formats dates per locale', () => {
    const date = new Date('2026-08-24T00:00:00Z');
    expect(formatDate(date, 'ja')).toMatch(/2026\/08\/24/);
    expect(formatDate(date, 'en')).toMatch(/Aug 24, 2026/);
  });

  it('estimates reading time for Japanese and English text', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('word '.repeat(660))).toBe(3);
    expect(readingTime('あ'.repeat(1500))).toBe(3);
  });
});
