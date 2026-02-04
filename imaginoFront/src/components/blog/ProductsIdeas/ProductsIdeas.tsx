"use client"
import Section from '@/components/shared/Section/Section';

export default function ProductsIdeas() {
  const productsIdeasList = [
    'Beauty & Skincare',
    'Health & Supplement',
    'Candle',
    'Beverage',
    'Jewelry',
    'Perfume',
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <p className="font-bold text-3xl md:text-4xl">Product Photography Ideas</p>
      </div>

      <Section className="px-2 md:px-6">
        <div className="product-ideas justify-center">
          {productsIdeasList.map((idea, index) => (
            <div
              key={index}
              className="product-idea"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                }
              }}
            >
              <span className="font-medium">{idea}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
