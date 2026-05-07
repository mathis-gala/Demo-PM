import { Outlet } from '@tanstack/react-router';

export default function App() {
  return (
    <div className="min-h-full bg-white">
      <Outlet />
    </div>
  );
}
