import Image from "next/image";
import Section from "@/components/shared/Section/Section";
import Container from "@/components/shared/Container/Container";

export default function Sec6() {
  return (
    <Section className="py-16 bg-section dark:bg-section-dark">
      <Container>
        <h3 className="text-3xl md:text-5xl font-bold text-center mb-6">Create elaborate images, without being a graphic designer</h3>
        <p className="text-center mb-8">It{"'"}s like being a Photoshop pro, without actually spending the time to learn Photoshop.</p>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-10">
          <div className="col-span-6 lg:col-span-2 feature-card">
            <h4 className="text-2xl font-medium mb-2">Set your canvas size</h4>
            <p className="text-lg">You can change the dimensions up to 2048✕2048.</p>
            <Image src={"/assets/NotLoggedHome/sec6/settings.jpg"} width={600} height={400} alt="settings" className="mt-6 rounded-lg" />
          </div>

          <div className="col-span-6 lg:col-span-4 feature-card">
            <h4 className="text-2xl font-medium mb-2">Feature multiple products</h4>
            <p className="text-lg mb-4">Place multiple products and props on the canvas, and we{"'"}ll generate suitable backgrounds.</p>
            <Image src={"/assets/NotLoggedHome/sec6/multiple-product-examples.jpg"} width={900} height={400} alt="multiple examples" className="rounded-lg" />
          </div>

          <div className="col-span-6 lg:col-span-3 feature-card">
            <h4 className="text-2xl font-medium mb-2">Reference image</h4>
            <p className="text-lg">Use a reference image to show the AI what you want.</p>
            <Image src={"/assets/NotLoggedHome/sec6/reference-image-example.jpg"} width={600} height={400} alt="reference" className="mt-4 rounded-lg" />
          </div>

          <div className="col-span-6 lg:col-span-3 feature-card">
            <h4 className="text-2xl font-medium mb-2">Match your brand colors</h4>
            <p className="text-lg">Use existing images to generate assets with coherent brand colors.</p>
            <Image src={"/assets/NotLoggedHome/sec6/brand-color-example.jpg"} width={600} height={400} alt="brand colors" className="mt-4 rounded-lg" />
          </div>
        </div>

        <div className="bg-[color:var(--card)] p-10 rounded-xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <h4 className="text-4xl font-semibold mb-4">Extend your images to any size with AI</h4>
              <p className="text-xl leading-relaxed">Turn a single image into multiple marketing assets: marketplace photos, social content, website imagery, banners and ads.</p>
            </div>

            <div className="lg:col-span-8">
              <Image src={"/assets/NotLoggedHome/sec6/resize-examples.jpg"} width={900} height={500} alt="resize examples" className="w-full rounded-lg" />
            </div>
          </div>

          <p className="text-center text-xl font-light mt-8 mb-4">Suitable for all marketplaces, platforms, and channels</p>

          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              "/assets/icons/amazon.png",
              "/assets/icons/ebay.png",
              "/assets/icons/esty.png",
              "/assets/icons/facebook.png",
              "/assets/icons/instagram.png",
              "/assets/icons/lazada.png",
              "/assets/icons/pintrest.png",
              "/assets/icons/shopee.png",
              "/assets/icons/shopefy.png",
              "/assets/icons/walmart.png",
            ].map((src, i) => (
              <Image key={i} src={src} alt={`platform ${i}`} width={64} height={32} className="inline-block" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
