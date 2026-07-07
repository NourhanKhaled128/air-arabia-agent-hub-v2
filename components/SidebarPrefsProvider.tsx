"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Dock = "left" | "right";

interface SidebarPrefs {
  collapsed: boolean;
  dock: Dock;
  mobileOpen: boolean;
  scrollHidden: boolean;
  toggleCollapsed: () => void;
  setDock: (dock: Dock) => void;
  toggleMobileOpen: () => void;
  closeMobile: () => void;
}

const STORAGE_KEY = "sidebar-prefs";
const EXPANDED_WIDTH = "18rem";
const COLLAPSED_WIDTH = "4.5rem";
const SCROLL_HIDE_THRESHOLD = 80;
const DESKTOP_BREAKPOINT = 1024;

const SidebarPrefsContext = createContext<SidebarPrefs | null>(null);

function loadStoredPrefs(): { collapsed: boolean; dock: Dock } {
  if (typeof window === "undefined") {
    return { collapsed: false, dock: "left" };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { collapsed: false, dock: "left" };

    const parsed = JSON.parse(raw);
    return {
      collapsed: Boolean(parsed.collapsed),
      dock: parsed.dock === "right" ? "right" : "left",
    };
  } catch {
    return { collapsed: false, dock: "left" };
  }
}

export function SidebarPrefsProvider({ children }: { children: ReactNode }) {
  const [{ collapsed, dock }, setPersisted] = useState(loadStoredPrefs);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ collapsed, dock }));
  }, [collapsed, dock]);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
    );
  }, [collapsed]);

  useEffect(() => {
    if (collapsed) {
      return;
    }

    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

        if (!isDesktop || y < SCROLL_HIDE_THRESHOLD) {
          setScrollHidden(false);
        } else if (y > lastScrollY.current) {
          setScrollHidden(true);
        } else if (y < lastScrollY.current) {
          setScrollHidden(false);
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [collapsed]);

  const value: SidebarPrefs = {
    collapsed,
    dock,
    mobileOpen,
    scrollHidden: collapsed ? false : scrollHidden,
    toggleCollapsed: () =>
      setPersisted((prev) => ({ ...prev, collapsed: !prev.collapsed })),
    setDock: (nextDock) =>
      setPersisted((prev) => ({ ...prev, dock: nextDock })),
    toggleMobileOpen: () => setMobileOpen((prev) => !prev),
    closeMobile: () => setMobileOpen(false),
  };

  return (
    <SidebarPrefsContext.Provider value={value}>
      {children}
    </SidebarPrefsContext.Provider>
  );
}

export function useSidebarPrefs() {
  const ctx = useContext(SidebarPrefsContext);
  if (!ctx) {
    throw new Error("useSidebarPrefs must be used within a SidebarPrefsProvider");
  }
  return ctx;
}
