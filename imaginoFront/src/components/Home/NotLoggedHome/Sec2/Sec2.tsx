import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import Image from 'next/image';

export default function Sec2() {
  return (
    <Section className="py-8">
      <Container className="max-w-6xl">
        <div className="rounded-xl overflow-hidden surface-elev">
          <Image
            width={1600}
            height={800}
            src={'/assets/NotLoggedHome/sec2/sec2.jpg'}
            alt="Collage of AI product photos"
            className="w-full h-64 md:h-96 object-cover"
            priority
          />
        </div>
      </Container>
    </Section>
  );
}
