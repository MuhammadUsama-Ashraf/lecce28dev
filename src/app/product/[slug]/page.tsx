import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/ui/AddToCart";
import ProductCard from "@/components/ui/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { ProductViewerMount } from "@/components/three/SceneMount";
import { formatPrice, getProduct, products } from "@/content/products";
import { SUPPORT_EMAIL } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} ${product.scent}`,
    description: product.description,
    openGraph: { images: [product.image] },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const toLabel = (p: typeof product) => ({
    kicker: p.label.kicker,
    title: p.label.title,
    scent: p.scent,
    body: p.tagline,
    volume: p.size ?? p.weight,
  });

  // A bundle renders the labels of the products actually inside it.
  const labels = product.includes
    ? product.includes
        .map((name) => products.find((p) => name.startsWith(p.name)))
        .filter((p): p is typeof product => Boolean(p))
        .map(toLabel)
    : [toLabel(product)];

  if (labels.length === 0) labels.push(toLabel(product));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-20">
      <nav className="eyebrow text-ink-soft">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Media: interactive 3D vessel + the studio photograph */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden bg-sand-100">
            <ProductViewerMount
              vessel={product.vessel}
              color={product.accent}
              labels={labels}
              fallback={
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              }
            />
            <span className="pointer-events-none absolute bottom-4 left-4 eyebrow text-ink-soft">
              Drag to rotate
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="relative col-span-1 aspect-square overflow-hidden bg-sand-100">
              <Image
                src={product.image}
                alt={`${product.name} photographed`}
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>
            <div className="col-span-2 flex flex-col justify-center bg-sand-100 px-5 py-4">
              <span className="eyebrow text-ink-soft">Scent</span>
              <p className="mt-1 font-display text-lg">{product.scent}</p>
            </div>
          </div>
        </div>

        {/* Detail */}
        <div>
          <span className="eyebrow text-ink-soft">{product.scent}</span>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] font-light">
            {product.name}
          </h1>
          <div className="mt-5 flex items-center gap-4">
            <span className="text-xl tabular-nums">{formatPrice(product.price)}</span>
            {product.rating ? (
              <span className="text-sm text-gold">
                {"★".repeat(Math.round(product.rating))}{" "}
                <span className="text-xs text-ink-soft">
                  ({product.reviews} review{product.reviews === 1 ? "" : "s"})
                </span>
              </span>
            ) : null}
          </div>

          <p className="mt-7 text-[15px] leading-[1.9] text-ink-soft">
            {product.description}
          </p>

          {product.includes ? (
            <div className="mt-8 border-t hairline pt-6">
              <h2 className="eyebrow">This bundle includes</h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                {product.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-gold">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <AddToCart slug={product.slug} />

          <p className="mt-4 text-xs text-ink-soft">
            Free shipping on purchases over 100 dollars. Questions about this formula?{" "}
            <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>

          <dl className="mt-12 divide-y hairline border-y hairline">
            {product.fragrance ? (
              <Row label="Fragrance profile">
                <span className="block">
                  <b className="font-medium">Top</b> — {product.fragrance.top}
                </span>
                <span className="mt-1 block">
                  <b className="font-medium">Middle</b> — {product.fragrance.middle}
                </span>
                <span className="mt-1 block">
                  <b className="font-medium">Base</b> — {product.fragrance.base}
                </span>
              </Row>
            ) : null}
            <Row label="Directions for use">{product.directions}</Row>
            <Row label="Ingredients">{product.ingredients}</Row>
            <Row label="Additional information">
              {product.size ? `Size: ${product.size} · ` : ""}
              Weight: {product.weight} · Dimensions: {product.dimensions}
            </Row>
          </dl>
        </div>
      </div>

      <section className="mt-28">
        <Reveal immediate>
          <h2 className="font-display text-3xl font-light">You may also like</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 py-6 sm:grid-cols-[160px_1fr] sm:gap-8">
      <dt className="eyebrow text-ink-soft">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}
