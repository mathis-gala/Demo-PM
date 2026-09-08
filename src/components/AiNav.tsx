import { Link } from '@tanstack/react-router';

const baseButtonClass =
  'w-[200px] rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800';

export default function AiNav() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <Link to="/classif-ai" className={baseButtonClass}>
        AI Classification Idea
      </Link>
      <Link to="/translate-ai" className={baseButtonClass}>
        AI Text Translation
      </Link>
      <Link to="/gift-simulation" className={baseButtonClass}>
        Simulation cadeaux
      </Link>
    </div>
  );
}
