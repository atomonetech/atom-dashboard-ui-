import { Bell, User } from 'lucide-react';

export default function AnalysisHeader({ breadcrumb = [] }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumb.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">
                {item}
              </span>

              {idx < breadcrumb.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </header>
  );
}