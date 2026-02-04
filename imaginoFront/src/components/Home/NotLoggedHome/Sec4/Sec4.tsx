import Image from "next/image";
import Section from "@/components/shared/Section/Section";
import Container from "@/components/shared/Container/Container";

export default function Sec4() {
  return (
    <Section className="py-16 bg-section dark:bg-section-dark">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Remove any background for free</h2>
            <p className="text-lg mb-3">
              Simply upload your product, and our AI will automatically remove the background for you.
            </p>
            <p className="text-lg">
              Our AI is trained to remove the background for a wide range of products — in seconds.
            </p>
          </div>

          <div className="surface rounded-xl overflow-hidden">
            <Image
              width={1200}
              height={800}
              src={"/assets/NotLoggedHome/sec4/background-removal-examples.jpg"}
              alt="Background removal examples"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
