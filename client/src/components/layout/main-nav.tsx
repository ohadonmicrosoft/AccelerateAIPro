import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export function MainNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  const items = [
    {
      href: "/",
      label: "Dashboard",
    },
    {
      href: "/workflows",
      label: "Workflows",
    },
    {
      href: "/reports",
      label: "Reports",
    },
    {
      href: "/chat",
      label: "Chat",
    },
  ];

  if (!user) return null;

  return (
    <nav className="flex items-center space-x-6">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <a
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </a>
        </Link>
      ))}
    </nav>
  );
}
