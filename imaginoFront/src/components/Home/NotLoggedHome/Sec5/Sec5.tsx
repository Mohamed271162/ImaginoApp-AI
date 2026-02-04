import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import Image from 'next/image';
import Link from 'next/link';

export default function Sec5() {
  return (
    <Section className="py-16">
      <Container>
        <div className="bg-[color:var(--main-color)]/6 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-5xl font-bold mb-4">
                Generate beautiful AI backgrounds for your products
              </h3>
              <p className="mb-4 text-lg leading-relaxed">
                Just describe the background you want or pick from 40+ themes. Unlike manual
                editing, Imagino will create photos with the appropriate reflections and shadows
                automatically.
              </p>

              <div className="flex gap-3 flex-wrap">
                {[
                  'Skincare',
                  'Beauty',
                  'Soap',
                  'Candle',
                  'Furniture',
                  'Jewelry',
                  'Pet Products',
                  'Watches',
                  'Beverage',
                ].map((t) => (
                  <Link
                    key={t}
                    href={''}
                    className="px-4 py-2 rounded-full bg-[color:var(--main-color)] text-black font-semibold hover:brightness-95"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden template-thumb">
              <Image
                width={900}
                height={900}
                src={'/assets/NotLoggedHome/sec5/'}
                alt="Background generator preview"
                className="w-full h-80 object-cover"
              />
              <div className="overlay">
                <div className="bg-white/95 rounded-lg p-6 text-center max-w-[80%] mx-auto shadow">
                  <div className="text-lg font-semibold mb-2">Try this out now!</div>
                  <div className="text-sm mb-4">
                    Click below to create a photo. Move or resize the product on the left to get
                    different variations.
                  </div>
                  <Link href={''} className="btn btn-primary">
                    Surprise me!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
