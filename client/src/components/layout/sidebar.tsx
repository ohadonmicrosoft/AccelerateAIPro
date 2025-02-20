import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  GitBranch,
  ChartBar,
  MessageSquare,
  LogOut,
  Settings,
  ChevronRight,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type NavSection = {
  title: string;
  links: {
    href: string;
    label: string;
    icon: React.ElementType;
  }[];
};

const navSections: NavSection[] = [
  {
    title: "Main",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/workflows", label: "Workflows", icon: GitBranch },
    ],
  },
  {
    title: "Analytics",
    links: [
      { href: "/reports", label: "Reports", icon: ChartBar },
    ],
  },
  {
    title: "Communication",
    links: [
      { href: "/chat", label: "Chat", icon: MessageSquare },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [query, setQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["Main"]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const filteredSections = navSections.map(section => ({
    ...section,
    links: section.links.filter(link =>
      link.label.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(section => section.links.length > 0);

  return (
    <div className="flex h-full w-[280px] flex-col border-r bg-sidebar px-2 py-4">
      <div className="mb-4 px-2">
        <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">App</h1>
      </div>

      <div className="relative px-2 mb-4">
        <Search className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2">
        {filteredSections.map((section) => (
          <div key={section.title} className="mb-2">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground hover:text-sidebar-foreground/80 transition-colors"
            >
              <ChevronRight
                className={cn(
                  "mr-1 h-4 w-4 shrink-0 transition-transform",
                  expandedSections.includes(section.title) && "rotate-90"
                )}
              />
              {section.title}
            </button>
            {expandedSections.includes(section.title) && (
              <div className="mt-1 space-y-1 pl-4">
                {section.links.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <a
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all",
                        location === href
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-4 space-y-2 border-t pt-4 px-2">
        <Link href="/settings">
          <a
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all",
              location === "/settings"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span className="truncate">Settings</span>
          </a>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 py-1.5 text-sm font-medium"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="truncate">Logout</span>
        </Button>
      </div>
    </div>
  );
}