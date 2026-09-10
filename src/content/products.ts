export type Vessel = "pump" | "jar" | "trio";

export type Product = {
  slug: string;
  name: string;
  scent: string;
  price: number;
  image: string;
  vessel: Vessel;
  accent: string;
  /** The two-line lockup printed on the physical label. */
  label: { kicker: string; title: string };
  rating: number | null;
  reviews: number;
  tagline: string;
  description: string;
  includes?: string[];
  fragrance?: { top: string; middle: string; base: string };
  ingredients: string;
  directions: string;
  size?: string;
  weight: string;
  dimensions: string;
};

const FUMO = {
  top: "Italian Bergamot, Guatemala Cardamom, Incense",
  middle: "White Tuberose, Sea Coconut, Clove",
  base: "White Musk, Tonka Bean, Amber, Smoked Guaiac",
};

export const products: Product[] = [
  {
    slug: "chamomile-olive-oil",
    name: "Chamomile & Olive Oil Body Wash",
    scent: "Fumo di Cocco",
    price: 48,
    image: "/products/body-wash.webp",
    vessel: "pump",
    accent: "#A2662B",
    label: { kicker: "Chamomile & Olive Oil", title: "Body Wash" },
    rating: 5,
    reviews: 3,
    tagline: "A comforting, delightfully foaming cleanser.",
    description:
      "A gentle cleanser featuring natural Chamomile extract and skin-smoothing Olive Oil. Wonderful for use as a daily shower or bath gel. Free from parabens, phthalates and harsh detergents.",
    fragrance: FUMO,
    ingredients:
      "Aqua, Decyl Glucoside, Cocamidopropyl Betaine, Disodium Cocoamphodiacetate, PEG-7 Olivate, Sodium Chloride, Chamomilla Recutita Flower Extract, Glycerin, Phenoxyethanol, Caprylyl Glycol, Parfum.",
    directions:
      "Apply to moistened skin with fingers or damp cloth in light circular and massaging motions — avoiding direct contact with eyes. Rinse with warm water. Follow with moisturizer for optimal results.",
    size: "16 fl. oz. / 473 ml",
    weight: "1.5 lbs",
    dimensions: "4.5 × 4.5 × 8.5 in",
  },
  {
    slug: "natural-body-butter",
    name: "Natural Body Butter",
    scent: "Fumo di Cocco",
    price: 44,
    image: "/products/body-butter.webp",
    vessel: "jar",
    accent: "#8B5A2B",
    label: { kicker: "Natural", title: "Body Butter" },
    rating: 5,
    reviews: 2,
    tagline: "Thick, long-lasting, over 98% natural.",
    description:
      "This thick, long-lasting cream moisturizes even the driest skin. Includes natural Sunflower, Soybean and Jojoba Oils plus Aloe Vera and Chamomile Extract on a traditional Beeswax foundation. Wonderful on chapped areas — feet, elbows, knees and heels. Over 98% natural with more than 50% oil content, and never a greasy residue.",
    fragrance: FUMO,
    ingredients:
      "Helianthus Annuus (Sunflower) Seed Oil, Soja Hispida (Soybean) Oil, Deionized Water, Simmondsia Chinensis (Jojoba) Seed Oil, Emulsifying Wax NF, Sodium Cerotate (Saponified Beeswax), Aloe Barbadensis Leaf Juice, Chamomilla Recutita Flower Extract, Phenoxyethanol, Caprylyl Glycol, Fragrance.",
    directions:
      "Apply a generous amount to skin in circular and massaging motions. Concentrate on rough, cracked and dry areas.",
    size: "8 oz",
    weight: "1.5 lbs",
    dimensions: "4.5 × 4.5 × 8.5 in",
  },
  {
    slug: "jojoba-intense-therapy",
    name: "Jojoba Intense Therapy Body Lotion",
    scent: "Fumo di Cocco",
    price: 48,
    image: "/products/body-lotion.webp",
    vessel: "pump",
    accent: "#9B6230",
    label: { kicker: "Jojoba Intense Therapy", title: "Body Lotion" },
    rating: 5,
    reviews: 3,
    tagline: "All that you expect from a professional spa quality lotion.",
    description:
      "Avocado Oil, Jojoba Oil and Aloe Vera work together to protect the skin. Shea Butter and Silk Amino Acids deliver softness, while Vitamin E and Grape Seed Oil offer antioxidant protection beneath a subtle, lingering scent.",
    fragrance: FUMO,
    ingredients:
      "Deionized Water, Grape Seed Oil, Avocado Oil, Caprylic/Capric Triglyceride, Emulsifying Wax, Glyceryl Stearate, Jojoba Seed Oil, Shea Butter, Aloe Leaf Juice, Stearic Acid, Vitamin E, Silk Amino Acids, Glycerine, Sorbitol, Cyclopentasiloxane, Phenoxyethanol, Caprylyl Glycol, Methyl Cellulose, Allantoin, Fragrance.",
    directions:
      "Apply generous amount to skin in circular and massaging motions. Concentrate on rough, cracked and dry areas.",
    size: "16 oz",
    weight: "1.5 lbs",
    dimensions: "4.5 × 4.5 × 8.5 in",
  },
  {
    slug: "shower-bundle",
    name: "Shower Bundle",
    scent: "Fumo di Cocco",
    price: 88,
    image: "/products/shower-bundle.webp",
    vessel: "trio",
    accent: "#A2662B",
    label: { kicker: "Shower", title: "Bundle" },
    rating: null,
    reviews: 0,
    tagline: "A complete spa-quality experience at home.",
    description:
      "Step into a world of luxurious pampering with our Shower Bundle, designed to provide a complete spa-quality experience in the comfort of your own bathroom.",
    includes: ["Chamomile & Olive Oil Body Wash", "Jojoba Intense Therapy Body Lotion"],
    fragrance: FUMO,
    ingredients:
      "Body Wash — Aqua, Decyl Glucoside, Cocamidopropyl Betaine, Chamomilla Recutita (Chamomile) Flower Extract, Glycerin, Phenoxyethanol, Parfum. Body Lotion — Aqua, Vitis Vinifera (Grape) Seed Oil, Persea Gratissima (Avocado) Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Butyrospermum Parkii (Shea Butter), Aloe Barbadensis Leaf Juice, Tocopherol (Vitamin E), Glycerin.",
    directions:
      "Apply the body wash to moistened skin in light circular and massaging motions, then rinse with warm water. Follow with the lotion, applied generously in circular and massaging motions, concentrating on dry areas.",
    weight: "4 lbs",
    dimensions: "9 × 12 × 4 in",
  },
  {
    slug: "body-bundle",
    name: "Body Bundle",
    scent: "Fumo di Cocco",
    price: 128,
    image: "/products/body-bundle.png",
    vessel: "trio",
    accent: "#8B5A2B",
    label: { kicker: "Body", title: "Bundle" },
    rating: 5,
    reviews: 1,
    tagline: "A comprehensive skin care regimen.",
    description:
      "Delve into the world of luxury self-care with our Body Bundle; meticulously crafted to deliver a comprehensive skin care regimen. The trio of body wash, lotion and butter is designed to pamper and hydrate the skin. Wash and lotion are clean; the butter is vegan.",
    includes: [
      "Chamomile & Olive Oil Body Wash",
      "Jojoba Intense Therapy Body Lotion",
      "Natural Body Butter",
    ],
    fragrance: FUMO,
    ingredients:
      "Body Wash — olive esters, chamomile extract, glycerin. Body Butter — jojoba, sunflower and soybean oils, aloe, chamomile. Body Lotion — jojoba, grape seed and avocado oils, shea butter, aloe, vitamin E.",
    directions:
      "Body Wash: apply to moistened skin with fingers or damp cloth in light circular and massaging motions. Body Butter & Lotion: apply generously in circular motions, concentrating on dry areas.",
    weight: "4 lbs",
    dimensions: "9 × 12 × 4 in",
  },
  {
    slug: "natural-body-butter-unscented",
    name: "Natural Body Butter Unscented",
    scent: "Unscented",
    price: 44,
    image: "/products/body-butter-unscented.png",
    vessel: "jar",
    accent: "#B08D57",
    label: { kicker: "Natural / Unscented", title: "Body Butter" },
    rating: null,
    reviews: 0,
    tagline: "The same rich cream, entirely fragrance-free.",
    description:
      "This thick, long-lasting cream moisturizes even the driest skin. Includes natural Sunflower, Soybean and Jojoba Oils plus Aloe Vera and Chamomile Extract. Designed for chapped skin, feet, elbows, knees and heels on a traditional beeswax base. Over 98% natural with over 50% oil content, leaving skin soft without a greasy feel.",
    ingredients:
      "Helianthus Annuus (Sunflower) Seed Oil, Soja Hispida (Soybean) Oil, Aqua (Deionized Water), Simmondsia Chinensis (Jojoba) Seed Oil, Emulsifying Wax NF, Sodium Cerotate, Aloe Barbadensis Leaf Juice, Chamomilla Recutita Flower Extract (Chamomile), Phenoxyethanol, Caprylyl Glycol.",
    directions:
      "Apply a generous amount to skin in circular and massaging motions. Concentrate on rough, cracked and dry areas.",
    size: "8 oz",
    weight: "1.5 lbs",
    dimensions: "4.5 × 4.5 × 8.5 in",
  },
  {
    slug: "natural-body-scrub-fumo-di-cocco",
    name: "Natural Body Scrub",
    scent: "Fumo di Cocco",
    price: 38,
    image: "/products/body-scrub.png",
    vessel: "jar",
    accent: "#C08A4A",
    label: { kicker: "Natural", title: "Body Scrub" },
    rating: null,
    reviews: 0,
    tagline: "Finely milled sugar, therapeutic oils.",
    description:
      "A light exfoliant of finely milled sugar granules and therapeutic ingredients that gently polishes away dead skin cells, revealing a smoother, more radiant complexion. Formulated with Organic High Oleic Sunflower Seed Oil rich in vitamins A, D and E to deeply nourish dry, weathered, aged or damaged skin.",
    fragrance: FUMO,
    ingredients:
      "Sugar, Glycerin (Kosher Vegetable), Organic High Oleic Helianthus Annuus (Sunflower) Oil, Cocos Nucifera (Coconut) Oil, Silica, Dimethyl Sulfone (MSM), Aleurites Molacana (Kukui Nut) Oil, Macadamia Ternifolia Seed Oil, Tocopherol Acetate (Vitamin E), Parfum.",
    directions:
      "Gently massage over wet skin in a circular motion, concentrating on dry and rough areas. Thoroughly rinse with warm water. Gentle enough for daily use.",
    weight: "1.5 lbs",
    dimensions: "4.5 × 4.5 × 8.5 in",
  },
  {
    slug: "bellissimo-bundle",
    name: "Bellissimo Bundle",
    scent: "Fumo di Cocco & Unscented",
    price: 110,
    image: "/products/bellissimo-bundle.png",
    vessel: "trio",
    accent: "#C08A4A",
    label: { kicker: "Bellissimo", title: "Bundle" },
    rating: null,
    reviews: 0,
    tagline: "The ultimate indulgence in skincare.",
    description:
      "The ultimate indulgence in skincare, bringing together three luxurious products designed to nourish, hydrate and rejuvenate your skin. Each item contains over 98% natural ingredients suitable for sensitive skin types.",
    includes: [
      "Natural Body Butter — Fumo di Cocco",
      "Natural Body Butter — Unscented",
      "Natural Body Scrub — Fumo di Cocco",
    ],
    ingredients:
      "Body Scrub — sugar, glycerin, sunflower oil, coconut oil, silica, MSM, kukui nut oil, macadamia oil, vitamin E, fragrance. Body Butter (Fumo di Cocco) — sunflower seed oil, soybean oil, deionized water, jojoba seed oil, emulsifying wax, saponified beeswax, aloe vera juice, chamomile extract, phenoxyethanol, caprylyl glycol, fragrance. Body Butter (Unscented) — the same, fragrance-free.",
    directions:
      "Apply butter generously in circular motions, concentrating on dry areas. For the scrub, massage gently over wet skin in circular motions; safe for daily use.",
    weight: "4 lbs",
    dimensions: "9 × 12 × 4 in",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
