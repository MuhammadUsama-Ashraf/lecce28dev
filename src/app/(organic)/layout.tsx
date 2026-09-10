import OrganicHeader from "@/components/organic/OrganicHeader";
import OrganicFooter from "@/components/organic/OrganicFooter";

/** Chrome for the new organic-style front page. */
export default function OrganicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="organic flex min-h-full flex-col">
      <OrganicHeader />
      {children}
      <OrganicFooter />
    </div>
  );
}
