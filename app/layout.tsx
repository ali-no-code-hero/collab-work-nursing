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
          <div className="h-screen flex flex-col bg-white dark:bg-surface-dark overflow-x-hidden transition-colors duration-200">
            <header className="flex-shrink-0 border-b border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-sm dark:shadow-none backdrop-blur-sm bg-white/95 dark:bg-surface-dark/95 transition-colors duration-200">
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

            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </DarkModeProvider>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              try {
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                t.onerror=function(){/* Suppress Clarity loading errors */};
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              } catch(e) {
                // Suppress Clarity initialization errors
                if (typeof console !== 'undefined' && console.error) {
                  console.error('Clarity initialization error:', e);
                }
              }
            })(window, document, "clarity", "script", "u1fvm7mhly");
          `}
        </Script>
        <Script id="suppress-clarity-errors" strategy="afterInteractive">
          {`
            // Suppress Clarity-related errors from global error handler
            if (typeof window !== 'undefined') {
              const originalOnError = window.onerror;
              window.onerror = function(message, source, lineno, colno, error) {
                // Suppress Clarity script errors but allow other errors
                if (source && source.includes('clarity')) {
                  return true; // Suppress the error
                }
                if (originalOnError) {
                  return originalOnError.call(this, message, source, lineno, colno, error);
                }
                return false; // Let default error handling proceed
              };
              
              // Also handle unhandled promise rejections from Clarity
              window.addEventListener('unhandledrejection', function(event) {
                const reason = event.reason;
                if (reason && typeof reason === 'string' && reason.includes('clarity')) {
                  event.preventDefault(); // Suppress Clarity promise rejections
                }
              });
            }
          `}
        </Script>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.onerror=function(){/* Suppress Facebook Pixel loading errors from ad blockers */};
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            // Check if fbq is available before calling (handles ad blocker scenarios)
            if(typeof fbq !== 'undefined') {
              try {
                fbq('init', '2150111775458129');
                fbq('track', 'PageView');
              } catch(e) {
                // Silently handle if pixel is blocked
              }
            }
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2150111775458129&ev=PageView&noscript=1"
            alt=""
            loading="lazy"
          />
        </noscript>
        <Analytics />
      </body>
    </html>
  );
}
