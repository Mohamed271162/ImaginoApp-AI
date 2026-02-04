import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Section from '@/components/shared/Section/Section';
import Container from '@/components/shared/Container/Container';

export default function Sec10() {
  return (
    <Section className="py-16 bg-section dark:bg-section-dark">
      <Container>
        <h3 className="text-4xl font-semibold text-center mb-6">
          Join 1,000,000+ creatives who are creating with AI
        </h3>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Link
              key={i}
              href={''}
              className="block bg-[color:var(--card)] p-6 rounded-xl hover:shadow-xl"
            >
              <p className="mb-4">
                Imagino has been a game-changer for my jewelry startup. It allows me to create
                stunning model shots without hiring professionals.
              </p>
              <hr className="sep my-4" />
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Name</div>
                  <div className="text-sm text-muted-foreground">Job</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          className="mt-16 rounded-xl bg-cover bg-center py-24 text-center"
          style={{ backgroundImage: "url('https://pebblely.b-cdn.net/samples/auth_bg.jpg')" }}
        >
          <h3 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold drop-shadow-lg mb-6">
            Grow your business with AI
          </h3>
          <Link href={'all-features'} className="btn btn-primary">
            Try Imagino free
          </Link>
        </div>
      </Container>
    </Section>
  );
}
