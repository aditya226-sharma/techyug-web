import "./globals.css";

export const metadata = {
  title: "TechYug Innovations",
  description: "Academic and Technology Ecosystem Gateway",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
