import { useState } from 'react';
import { AIDemo } from './features/ai';
import AiNav from './components/AiNav';
import TranslateHome from './translate-ai/home/Home';

type DemoView = 'nav' | 'classification' | 'translation';

export default function App() {
  const [view, setView] = useState<DemoView>('nav');

  return (
    <div className="min-h-full bg-white">
      {view === 'nav' ? <AiNav onSelect={setView} /> : null}
      {view === 'classification' ? <AIDemo /> : null}
      {view === 'translation' ? <TranslateHome /> : null}
    </div>
  );
}
