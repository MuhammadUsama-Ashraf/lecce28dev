import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/** Chrome for the original lecce28.com replica, parked under /classic. */
export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
