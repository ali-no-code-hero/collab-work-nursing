import "./globals.css";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { DarkModeProvider } from "../components/DarkModeProvider";
import DarkModeToggle from "../components/DarkModeToggle";

export const metadata = {
  title: "Nurse Ascent Powered By CollabWork",
  description: "A Career Newsletter for Nurses, By Nurses",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💼</text></svg>",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-200">
        <DarkModeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-surface-dark overflow-x-hidden transition-colors duration-200">
            <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm dark:shadow-none backdrop-blur-sm bg-white/95 dark:bg-surface-dark/95 transition-colors duration-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <a href="/" className="flex items-center group">
                    <img 
                      src="https://api.collabwork.com/vault/7QXnOupJ/_zUOeSNkecxgm-t_EJdHBzryyqw/JXug4w../with_padding.png" 
                      alt="Nurse Ascent Logo" 
                      className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                    />
                  </a>
                  <DarkModeToggle />
                </div>
              </div>
            </header>

            <main className="flex-1">{children}</main>
            <footer className="border-t border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark transition-colors duration-200">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 dark:text-ink-dark-soft">© {new Date().getFullYear()} CollabWORK.</p>
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-ink-dark-soft">
                    <a href="https://www.collabwork.com/privacy-notice" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-ink-dark transition-colors">Privacy Policy</a>
                    <a href="https://www.collabwork.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-ink-dark transition-colors">Terms of Service</a>
                    <a href="https://www.collabwork.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-ink-dark transition-colors">Contact</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </DarkModeProvider>
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
