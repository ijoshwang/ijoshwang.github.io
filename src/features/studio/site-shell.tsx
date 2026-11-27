"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import { Check, Command, Moon, Sun } from "lucide-react";
import type { Profile } from "@/domain/profile-schema";
import { AgentSurface } from "./agent-surface";
import { BrandMark } from "./brand-mark";
import { CommandPalette } from "./command-palette";
import {
  parseInitialSurface,
  parseInitialTheme,
  PRIMARY_NAV_ITEMS,
  resolveActiveTabFromPathname,
  type SurfaceMode,
  type ThemeMode,
} from "./studio-view-model";

const subscribeNoop = () => () => {};
const getClientSearch = () => window.location.search;
const getServerSearch = () => "";

interface SiteActionsContextValue {
  copyText: (text: string, label: string) => void;
  showToast: (message: string) => void;
  openAgentSurface: () => void;
}

const SiteActionsContext = createContext<SiteActionsContextValue | null>(null);

export function useSiteActions(): SiteActionsContextValue {
  const ctx = useContext(SiteActionsContext);
  if (!ctx) {
    throw new Error("useSiteActions must be used inside SiteShell.");
  }
  return ctx;
}

interface SiteShellProps {
  profile: Profile;
  llmsTxt: string;
  profileJson: string;
  children: React.ReactNode;
}

export function SiteShell({ profile, llmsTxt, profileJson, children }: SiteShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = resolveActiveTabFromPathname(pathname);

  const urlSearch = useSyncExternalStore(subscribeNoop, getClientSearch, getServerSearch);
  const urlDefaults = useMemo(() => {
    const params = new URLSearchParams(urlSearch);
    return {
      theme: parseInitialTheme(params.get("theme")),
      surface: parseInitialSurface(params.get("surface")),
    };
  }, [urlSearch]);

  const [themeOverride, setThemeOverride] = useState<ThemeMode | null>(null);
  const [surfaceOverride, setSurfaceOverride] = useState<SurfaceMode | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const theme = themeOverride ?? urlDefaults.theme;
  const surface = surfaceOverride ?? urlDefaults.surface;

  const setTheme = useCallback(
    (updater: ThemeMode | ((prev: ThemeMode) => ThemeMode)) =>
      setThemeOverride((prev) => {
        const current = prev ?? urlDefaults.theme;
        return typeof updater === "function" ? updater(current) : updater;
      }),
    [urlDefaults.theme],
  );

  const setSurface = useCallback(
    (updater: SurfaceMode | ((prev: SurfaceMode) => SurfaceMode)) =>
      setSurfaceOverride((prev) => {
        const current = prev ?? urlDefaults.surface;
        return typeof updater === "function" ? updater(current) : updater;
      }),
    [urlDefaults.surface],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => {
      setToast((current) => (current === message ? null : current));
    }, 2000);
  }, []);

  const copyText = useCallback(
    (text: string, label: string) => {
      void navigator.clipboard.writeText(text).then(() => {
        showToast(label);
      });
    },
    [showToast],
  );

  const openAgentSurface = useCallback(() => setSurface("agent"), [setSurface]);

  const actionsValue = useMemo<SiteActionsContextValue>(
    () => ({ copyText, showToast, openAgentSurface }),
    [copyText, openAgentSurface, showToast],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const executeCommand = useCallback(
    (commandId: string) => {
      switch (commandId) {
        case "nav-overview":
          setSurface("human");
          router.push("/");
          break;
        case "nav-projects":
          setSurface("human");
          router.push("/projects/");
          break;
        case "nav-about":
          setSurface("human");
          router.push("/about/");
          break;
        case "toggle-surface":
          setSurface((prev) => (prev === "human" ? "agent" : "human"));
          break;
        case "toggle-theme":
          setTheme((prev) => (prev === "light" ? "dark" : "light"));
          break;
        case "copy-email":
          copyText(profile.identity.contact.email, "Copied ijoshwang@gmail.com");
          break;
        case "copy-llms":
          copyText(llmsTxt, "Copied /llms.txt payload");
          break;
        default:
          break;
      }
    },
    [copyText, llmsTxt, profile.identity.contact.email, router, setSurface, setTheme],
  );

  return (
    <MotionConfig reducedMotion="user">
      <SiteActionsContext.Provider value={actionsValue}>
        <div
          data-theme={theme}
          className="craft-color relative min-h-screen overflow-x-clip bg-[var(--bg-canvas)] text-[var(--ink-primary)]"
        >
          {/* Full-bleed y=0 Prismatic Gallery Wash on Overview */}
          {surface === "human" && activeTab === "overview" && (
            <div
              aria-hidden="true"
              className="editorial-top-bleed pointer-events-none absolute inset-x-0 top-0 h-[500px]"
            />
          )}

          {/* Single-line Borderless Header at y=0, Clean Surface Separation on Scroll */}
          <header
            className={`craft-color sticky top-0 z-30 ${
              scrolled
                ? "border-b border-[var(--border-subtle)] bg-[var(--surface-header)] backdrop-blur-md"
                : "border-b border-transparent bg-transparent"
            }`}
          >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8">
              <Link
                href="/"
                onClick={() => setSurface("human")}
                className="flex shrink-0 items-center gap-2 text-left sm:gap-2.5"
              >
                <BrandMark className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
                <span className="font-display text-base font-semibold tracking-[-0.025em] text-[var(--ink-primary)] sm:text-lg">
                  {profile.identity.name}
                </span>
              </Link>

              <nav aria-label="Primary" className="flex items-center gap-3.5 sm:gap-7">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const active = surface === "human" && activeTab === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setSurface("human")}
                      aria-current={active ? "page" : undefined}
                      className={`craft-color relative py-1 text-sm font-medium ${
                        active
                          ? "text-[var(--ink-primary)]"
                          : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[var(--accent-coding)]"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <div
                  role="group"
                  aria-label="View surface"
                  className="hidden items-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/85 p-0.5 md:inline-flex"
                >
                  <button
                    type="button"
                    onClick={() => setSurface("human")}
                    aria-pressed={surface === "human"}
                    className={`craft-color rounded-full px-3 py-1 text-sm font-medium ${
                      surface === "human"
                        ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)]"
                        : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                    }`}
                  >
                    Human
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurface("agent")}
                    aria-pressed={surface === "agent"}
                    className={`craft-color rounded-full px-3 py-1 text-sm font-medium ${
                      surface === "agent"
                        ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)]"
                        : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                    }`}
                  >
                    Agent
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  className="craft-color inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/85 text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] sm:h-9 sm:w-9"
                >
                  {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  aria-label="Open command palette"
                  className="craft-color hidden h-9 items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/85 px-3 text-sm text-[var(--ink-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)] sm:inline-flex"
                >
                  <Command className="h-3.5 w-3.5" />
                  <span>K</span>
                </button>
              </div>
            </div>
          </header>

          {surface === "agent" ? (
            <AgentSurface
              llmsTxt={llmsTxt}
              profileJson={profileJson}
              onReturnToHuman={() => setSurface("human")}
            />
          ) : (
            <main className="relative z-10 mx-auto max-w-6xl px-4 pt-7 pb-20 sm:px-8 sm:pt-10">
              {children}

              {/* Quiet Single-Line Anchored Footer */}
              <footer className="mt-20 flex flex-col justify-between gap-4 border-t border-[var(--border-subtle)] pt-8 text-sm text-[var(--ink-muted)] lg:flex-row lg:items-center">
                <p>
                  {profile.identity.name}, {profile.identity.location}.{" "}
                  {profile.identity.availability}.
                </p>

                <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href={profile.identity.contact.github}
                    target="_blank"
                    rel="noreferrer"
                    className="craft-color text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  >
                    GitHub
                  </a>
                  <a
                    href={profile.identity.contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="craft-color text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  >
                    LinkedIn
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(profile.identity.contact.email, "Copied ijoshwang@gmail.com")
                    }
                    className="craft-color text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  >
                    {profile.identity.contact.email}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurface("agent")}
                    className="craft-color font-mono text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
                  >
                    /llms.txt
                  </button>
                </div>
              </footer>
            </main>
          )}

          {toast && (
            <div
              role="status"
              className="fixed top-20 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-[var(--accent-shared-border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm font-medium text-[var(--ink-primary)] shadow-lg"
            >
              <Check className="h-4 w-4 text-[var(--accent-shared)]" />
              {toast}
            </div>
          )}

          <CommandPalette
            open={paletteOpen}
            onClose={() => setPaletteOpen(false)}
            onExecute={executeCommand}
          />
        </div>
      </SiteActionsContext.Provider>
    </MotionConfig>
  );
}
