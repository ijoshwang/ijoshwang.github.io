"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, CornerDownLeft, Search, X } from "lucide-react";
import { COMMAND_ITEMS, filterCommands } from "./studio-view-model";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onExecute: (commandId: string) => void;
}

export function CommandPalette({ open, onClose, onExecute }: CommandPaletteProps) {
  if (!open) return null;
  return <CommandPaletteDialog onClose={onClose} onExecute={onExecute} />;
}

function CommandPaletteDialog({
  onClose,
  onExecute,
}: {
  onClose: () => void;
  onExecute: (commandId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterCommands(COMMAND_ITEMS, query), [query]);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length,
        );
      } else if (event.key === "Enter" && filtered[activeIndex]) {
        event.preventDefault();
        onExecute(filtered[activeIndex].id);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, filtered, onClose, onExecute]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[18px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3.5">
          <Search className="h-4 w-4 text-[var(--ink-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Jump to a view, toggle theme, or copy /llms.txt..."
            className="w-full bg-transparent text-body text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="craft-color rounded-full p-1 text-[var(--ink-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-[var(--ink-muted)]">
              No matching commands.
            </li>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <li key={item.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onExecute(item.id);
                      onClose();
                    }}
                    className={`craft-color flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left ${
                      isSelected
                        ? "bg-[var(--surface-hover)] text-[var(--ink-primary)]"
                        : "text-[var(--ink-secondary)]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--ink-primary)]">
                        {item.label}
                      </div>
                      <div className="truncate text-sm text-[var(--ink-muted)]">{item.hint}</div>
                    </div>
                    <span className="shrink-0 text-sm text-[var(--ink-muted)]">{item.group}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--surface-subtle)] px-4 py-2.5 text-sm text-[var(--ink-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Command className="h-3.5 w-3.5" />K to toggle
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft className="h-3.5 w-3.5" /> Enter to run, Esc to close
          </span>
        </div>
      </div>
    </div>
  );
}
