import { Home, Settings, HelpCircle, PenTool } from "lucide-react";
import Index from "./pages/Index.jsx";
import DocumentWrite from "./pages/DocumentWrite.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Write",
    to: "/write",
    icon: <PenTool className="h-4 w-4" />,
    page: <DocumentWrite />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <div>Settings Page</div>,
  },
  {
    title: "Help",
    to: "/help",
    icon: <HelpCircle className="h-4 w-4" />,
    page: <div>Help Page</div>,
  },
];
