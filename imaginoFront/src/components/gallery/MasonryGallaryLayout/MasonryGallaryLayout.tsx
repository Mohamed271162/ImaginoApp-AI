import Section from '../../shared/Section/Section';
import { Button } from '../../ui/button';

export default function MasonryGallaryLayout() {
  return (
    <Section
      className="py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.45), rgba(2,6,23,0.35)), url('/blogImages/auth_bg.webp')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="masonry-cta">
        <p className="text-white text-2xl md:text-3xl font-medium">Grow your business with AI</p>

        <Button className="bg-amber-300 text-black p-3 hover:bg-amber-400">Try Imagino Free</Button>
      </div>
    </Section>
  );
}
