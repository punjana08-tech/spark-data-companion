import { Outlet, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { PortalNav } from "@/components/PortalNav";

const CREW_PATHS = ["/crew", "/ticketing", "/crowd", "/payments", "/gates", "/food", "/app", "/incidents"];

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCrew = CREW_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isCrew) return <Shell />;
  if (isAuthPage) return <Outlet />;
  return (
    <div className="min-h-screen flex flex-col">
      <PortalNav />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
