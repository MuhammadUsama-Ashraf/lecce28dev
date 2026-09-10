import { SUPPORT_EMAIL } from "./site";

export type PolicySection = { heading: string; paragraphs: string[]; list?: string[] };

export const privacyIntro = [
  "Thank you for visiting Lecce 28.",
  "Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, disclose and safeguard your data when you visit our website and make purchases.",
];

export const privacy: PolicySection[] = [
  {
    heading: "What information is covered by this Privacy Policy?",
    paragraphs: [
      "This Privacy Policy covers all personal information that we collect, use and process — which means information that (either in isolation or in combination with other information) enables you to be identified directly or indirectly.",
    ],
  },
  {
    heading:
      "What personal information do we collect from you and how do we collect that information?",
    paragraphs: [
      "The types of personal information we may collect, and hold, vary depending on the nature of our interaction with you and may include:",
    ],
    list: [
      "Identifying and contact information such as your name, postal and email address, telephone number, gender, date of birth and title;",
      "Payment information;",
      "Individual distinctions and insights such as skin concerns and adverse experiences;",
      "Product preferences and other information.",
    ],
  },
  {
    heading: "How do we collect it?",
    paragraphs: ["We may collect your personal information in a number of ways including when you:"],
    list: [
      "Visit our website and register an account with us and/or purchase products through our website;",
      "Correspond with us across any of our channels (e.g. messaging platforms such as social media and email). We typically collect your personal information directly from you. On some occasions, we may collect your personal information from third parties such as payment platform providers.",
    ],
  },
  {
    heading: "How do we use your personal information?",
    paragraphs: [],
    list: [
      "We process your personal information including your payment details (credit card, debit card and/or other payment details) to fulfil your purchase orders for our products. We also process this information to keep your payment details safe and protect you against fraudulent transactions. We process details of your device when you shop on our website to enable us to detect any fraudulent transactions or suspicious purchasing activity.",
      "It is in our legitimate interests to process personal information to keep payments secure and necessary for the performance of our contract with you. Providing us with certain personal information is voluntary but we may not be able to process your order and send you the required order acknowledgment and shipping confirmation e-mails if you do not provide us with certain requested information.",
      "To provide you with products and services that you have purchased from us. We may need to use your name and contact details to perform our obligations under a contract with you (e.g. where you have purchased a product from us).",
      "To understand and analyze our sales, your needs and preferences. We may use your information such as your geographical location to help us conduct focused market research (such as surveys) based on trends and common factors so that we develop, enhance, market and provide products and services to meet your individual needs.",
      "To process exchanges or returns. We process your personal information to perform our obligations under our contract with you.",
      `To respond to requests or complaints. If you contact Lecce 28 from our site or by email at ${SUPPORT_EMAIL}, Lecce 28 will collect your personal information and use this to identify you as a customer, help with your query, process your order, process payments, deliver products and services, update our records and to generally manage your account with us under our terms with you.`,
    ],
  },
  {
    heading: "How do we protect your personal information?",
    paragraphs: [],
    list: [
      "At Lecce 28, payments are processed securely through Stripe, a trusted and PCI DSS compliant payment gateway. We do not store your credit card information on our servers.",
      "We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.",
    ],
  },
  {
    heading: "Do we share your information?",
    paragraphs: [],
    list: [
      "We may share your information with third-party service providers, such as shipping and payment processors, to facilitate the fulfillment of your orders.",
      "Legal Requirements: We may disclose your information if required by law or in response to legal processes, such as court orders or subpoenas.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We reserve the right to update this Privacy Policy to reflect changes in our practices and services. We encourage you to review this policy periodically for any updates.",
      `If you have any questions or concerns regarding this Privacy Policy, please contact us at ${SUPPORT_EMAIL}.`,
      "By using our website, you agree to the terms outlined in this Privacy Policy. Your continued use of our services constitutes acceptance of any updates or changes to the policy.",
    ],
  },
];

export const terms: PolicySection[] = [
  {
    heading: "Definitions and Application",
    paragraphs: [
      'In these Terms and Conditions "You" means the organization or individual who is accessing or ordering product on the website; "Products" means the Lecce 28 products which may be ordered on the website.',
      "These terms govern purchases delivered within the United States.",
    ],
  },
  {
    heading: "Shipping Costs and Deliveries",
    paragraphs: [
      "We aim to deliver within the stated timeframes, however we cannot guarantee firm delivery dates or times. Delivery estimates provided during checkout are indicative only.",
    ],
  },
  {
    heading: "Orders",
    paragraphs: [
      "Lecce 28 reserves the authority to reject any order and will refund payments accordingly.",
      "Products are restricted for personal use and gifting exclusively. They must not be resold in any form or any place.",
    ],
  },
  {
    heading: "Prices and Payment",
    paragraphs: [
      "All pricing is displayed in US dollars excluding sales tax, with the final total shown at checkout. The order amount comprises the product subtotal, delivery costs and any agreed-upon fees. Credit card payment via Stripe is required.",
    ],
  },
  {
    heading: "Warranty",
    paragraphs: [
      "Services are provided as is without any warranty. We disclaim warranties regarding merchantability and fitness for a particular purpose.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: [
      "We limit liability for indirect or consequential damages, and reserve the right to withhold products and refuse service for non-payment.",
    ],
  },
  {
    heading: "Product Disclaimer and Community Guidelines",
    paragraphs: [
      "Our products are non-medicinal and contain naturally-derived ingredients. We discourage purchases from individuals involved in cosmetic litigation and emphasize community responsibility over exploitation.",
      `Questions about these terms can be sent to ${SUPPORT_EMAIL}.`,
    ],
  },
];
