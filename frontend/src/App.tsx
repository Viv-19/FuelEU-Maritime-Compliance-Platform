function App() {
  const navItems = ['Routes', 'Compare', 'Banking', 'Pooling'] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FuelEU Maritime Dashboard
            </span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Compliance management for FuelEU Maritime regulation
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {navItems.map((item) => (
            <button
              key={item}
              id={`nav-${item.toLowerCase()}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center font-medium transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-lg hover:shadow-cyan-400/10"
            >
              <span className="relative z-10">{item}</span>
              <div className="absolute inset-0 -translate-y-full bg-gradient-to-b from-cyan-400/10 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
            </button>
          ))}
        </div>
      </nav>

      {/* Content placeholder */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-slate-400">
            Select a module above to get started.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
