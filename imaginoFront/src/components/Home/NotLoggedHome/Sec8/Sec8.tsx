import Image from 'next/image';
import Section from '@/components/shared/Section/Section';
import Container from '@/components/shared/Container/Container';

export default function Sec8() {
  return (
    <Section className="py-16 bg-section dark:bg-section-dark">
      <Container>
        <div className="text-center mb-8">
          <h3 className="text-3xl md:text-5xl font-semibold mb-2">
            Generate product photos at scale
          </h3>
          <p className="text-lg">
            As your business grows, you need more content than ever. Use AI to help you scale.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="feature-card">
            <h4 className="text-2xl font-medium">Bulk generation with our app</h4>
            <p className="mt-2">
              Generate product photos with similar or varied backgrounds for up to 25 products.
            </p>
            <Image
              src={'/assets/NotLoggedHome/sec8/bulk-generate-examples.jpg'}
              width={900}
              height={500}
              alt="bulk generate"
              className="mt-4 rounded-lg"
            />
          </div>

          <div className="feature-card">
            <h4 className="text-2xl font-medium">Programmatic generation with our API</h4>
            <p className="mt-2">
              We have generated up to 200,000 images per day and can go even higher if you need.
            </p>

            <div className="mt-4 flex gap-3">
              <a href="" className="btn btn-secondary">
                See documentation
              </a>
              <a href="" className="btn btn-secondary">
                Get free API credits
              </a>
            </div>

            <div className="mt-6 code-surface rounded-lg">
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {`POST /create-background/v2
                  RequestBody:
                    images: List[str]
                    theme: str = "Surprise me"
                    description: str = ""
                    style_color: str = None
                    generate_plus: bool = False
                    transforms: List[Dict] = []
                    height: int = 512
                    width: int = 512`}
              </pre>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
