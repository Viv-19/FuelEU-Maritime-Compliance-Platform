import { Link, useLocation } from 'react-router-dom';

export const TabLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Routes', path: '/routes' },
    { name: 'Compare', path: '/compare' },
    { name: 'Banking', path: '/banking' },
    { name: 'Pooling', path: '/pooling' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center py-8 text-center max-sm:pb-4 mb-4">
            <div className="flex items-center gap-4 justify-center mb-2">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-all duration-200 hover:scale-105">
                <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-600">FuelEU Maritime Dashboard</h1>
            </div>
            <div className="mt-3 inline-flex items-center bg-sky-50 border border-sky-200 text-sky-800 px-5 py-2 rounded-lg text-sm font-medium shadow-sm">
              Monitor and manage maritime route compliance.
            </div>
          </div>
          <nav className="flex justify-center space-x-8 -mb-px" aria-label="Tabs">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-150`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
};
