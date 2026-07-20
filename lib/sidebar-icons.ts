import {
  BookOpen,
  Plane,
  AlertTriangle,
  Clock3,
  Globe,
  DollarSign,
  Scale,
  Timer,
  Star,
  Folder,
  Link2,
  Bell,
  FileText,
  Compass,
  MapPin,
  ClipboardList,
  PhoneCall,
  GitBranch,
  GraduationCap,
  Luggage,
  MessageSquare,
  Briefcase,
  History,
  type LucideIcon,
} from "lucide-react";

export const SIDEBAR_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Plane,
  AlertTriangle,
  Clock3,
  Globe,
  DollarSign,
  Scale,
  Timer,
  Star,
  Folder,
  Link2,
  Bell,
  FileText,
  Compass,
  MapPin,
  ClipboardList,
  PhoneCall,
  GitBranch,
  GraduationCap,
  Luggage,
  MessageSquare,
  Briefcase,
  History,
};

export const SIDEBAR_ICON_KEYS = Object.keys(SIDEBAR_ICONS);

export function getSidebarIcon(key: string): LucideIcon {
  return SIDEBAR_ICONS[key] ?? Link2;
}
