import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LayoutPrivate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
      <Footer />
    </>
  );
}
