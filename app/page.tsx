import Link from "next/link";
import { Poppins } from "next/font/google";
import { ArrowRight, Check } from "lucide-react";

export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Jotly",
  description: "Jotly is a note-taking app",
};

export const features = [
  {
    title: "Minimalist Design",
    description:
      "A clean and simple interface that makes it easy to focus on your notes.",
  },
  {
    title: "On-Device Storage",
    description:
      "Your notes are stored locally, so you can access them from any device.",
  },
  {
    title: "Endless Creation",
    description: "You can create as many notes as you want without any limit.",
  },
];

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-[f0f7f4] ${poppins.variable} font-sans flex flex-col`}
    >
      {/* Hero Section */}
      <header className="relative overflow-hidden flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Meet <span className="text-[#ff7d52]">Jotly</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              A minimalist note-taking app that helps you capture your thoughts
              and ideas with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/notes"
                className="bg-[#ff7d52] hover:bg-[#d3603a]/90 text-white px-3 py-1 rounded-lg font-medium text-lg transition-colors flex items-center gap-2"
              >
                welcome
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-6 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="mb-6 flex items-center gap-4">
              <div>
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800/80 text-start">
                  {feature.title}
                </h2>
                <p className="text-gray-600 text-sm text-start">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Footer */}
      <footer className="border-t border-border bg-gray-50 py-2">
        <div className="mt-4 md:mt-0">
          <p className="text-xs font-extralight text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Jotly. Made by Amour Omar.
          </p>
        </div>
      </footer>
    </div>
  );
}
