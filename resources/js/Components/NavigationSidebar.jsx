import { Home, Users, PenSquare, Globe, Bell, Bookmark, MessageSquare } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Users, label: "Following" },
  { icon: PenSquare, label: "Answer" },
  { icon: Globe, label: "Spaces" },
  { icon: Bell, label: "Notifications" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: MessageSquare, label: "Messages" },
];

export const NavigationSidebar = () => {
  return (
    <aside className="fixed left-0 top-10 h-screen w-64 border-r border-border bg-card p-4">
    
      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              item.active
                ? "bg-accent text-primary"
                : "text-sidebar-foreground hover:bg-[hsl(var(--nav-hover))]"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
