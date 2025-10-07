import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Jobs — CollabWORK‑inspired",
  description: "Minimal jobs page styled with a CollabWORK‑inspired look",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary" />
            <span className="text-lg font-semibold tracking-tight text-ink">Home</span>
              </a>
            {/* menu removed per request */}
          </div>
        </header>

          <main className="flex-1">{children}</main>
          <footer className="border-t border-black/5">
            <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-ink-soft">
              <p>© {new Date().getFullYear()} CollabWORK.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
