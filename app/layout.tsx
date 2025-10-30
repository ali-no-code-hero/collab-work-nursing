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
        <div className="min-h-screen flex flex-col bg-white">
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16">
                <a href="https://app.collabwork.com/" className="flex items-center">
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
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">© {new Date().getFullYear()} CollabWORK.</p>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <a href="#" className="hover:text-gray-900">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-900">Terms of Service</a>
                  <a href="#" className="hover:text-gray-900">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
