import { createReader } from '@keystatic/core/reader';
import { describe, expect, it } from 'vitest';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

describe('keystatic config and content', () => {
  it('uses local storage outside Vercel', () => {
    expect(keystaticConfig.storage.kind).toBe('local');
  });

  it('reads the settings singleton with required fields', async () => {
    const settings = await reader.singletons.settings.read();

    expect(settings).not.toBeNull();
    expect(settings?.name).toBeTruthy();
    expect(settings?.github).toMatch(/^https:\/\/github\.com\//);
  });

  it('reads the about singleton', async () => {
    const about = await reader.singletons.about.read();

    expect(about).not.toBeNull();
    expect(about?.tagline).toBeTruthy();
    expect(about?.bio).toBeTruthy();
  });

  it('every hobby entry has a name, description, and icon', async () => {
    const hobbies = await reader.collections.hobbies.all();

    expect(hobbies.length).toBeGreaterThan(0);
    for (const hobby of hobbies) {
      expect(hobby.entry.name, hobby.slug).toBeTruthy();
      expect(hobby.entry.description, hobby.slug).toBeTruthy();
      expect(hobby.entry.icon, hobby.slug).toBeTruthy();
    }
  });

  it('every project entry has a name and description', async () => {
    const projects = await reader.collections.projects.all();

    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.entry.name, project.slug).toBeTruthy();
      expect(project.entry.description, project.slug).toBeTruthy();
    }
  });

  it('slugs referenced by the homepage exist in the collections', async () => {
    const likeSlugs = ['fpvdrone', 'electronics', 'security', 'aiagents', 'skiing'];
    const projectSlugs = [
      'authorized-research-platform',
      'attendance-system',
      'jiyu-kenkyu-ai',
      'zeroterm',
    ];

    const [hobbySlugs, allProjectSlugs] = await Promise.all([
      reader.collections.hobbies.list(),
      reader.collections.projects.list(),
    ]);

    for (const slug of likeSlugs) {
      expect(hobbySlugs, `missing hobby: ${slug}`).toContain(slug);
    }
    for (const slug of projectSlugs) {
      expect(allProjectSlugs, `missing project: ${slug}`).toContain(slug);
    }
  });
});
