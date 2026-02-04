import Image from 'next/image';
import Section from '@/components/shared/Section/Section';
import Container from '@/components/shared/Container/Container';

export default function Sec7() {
  return (
    <Section className="py-16">
      <Container>
        <h3 className="text-3xl md:text-5xl font-bold text-center mb-4">
          Edit generated images with AI
        </h3>
        <p className="text-center mb-10">
          Imagino is more than an AI image generator. It is an AI design tool.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="col-span-6 lg:col-span-3 feature-card">
            <h4 className="text-2xl font-medium">Remove objects in images</h4>
            <p className="mt-2">
              Remove objects by brushing and re-generating — fine-tune without starting over.
            </p>
            <Image
              src={'/assets/NotLoggedHome/sec7/remove-object.gif'}
              width={900}
              height={500}
              alt="remove object"
              className="mt-4 rounded-lg"
            />
          </div>

          <div className="col-span-6 lg:col-span-3 feature-card">
            <h4 className="text-2xl font-medium">Move your product</h4>
            <p className="mt-2">
              Re-position, resize, and rotate the product—images separate product & background
              layers for control.
            </p>
            <Image
              src={'/assets/NotLoggedHome/sec7/move-product.gif'}
              width={900}
              height={500}
              alt="move product"
              className="mt-4 rounded-lg"
            />
          </div>

          <div className="col-span-6 lg:col-span-4 feature-card">
            <h4 className="text-2xl font-medium">Reuse backgrounds</h4>
            <p className="mt-2">
              Reuse a generated background with other products by swapping the product layer.
            </p>
            <Image
              src={'/assets/NotLoggedHome/sec7/reuse-background-examples.jpg'}
              width={900}
              height={500}
              alt="reuse backgrounds"
              className="mt-4 rounded-lg"
            />
          </div>

          <div className="col-span-6 lg:col-span-2 feature-card">
            <h4 className="text-2xl font-medium">Add logo or badge in bulk</h4>
            <p className="mt-2">Decorate photos with brand logos or badges at scale.</p>
            <Image
              src={'/assets/NotLoggedHome/sec7/add-logo-examples.jpg'}
              width={600}
              height={400}
              alt="add logos"
              className="mt-4 rounded-lg"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
