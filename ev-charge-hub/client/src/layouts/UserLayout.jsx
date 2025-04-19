import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-white p-4">
      <header className="text-xl font-semibold">EV Recharge Hub</header>
      <main className="mt-4">
        <Outlet />
      </main>
    </div>
  );
}
