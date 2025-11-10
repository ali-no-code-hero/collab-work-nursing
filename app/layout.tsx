import "./globals.css";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export const metadata = {
  title: "Jobs — CollabWORK‑inspired",
  description: "Minimal jobs page styled with a CollabWORK‑inspired look",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16">
                <a href="/" className="flex items-center">
                  <img 
                    src="https://api.surveyjs.io/private/Surveys/files?name=ec679579-87c3-4066-bb6a-df9e969152e6" 
                    alt="CollabWork Logo" 
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">© {new Date().getFullYear()} CollabWORK.</p>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
                  <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-900">Terms of Service</a>
                  <a href="#" className="hover:text-gray-900">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "u1fvm7mhly");
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
