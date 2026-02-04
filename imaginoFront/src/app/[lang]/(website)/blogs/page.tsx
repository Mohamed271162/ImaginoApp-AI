'use client';
import ProductsIdeas from '@/components/blog/ProductsIdeas/ProductsIdeas';
import MasonryGallaryLayout from '@/components/gallery/MasonryGallaryLayout/MasonryGallaryLayout';
import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { blogs } from './_data/blogs';
import { useTheme } from 'next-themes';

// export const metadata: Metadata = {
//   title: 'IMAGINO - Blogs',
//   description: 'Explore more Blogs About Us Here!',
// };

export default function Blog() {
  const { theme } = useTheme();
  return (
    <>
      <div className="w-full min-h-screen py-12">
        {/* Header */}
        <Container>
          <div className="px-6">
            <Section className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">The Imagino Blog</h1>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Resources to help you become smarter about using AI for your marketing.
              </p>
            </Section>
          </div>
        </Container>

        {/* Hero */}
        <Section className="px-4 lg:px-16">
          <Container className="max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <div className="blog-hero">
                  <Image
                    src="/blogImages/add-logo-cover.jpg"
                    width={1200}
                    height={800}
                    alt="add logo cover"
                    className="rounded-lg object-cover w-full h-56 md:h-72 lg:h-80"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2 max-w-xl">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 blog-hero-title">
                  How to Add Your Logo or Badge to AI Product Photos in Bulk
                </h2>

                <p className="text-base md:text-lg text-muted mb-6 leading-relaxed">
                  Whether you want to watermark your product photos or highlight product attributes
                  to convert more shoppers, you can now easily add your logo or badge in bulk.
                </p>

                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={`/${theme === 'dark' ? 'logo-dark.png' : 'logo.png'}`}
                      fill
                      alt="author avatar"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Saeid Agamy</h4>
                    <span className="text-sm text-muted">Co-founder</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Cards grid */}
        <Section className="px-4 lg:px-16">
          <Container className="max-w-7xl">
            <div className="blog-grid">
              {blogs?.map((blog, i) => (
                <Link key={i} href={`blogs/${i}`} className="blog-card" aria-label={blog.title}>
                  <div className="media">
                    <Image
                      src={blog.imgPath}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority={i < 6}
                    />
                  </div>

                  <div className="body">
                    <CardContent className="p-0">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg font-semibold">{blog.title}</CardTitle>
                      </CardHeader>
                    </CardContent>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </div>

      {/* Product Ideas Section */}
      <Section className="py-12">
        <Container>
          <ProductsIdeas />
        </Container>
      </Section>

      {/* Masonry Gallery / CTA Section */}
      <Section>
        <MasonryGallaryLayout />
      </Section>
    </>
  );
}
