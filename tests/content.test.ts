import { createReader } from '@keystatic/core/reader';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);
const writeupsDir = join(process.cwd(), 'src/content/writeups');

describe('keystatic config and content', () => {
  it('uses local storage outside Vercel', () => {
    expect(keystaticConfig.storage.kind).toBe('local');
  });

  it('reads the settings singleton with bilingual names', async () => {
    const settings = await reader.singletons.settings.read();

    expect(settings).not.toBeNull();
    expect(settings?.name).toBeTruthy();
    expect(settings?.name_en).toBeTruthy();
    expect(settings?.site_title_en).toBeTruthy();
    expect(settings?.github).toMatch(/^https:\/\/github\.com\//);
  });

  it('reads the about singleton with roles, highlights, and skills', async () => {
    const about = await reader.singletons.about.read();

    expect(about).not.toBeNull();
    expect(about?.tagline).toBeTruthy();
    expect(about?.tagline_en).toBeTruthy();
    expect(about?.bio).toBeTruthy();
    expect(about?.bio_en).toBeTruthy();
    expect(about?.roles.length).toBeGreaterThan(0);
    expect(about?.roles_en.length).toBe(about?.roles.length);
    expect(about?.highlights.length).toBeGreaterThan(0);
    expect(about?.skills.length).toBeGreaterThan(5);
    for (const item of about?.highlights ?? []) {
      expect(item.label).toBeTruthy();
      expect(item.label_en).toBeTruthy();
      expect(item.value).toBeTruthy();
      expect(item.value_en).toBeTruthy();
    }
  });

  it('reads the security singleton with focus areas and steps', async () => {
    const security = await reader.singletons.security.read();

    expect(security).not.toBeNull();
    expect(security?.lead).toBeTruthy();
    expect(security?.lead_en).toBeTruthy();
    expect(security?.focus.length).toBe(3);
    expect(security?.steps.length).toBe(3);
    for (const area of security?.focus ?? []) {
      expect(area.name).toBeTruthy();
      expect(area.detail_en).toBeTruthy();
    }
  });

  it('every hobby entry is bilingual with a unique order', async () => {
    const hobbies = await reader.collections.hobbies.all();

    expect(hobbies.length).toBe(7);
    const orders = hobbies.map((hobby) => hobby.entry.order);
    expect(new Set(orders).size).toBe(orders.length);
    for (const hobby of hobbies) {
      expect(hobby.entry.name, hobby.slug).toBeTruthy();
      expect(hobby.entry.name_en, hobby.slug).toBeTruthy();
      expect(hobby.entry.description, hobby.slug).toBeTruthy();
      expect(hobby.entry.description_en, hobby.slug).toBeTruthy();
      expect(hobby.entry.detail, hobby.slug).toBeTruthy();
      expect(hobby.entry.detail_en, hobby.slug).toBeTruthy();
      expect(hobby.entry.icon, hobby.slug).toBeTruthy();
    }
  });

  it('every project entry is bilingual with a unique order and exactly four featured', async () => {
    const projects = await reader.collections.projects.all();

    expect(projects.length).toBeGreaterThan(0);
    const orders = projects.map((project) => project.entry.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect(projects.filter((project) => project.entry.featured).length).toBe(4);
    for (const project of projects) {
      expect(project.entry.name, project.slug).toBeTruthy();
      expect(project.entry.description, project.slug).toBeTruthy();
      expect(project.entry.description_en, project.slug).toBeTruthy();
      expect(project.entry.year, project.slug).toMatch(/^\d{4}$/);
    }
  });

  it('writeups exist in both languages with matching slugs', () => {
    const ja = readdirSync(join(writeupsDir, 'ja')).filter((file) => file.endsWith('.md')).sort();
    const en = readdirSync(join(writeupsDir, 'en')).filter((file) => file.endsWith('.md')).sort();

    expect(ja.length).toBeGreaterThan(0);
    expect(ja).toEqual(en);
    for (const file of ja) {
      const body = readFileSync(join(writeupsDir, 'ja', file), 'utf8');
      expect(body, file).toMatch(/^---\n[\s\S]*?\ntitle: /);
      expect(body, file).toMatch(/\ndate: \d{4}-\d{2}-\d{2}/);
    }
  });

  it('reads writeups through the keystatic reader', async () => {
    const [ja, en] = await Promise.all([reader.collections.writeupsJa.all(), reader.collections.writeupsEn.all()]);

    expect(ja.length).toBeGreaterThan(0);
    expect(ja.map((entry) => entry.slug).sort()).toEqual(en.map((entry) => entry.slug).sort());
    for (const entry of [...ja, ...en]) {
      expect(entry.entry.title, entry.slug).toBeTruthy();
      expect(entry.entry.summary, entry.slug).toBeTruthy();
      expect(entry.entry.date, entry.slug).toBeTruthy();
    }
  });
});
