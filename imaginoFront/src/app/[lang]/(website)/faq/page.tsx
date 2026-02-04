import Container from '@/components/shared/Container/Container';
import Section from '@/components/shared/Section/Section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Metadata } from 'next';
import faqData from './_data/faq';

export const metadata: Metadata = {
  title: 'IMAGINO - FAQ',
  description: 'Explore most Asked Questions and answers !',
};

export default function FAQPage() {
  return (
    <Container>
      <Section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>

          <p className="text-center mb-10 text-sm sm:text-base text-muted-foreground">
            Answers to the most common questions about the product, pricing, and usage. If you still
            can{"'"}t find what you{"'"}re looking for, contact support.
          </p>

          <div className="w-full">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData?.map((item, index) => (
                <AccordionItem
                  value={`item-${index}`}
                  key={index}
                  className="faq-item" 
                >
                  <AccordionTrigger className="faq-trigger">
                    <span className="faq-question">{item.question}</span>
                  </AccordionTrigger>

                  <AccordionContent className="faq-content">
                    <div className="text-base leading-relaxed">{item.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Section>
    </Container>
  );
}
