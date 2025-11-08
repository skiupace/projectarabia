import { Link, useRouterState } from "@tanstack/react-router";

export default function BoardFooter() {
  const route = useRouterState({ select: (state) => state.location.pathname });

  return (
    route === "/" && (
      <footer className="w-full border-t border-gray-300 text-xs font-mono text-gray-600 bg-amber-50">
        <div className="max-w-6xl mx-auto px-2 py-4">
          {/* Search Bar */}
          <div className="flex justify-center mb-3">
            <input
              type="text"
              placeholder="بحث..."
              className="w-full max-w-md px-2 py-1 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 text-center">
            <Link to="/guides" className="hover:underline">
              الإرشادات
            </Link>
            <span>|</span>
            <Link to="/tips" className="hover:underline">
              النصائح
            </Link>
            <span>|</span>
            <Link to="/faq" className="hover:underline">
              الأسئلة الشائعة
            </Link>
            <span>|</span>
            <Link to="/security" className="hover:underline">
              الأمان
            </Link>
            <span>|</span>
            <Link to="/legal" className="hover:underline">
              القانونية
            </Link>
            <span>|</span>
            <Link to="/contact" className="hover:underline">
              تواصل
            </Link>
          </div>

          {/* Made with love */}
          <div className="flex justify-center mt-3 text-gray-500">
            <span>صُنع بـ ♥ بواسطة </span>
            <a
              href="https://x.com/v0id_user"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 hover:underline"
            >
              V0ID#
            </a>
          </div>
        </div>
      </footer>
    )
  );
}
