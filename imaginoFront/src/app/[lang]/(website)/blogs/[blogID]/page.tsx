import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import Image from 'next/image';
import Link from 'next/link';
import { blogs } from '../_data/blogs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IMAGINO - Blog Details',
};

export default async function SpecificBlog({
  params,
}: {
  params: Promise<{ lang: string; blogID: string }>;
}) {
  const { blogID, lang } = await params;
  const blogIDString = Array.isArray(blogID) ? blogID[0] : blogID;
  const index = blogIDString ? parseInt(blogIDString, 10) : -1;
  const blog = blogs[index];

  if (!blog) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-semibold mb-4">Article not found</h2>
          <p className="text-muted mb-6">We couldn{"'"}t find the blog you requested.</p>
          <Link href={`/${lang}/blogs`} className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href={`/${lang}/blogs`} className="text-sm font-medium text-muted hover:underline">
            ← Back to Blog
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {blog.title}
          </h1>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={`/logo.png`} alt="author" fill className="object-cover" />
              </div>
            </div>
          </div>
        </header>

        <Section className="py-0">
          <div className="surface rounded-xl overflow-hidden">
            <Image
              src={blog.imgPath.trim()}
              alt={blog.title}
              width={1600}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </Section>

        <article className="mt-10 prose-like">
          <div className="mt-6 text-base leading-relaxed">
            <h2 className="mt-6">Why add logos in bulk?</h2>
            <p>
              Adding logos or badges helps build recognition and adds trust signals for shoppers.
              When done correctly it doesn’t distract from the product — it amplifies it.
            </p>

            <h3 className="mt-6">Best practices</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Use a small, consistent size across your catalog</li>
              <li>Prefer corners and transparent PNGs</li>
              <li>Use subtle drop shadows or outlines when photographing on busy backgrounds</li>
            </ul>

            <div className="mt-8">
              <Link href={`/${lang}/blogs`} className="btn btn-secondary">
                Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </div>
    </Container>
  );
}
