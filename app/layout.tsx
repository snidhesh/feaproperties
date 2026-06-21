// Pass-through root. The actual <html>/<body> live in app/[locale]/layout.tsx so
// the lang and dir attributes match the requested locale.
export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
