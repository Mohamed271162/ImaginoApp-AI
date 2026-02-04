interface IFAQ {
  question: string;
  answer: string;
}

const faqData: IFAQ[] = [
  {
    question: 'What is Imagino?',
    answer:
      'Imagino is an AI-powered product photography platform that helps you generate professional product images quickly and efficiently.',
  },
  {
    question: 'Can I use Imagino for e-commerce?',
    answer:
      'Yes! You can generate product images for Shopify, WooCommerce, or any online store. It works with any product category.',
  },
  {
    question: 'Do I need design skills?',
    answer:
      'No design skills are required. The AI automatically handles all image generation based on your instructions.',
  },
  {
    question: 'How fast can I generate images?',
    answer:
      'You can generate multiple high-quality product images in a few minutes, depending on the number of products.',
  },
  {
    question: 'Can I customize backgrounds and brand colors?',
    answer:
      'Yes! You can specify background styles, brand colors, and other attributes for your images.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Imagino offers a free trial so you can test the platform and generate sample images before subscribing.',
  },
  {
    question: 'What formats are supported?',
    answer: 'The platform allows you to download images in standard formats such as JPG and PNG.',
  },
  {
    question: 'Can I use my own reference images?',
    answer:
      'Yes, you can upload reference images to guide the AI in generating your desired product shots.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Imagino follows strict security protocols to ensure your images and data are protected.',
  },
  {
    question: 'Can I collaborate with team members?',
    answer:
      'Yes, you can share projects and collaborate with team members directly within the platform.',
  },
];

export default faqData;
