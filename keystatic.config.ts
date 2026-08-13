import { config, collection, singleton, fields } from '@keystatic/core';

const isVercel = Boolean(process.env.VERCEL);

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

  singletons: {
    about: singleton({
      label: 'About Me',
      path: 'src/content/singletons/about',
      schema: {
        tagline: fields.text({
          label: 'タグライン（日本語）',
          description: '名前の下に表示される短い説明',
        }),
        tagline_en: fields.text({
          label: 'Tagline (English)',
        }),
        bio: fields.text({
          label: '自己紹介（日本語）',
          multiline: true,
        }),
        bio_en: fields.text({
          label: 'Bio (English)',
          multiline: true,
        }),
        location: fields.text({
          label: 'Location',
          description: 'e.g. Tokyo, Japan',
        }),
        avatar: fields.text({
          label: 'Avatar URL',
          description: '空欄でGitHubアバター使用',
        }),
      },
    }),

    settings: singleton({
      label: 'Site Settings',
      path: 'src/content/singletons/settings',
      schema: {
        name: fields.text({ label: 'Your Name' }),
        site_title: fields.text({ label: 'Site Title' }),
        github: fields.text({ label: 'GitHub URL' }),
        email: fields.text({ label: 'Email' }),
        twitter: fields.text({ label: 'Twitter/X URL' }),
        hackerone: fields.text({ label: 'HackerOne URL' }),
      },
    }),
  },

  collections: {
    hobbies: collection({
      label: 'Hobbies',
      slugField: 'name',
      path: 'src/content/hobbies/*',
      schema: {
        name: fields.slug({ name: { label: 'Hobby Name' } }),
        description: fields.text({
          label: '説明（日本語）',
          multiline: true,
        }),
        description_en: fields.text({
          label: 'Description (English)',
          multiline: true,
        }),
        detail: fields.text({
          label: '詳細説明（日本語）',
          description: '個別ページに表示される詳しい説明',
          multiline: true,
        }),
        icon: fields.text({
          label: 'Icon (emoji)',
        }),
        order: fields.integer({
          label: 'Display Order',
          defaultValue: 0,
        }),
      },
    }),

    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'src/content/projects/*',
      schema: {
        name: fields.slug({ name: { label: 'Project Name' } }),
        description: fields.text({
          label: '説明（日本語）',
          multiline: true,
        }),
        description_en: fields.text({
          label: 'Description (English)',
          multiline: true,
        }),
        url: fields.text({ label: 'URL' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: props => props.fields.value ?? 'Tag',
          }
        ),
        featured: fields.checkbox({
          label: 'Featured',
          defaultValue: false,
        }),
      },
    }),
  },
});
