import { defineCollection, z } from "astro:content"


// تعريف collection للمشاكل
const problemsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    folder: z.string(),
  }),
});

// تعريف collection للمقالات
const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    pubDate: z.date().optional(),
  }),
});

// تعريف collection للـ about
const aboutCollection = defineCollection({
  type: 'content',
  schema: z.object({
    sections: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    ),
  }),
});

const presidentSchema = z.object({
  nameAr: z.string(),
  nameEn: z.string(),
  img: z.string(),
  years: z.string(),
  events: z.array(
    z.object({
      date: z.string(),
      description: z.string(),
    })
  ),
});

const libraryCollection = defineCollection({
  type: 'content',
  schema: z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  image: z.string(),
  }),
  });

export const collections = {
  problems: problemsCollection,
  articles: articlesCollection,
  about: aboutCollection,
  presidents: presidentSchema,
  libraryTopics: libraryCollection,

};