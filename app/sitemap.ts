import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.santharidashospital.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/doctors`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-appointment`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Fetch dynamic blog URLs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (blogs && blogs.length > 0) {
      blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/blogs/${blog.slug}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.error('Error fetching blogs for sitemap:', e);
  }

  return [...staticRoutes, ...blogRoutes];
}
