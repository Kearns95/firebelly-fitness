import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Dumbbell, LogOut } from "lucide-react";

import { logoutUser } from "@/Redux/actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FirebellyMark } from "@/components/common/FirebellyMark";
import useWorkoutRealtime from "@/features/workout/useWorkoutRealtime";

const NAV = [
  { to: "/", label: "Schedule", icon: CalendarDays, end: true },
  { to: "/workouts", label: "Workouts", icon: Dumbbell, end: false },
];

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
          isActive
            ? "bg-primary/12 text-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn("size-4.5", isActive && "text-primary")}
            aria-hidden="true"
          />
          {label}
        </>
      )}
    </NavLink>
  );
}

/** Protected app shell: persistent side nav on desktop, top bar on mobile. */
export function AppLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // App-wide workout realtime + client load (no-op until the socket connects).
  useWorkoutRealtime();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const displayName = user?.firstName || user?.name || user?.email || "Coach";

  return (
    <div className="bg-background text-foreground min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="bg-[linear-gradient(180deg,#020617,#0f172a_55%,#1e293b)] hidden flex-col border-r p-4 md:flex">
        <div className="mb-8 flex items-center gap-2.5 px-1">
          <FirebellyMark className="size-9" />
          <span className="font-display text-lg font-bold tracking-tight">
            Firebelly
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="border-t pt-4">
          <div className="px-1 pb-3">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user?.isTrainer ? "Trainer" : "Client"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="bg-card/80 sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <FirebellyMark className="size-7" />
          <span className="font-display font-bold">Firebelly</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
          <LogOut className="size-4" />
        </Button>
      </header>

      <main className="min-w-0">
        <Outlet />
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="bg-card/90 fixed inset-x-0 bottom-0 z-20 flex border-t backdrop-blur md:hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AppLayout;
