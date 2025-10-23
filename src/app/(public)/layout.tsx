export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </>
  );
}
