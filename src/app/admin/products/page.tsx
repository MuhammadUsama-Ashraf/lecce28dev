import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/dal";
import { formatMoney } from "@/lib/money";
import { Badge, EmptyState, LinkButton, PageHeader, Table, Td } from "@/components/admin/ui";
import { ProductStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Drafts" },
  { key: "archived", label: "Archived" },
  { key: "low-stock", label: "Low stock" },
];

function where(filter: string | undefined) {
  switch (filter) {
    case "active":
      return { status: ProductStatus.ACTIVE };
    case "draft":
      return { status: ProductStatus.DRAFT };
    case "archived":
      return { status: ProductStatus.ARCHIVED };
    case "low-stock":
      return { trackStock: true, stock: { lte: 5 } };
    default:
      return {};
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  await requireUser();
  const { filter = "all", q } = await searchParams;

  const products = await db.product.findMany({
    where: {
      ...where(filter),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { slug: { contains: q } }] } : {}),
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { orderItems: true } } },
  });

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Prices, copy, stock and imagery for everything in the catalogue."
        action={<LinkButton href="/admin/products/new" tone="primary">Add product</LinkButton>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/products${tab.key === "all" ? "" : `?filter=${tab.key}`}`}
            className={`rounded-full px-3.5 py-1.5 text-[13px] transition ${
              filter === tab.key
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </Link>
        ))}
        <form className="ml-auto" action="/admin/products">
          {filter !== "all" ? <input type="hidden" name="filter" value={filter} /> : null}
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search products…"
            className="w-56 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-[13px] outline-none focus:border-neutral-900"
          />
        </form>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          hint="Add your first product, or run npm run db:seed to import the catalogue the site shipped with."
          action={<LinkButton href="/admin/products/new" tone="primary">Add product</LinkButton>}
        />
      ) : (
        <Table head={["Product", "Status", "Price", "Stock", "Orders", ""]}>
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-neutral-50">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                    {p.heroImage ? (
                      <Image src={p.heroImage} alt="" fill sizes="44px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="block truncate font-medium underline-offset-2 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="text-[12px] text-neutral-500">/{p.slug}</span>
                  </div>
                </div>
              </Td>
              <Td>
                <Badge
                  tone={
                    p.status === ProductStatus.ACTIVE
                      ? "green"
                      : p.status === ProductStatus.DRAFT
                        ? "amber"
                        : "neutral"
                  }
                >
                  {p.status.toLowerCase()}
                </Badge>
              </Td>
              <Td>
                {formatMoney(p.priceCents, p.currency)}
                {p.compareAtCents ? (
                  <span className="ml-2 text-[12px] text-neutral-400 line-through">
                    {formatMoney(p.compareAtCents, p.currency)}
                  </span>
                ) : null}
              </Td>
              <Td>
                {p.trackStock ? (
                  <span className={p.stock <= 5 ? "font-medium text-amber-700" : ""}>{p.stock}</span>
                ) : (
                  <span className="text-neutral-400">not tracked</span>
                )}
              </Td>
              <Td className="text-neutral-500">{p._count.orderItems}</Td>
              <Td className="text-right">
                <Link href={`/admin/products/${p.id}`} className="text-[13px] text-neutral-600 hover:underline">
                  Edit
                </Link>
              </Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
