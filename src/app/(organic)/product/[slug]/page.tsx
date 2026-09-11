import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductViewerMount } from "@/components/three/SceneMount";
import OrganicProductCard from "@/components/organic/OrganicProductCard";
import SectionTitle from "@/components/organic/SectionTitle";
import AddToCart from "@/components/ui/AddToCart";
import Reveal from "@/components/ui/Reveal";
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

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const toLabel = (p: typeof product) => ({
    kicker: p.label.kicker,
    title: p.label.title,
    scent: p.scent,
    body: p.tagline,
    volume: p.size ?? p.weight,
  });

  const labels = product.includes
    ? product.includes
        .map((name) => products.find((p) => name.startsWith(p.name)))
        .filter((p): p is typeof product => Boolean(p))
        .map(toLabel)
    : [toLabel(product)];
  if (labels.length === 0) labels.push(toLabel(product));

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1400px] px-6 pt-44 lg:px-10 lg:pt-52">
        <nav className="t-body text-[#7A7A7A]">
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>
          <span className="px-2">/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Media */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--oc-stone)]">
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
              <span className="t-body pointer-events-none absolute bottom-4 left-4 rounded-full bg-white/85 px-4 py-1.5 text-[#7A7A7A]">
                Drag to rotate
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--oc-stone)]">
                <Image
                  src={product.image}
                  alt={`${product.name} photographed`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="col-span-2 flex flex-col justify-center rounded-xl bg-[var(--oc-cream)] px-6 py-5">
                <span className="t-body text-[#7A7A7A]">Scent</span>
                <p className="t-stat mt-1">{product.scent}</p>
              </div>
            </div>
          </div>

          {/* Detail */}
          <div>
            <p className="t-body text-[#7A7A7A]">{product.scent}</p>
            <h1 className="t-h2 mt-3">{product.name}</h1>

            <div className="mt-6 flex items-center gap-5">
              <span className="t-stat tabular-nums">{formatPrice(product.price)}</span>
              {product.rating ? (
                <span className="t-body text-[#e8552c]">
                  ★★★★★{" "}
                  <span className="text-[#7A7A7A]">
                    ({product.reviews} review{product.reviews === 1 ? "" : "s"})
                  </span>
                </span>
              ) : null}
            </div>

            <p className="t-body mt-7 text-[#7A7A7A]">{product.description}</p>

            {product.includes ? (
              <div className="mt-8 border-t border-black/12 pt-6">
                <h2 className="t-label">This bundle includes</h2>
                <ul className="mt-4 space-y-2">
                  {product.includes.map((item) => (
                    <li key={item} className="t-body text-[#7A7A7A]">
                      – {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <AddToCart slug={product.slug} />

            <p className="t-body mt-4 text-[#7A7A7A]">
              Free shipping on purchases over 100 dollars. Questions about this formula?{" "}
              <a className="underline underline-offset-4" href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
            </p>

            <dl className="mt-12 divide-y divide-black/12 border-y border-black/12">
              {product.fragrance ? (
                <Row label="Fragrance profile">
                  <span className="block">Top — {product.fragrance.top}</span>
                  <span className="mt-1 block">Middle — {product.fragrance.middle}</span>
                  <span className="mt-1 block">Base — {product.fragrance.base}</span>
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

        <section className="mt-28 pb-24 lg:pb-32">
          <Reveal>
            <SectionTitle kicker="Also" accent="worth a look" align="left" />
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <OrganicProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 py-6 sm:grid-cols-[170px_1fr] sm:gap-8">
      <dt className="t-label text-[#7A7A7A]">{label}</dt>
      <dd className="t-body text-[#7A7A7A]">{children}</dd>
    </div>
  );
}
