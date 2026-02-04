import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';

const items = Array.from({ length: 18 }, (_, i) => `/assets/gallery/gallery${i + 1}.jpg`);
export default function Sec9() {
  // const items = Array.from({ length: 18 }).map((_, i) => i);
  return (
    <Section className="py-16">
      <Container>
        <h3 className="text-4xl font-semibold text-center mb-6">
          100+ templates to get started with
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {items.map((item) => (
            <Dialog key={item}>
              <DialogTrigger className="template-thumb">
                <Image
                  src={item}
                  alt="template"
                  width={400}
                  height={400}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="overlay">
                  <div className="text-sm">Emerging from rippling water, pink background</div>
                </div>
              </DialogTrigger>

              <DialogContent className="w-[90vw] max-w-[90vw] p-0 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="sr-only">Template detail</DialogTitle>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <Image
                        src={item}
                        alt="preview"
                        width={900}
                        height={600}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-3">
                      <div className="text-lg font-semibold">
                        Emerging from rippling water, pink background
                      </div>
                      <div className="text-sm text-muted-foreground">Excluded from image</div>
                      <Badge variant="secondary">example</Badge>

                      <div className="text-sm mt-2">Reference image</div>
                      <Image
                        src={'/assets/NotLoggedHome/sec9/armchair-green.jpg'}
                        alt="ref"
                        width={64}
                        height={64}
                      />

                      <div className="mt-4">
                        <div className="text-sm">Dimensions</div>
                        <div className="text-sm font-medium">1024 ✕ 1024</div>
                      </div>

                      <div>
                        <div className="text-sm">Generation mode</div>
                        <div className="text-sm font-medium">GENERATE</div>
                      </div>

                      <Link href={''} className="btn btn-primary mt-3 w-full text-center">
                        Use this template
                      </Link>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </Container>
    </Section>
  );
}
