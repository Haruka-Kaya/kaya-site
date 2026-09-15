import { config, collection, singleton, fields } from '@keystatic/core';

const isVercel = Boolean(process.env.VERCEL);

const ja = (label: string, multiline = false) => fields.text({ label: `${label}（日本語）`, multiline });
const en = (label: string, multiline = false) => fields.text({ label: `${label} (English)`, multiline });

function writeupCollection(lang: 'ja' | 'en') {
  const isJa = lang === 'ja';
  return collection({
    label: isJa ? 'Writeups（日本語）' : 'Writeups (English)',
    slugField: 'title',
    path: `src/content/writeups/${lang}/*`,
    entryLayout: 'content',
    format: { contentField: 'content' },
    schema: {
      title: fields.slug({
        name: { label: isJa ? 'タイトル' : 'Title' },
        slug: {
          label: 'Slug',
          description: isJa
            ? '日英で同じslugにすると言語切替でページ同士がつながります'
            : 'Use the same slug as the Japanese entry to link the two languages',
        },
      }),
      summary: fields.text({ label: isJa ? '要約' : 'Summary', multiline: true }),
      date: fields.date({ label: isJa ? '公開日' : 'Published', validation: { isRequired: true } }),
      category: fields.select({
        label: isJa ? 'カテゴリ' : 'Category',
        options: [
          { label: 'Security', value: 'security' },
          { label: 'Bug Bounty', value: 'bugbounty' },
          { label: 'Build', value: 'build' },
          { label: 'Notes', value: 'notes' },
        ],
        defaultValue: 'security',
      }),
      tags: fields.array(fields.text({ label: 'Tag' }), {
        label: 'Tags',
        itemLabel: (props) => props.value ?? 'Tag',
      }),
      draft: fields.checkbox({ label: isJa ? '下書き（非公開）' : 'Draft (hidden)', defaultValue: false }),
      content: fields.markdoc({ label: isJa ? '本文' : 'Body', extension: 'md' }),
    },
  });
}

export default config({
  storage: isVercel
    ? {
        kind: 'github',
        repo: {
          owner: 'Haruka-Kaya',
          name: 'kaya-site',
        },
      }
    : {
        kind: 'local',
      },

  ui: {
    brand: { name: 'kaya-site' },
    navigation: {
      Profile: ['settings', 'about', 'security'],
      Content: ['writeupsJa', 'writeupsEn', 'projects', 'hobbies'],
    },
  },

  singletons: {
    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/singletons/settings',
      schema: {
        name: fields.text({ label: '名前（日本語）' }),
        name_en: fields.text({ label: 'Name (English)' }),
        site_title: fields.text({ label: 'Site Title（日本語）' }),
        site_title_en: fields.text({ label: 'Site Title (English)' }),
        github: fields.text({ label: 'GitHub URL' }),
        email: fields.text({ label: 'Email' }),
        twitter: fields.text({ label: 'Twitter/X URL' }),
        hackerone: fields.text({ label: 'HackerOne URL' }),
      },
    }),

    about: singleton({
      label: 'About Me',
      path: 'src/content/singletons/about',
      schema: {
        tagline: ja('タグライン'),
        tagline_en: en('タグライン'),
        roles: fields.array(fields.text({ label: 'Role' }), {
          label: 'Roles（日本語・ヒーローに表示）',
          itemLabel: (props) => props.value ?? 'Role',
        }),
        roles_en: fields.array(fields.text({ label: 'Role' }), {
          label: 'Roles (English)',
          itemLabel: (props) => props.value ?? 'Role',
        }),
        bio: ja('自己紹介', true),
        bio_en: en('自己紹介', true),
        now: ja('いま取り組んでいること', true),
        now_en: en('いま取り組んでいること', true),
        location: fields.text({ label: 'Location（日本語）' }),
        location_en: fields.text({ label: 'Location (English)' }),
        avatar: fields.text({
          label: 'Avatar URL',
          description: '例: /avatar.png（public/ 内のファイル）または https:// から始まる画像URL。空欄で /avatar.png',
        }),
        highlights: fields.array(
          fields.object({
            label: fields.text({ label: 'ラベル（日本語）' }),
            label_en: fields.text({ label: 'Label (English)' }),
            value: fields.text({ label: '値（日本語）' }),
            value_en: fields.text({ label: 'Value (English)' }),
          }),
          {
            label: 'Highlights（プロフィールの要点）',
            itemLabel: (props) => props.fields.label.value || 'Highlight',
          }
        ),
        skills: fields.array(fields.text({ label: 'Skill' }), {
          label: 'Skills / Keywords（マーキー表示）',
          itemLabel: (props) => props.value ?? 'Skill',
        }),
      },
    }),

    security: singleton({
      label: 'Security Research',
      path: 'src/content/singletons/security',
      schema: {
        lead: ja('リード文', true),
        lead_en: en('リード文', true),
        focus: fields.array(
          fields.object({
            name: fields.text({ label: '領域名' }),
            detail: fields.text({ label: '詳細（日本語）' }),
            detail_en: fields.text({ label: 'Detail (English)' }),
          }),
          {
            label: 'Focus areas',
            itemLabel: (props) => props.fields.name.value || 'Area',
          }
        ),
        steps: fields.array(
          fields.object({
            label: fields.text({ label: 'ラベル（英語の短語）' }),
            text: fields.text({ label: '説明（日本語）' }),
            text_en: fields.text({ label: 'Description (English)' }),
          }),
          {
            label: 'Research steps',
            itemLabel: (props) => props.fields.label.value || 'Step',
          }
        ),
      },
    }),
  },

  collections: {
    hobbies: collection({
      label: 'Interests',
      slugField: 'name',
      path: 'src/content/hobbies/*',
      schema: {
        name: fields.slug({ name: { label: '名前（日本語）' } }),
        name_en: fields.text({ label: 'Name (English)' }),
        description: fields.text({ label: '説明（日本語）', multiline: true }),
        description_en: fields.text({ label: 'Description (English)', multiline: true }),
        detail: fields.text({
          label: '詳細説明（日本語）',
          description: '個別ページに表示される詳しい説明',
          multiline: true,
        }),
        detail_en: fields.text({ label: 'Detail (English)', multiline: true }),
        icon: fields.text({ label: 'Icon (emoji)' }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
        featured: fields.checkbox({ label: 'トップページに表示', defaultValue: true }),
      },
    }),

    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'src/content/projects/*',
      schema: {
        name: fields.slug({ name: { label: 'Project Name' } }),
        description: fields.text({ label: '説明（日本語）', multiline: true }),
        description_en: fields.text({ label: 'Description (English)', multiline: true }),
        url: fields.text({ label: 'URL' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value ?? 'Tag',
        }),
        featured: fields.checkbox({ label: 'トップページに表示', defaultValue: false }),
        order: fields.integer({ label: 'Display Order', defaultValue: 0 }),
        year: fields.text({ label: 'Year', description: 'e.g. 2025' }),
      },
    }),

    writeupsJa: writeupCollection('ja'),
    writeupsEn: writeupCollection('en'),
  },
});
