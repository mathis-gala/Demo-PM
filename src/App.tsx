export default function App() {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Demo PM</h1>
              <p className="mt-2 text-sm text-slate-300">
                Vite + React + TypeScript + Tailwind + GitHub Pages
              </p>
            </div>
            <a
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              href="https://vite.dev"
              target="_blank"
              rel="noreferrer"
            >
              Vite docs
            </a>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <p>
              Edit <code className="rounded bg-black/30 px-1.5 py-0.5">src/App.tsx</code> and save to
              test HMR.
            </p>
            <p>
              When deployed to GitHub Pages, asset paths are configured via{' '}
              <code className="rounded bg-black/30 px-1.5 py-0.5">VITE_BASE</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

