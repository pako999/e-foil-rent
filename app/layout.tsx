// Root layout — the [locale] segment provides the real <html>/<body>.
// next-intl renders inside [locale]/layout.tsx; this passthrough exists
// because Next requires a root layout.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
