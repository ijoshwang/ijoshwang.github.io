"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  FileText,
  GripVertical,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import type { StarLabSharedDocRow } from "@/domain/profile-schema";
import { AgentMiniWindow } from "./agent-mini-window";
import { clampSplitPercentage, type StarLabViewState } from "./starlab-view-model";

interface StarLabStageProps {
  title: string;
  view: StarLabViewState;
  onSelectScenario: (scenarioId: string) => void;
  onApproveGate: () => void;
}

function LayerIcon({ layer }: { layer: StarLabSharedDocRow["layer"] }) {
  if (layer === "memory") {
    return (
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent-coding-soft)] text-[var(--accent-coding)]">
        <BookOpen className="h-4 w-4" />
      </span>
    );
  }
  if (layer === "docs") {
    return (
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent-shared-soft)] text-[var(--accent-shared)]">
        <FileText className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent-os-soft)] text-[var(--accent-os)]">
      <ShieldCheck className="h-4 w-4" />
    </span>
  );
}

export function StarLabStage({ title, view, onSelectScenario, onApproveGate }: StarLabStageProps) {
  // Default cleanly at 34% column seam so Left shows Before silo & Right shows After StarLab with zero clipped text
  const [splitPercent, setSplitPercent] = useState(34);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const isBeforeFull = splitPercent >= 88;
  const isAfterFull = splitPercent <= 12;

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const rawPercent = ((clientX - rect.left) / rect.width) * 100;
    setSplitPercent(clampSplitPercentage(rawPercent));
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const subtitleText = isBeforeFull
    ? view.activeScenario.painSummary
    : isAfterFull
      ? view.activeScenario.solutionSummary
      : "Drag the divider or switch modes to compare disconnected silos against one shared living brain.";

  return (
    <section
      aria-labelledby="starlab-stage-heading"
      className="mt-10 border-t border-[var(--border-subtle)] pt-10 sm:mt-12 sm:pt-12"
    >
      {/* Left-Aligned Architectural Header + Animated 3-State Compare Control */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-[58ch]">
          <h2
            id="starlab-stage-heading"
            className="font-display text-heading font-semibold tracking-[-0.03em] text-[var(--ink-primary)]"
          >
            {title}
          </h2>
          <p className="mt-2 text-body text-[var(--ink-secondary)]">{subtitleText}</p>
        </div>

        <div
          role="group"
          aria-label="Compare siloed agents and StarLab shared context"
          className="inline-flex shrink-0 self-start rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-1 md:self-auto"
        >
          <button
            type="button"
            aria-pressed={isBeforeFull}
            onClick={() => setSplitPercent(100)}
            className={`craft-color rounded-full px-3.5 py-1.5 text-sm font-medium ${
              isBeforeFull
                ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={!isBeforeFull && !isAfterFull}
            onClick={() => setSplitPercent(34)}
            className={`craft-color hidden rounded-full px-3.5 py-1.5 text-sm font-medium sm:inline-flex ${
              !isBeforeFull && !isAfterFull
                ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)]"
                : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            Compare
          </button>
          <button
            type="button"
            aria-pressed={isAfterFull}
            onClick={() => setSplitPercent(0)}
            className={`craft-color rounded-full px-3.5 py-1.5 text-sm font-medium ${
              isAfterFull
                ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)]"
                : !isBeforeFull
                  ? "bg-[var(--ink-primary)] text-[var(--bg-canvas)] sm:bg-transparent sm:text-[var(--ink-secondary)] sm:hover:text-[var(--ink-primary)]"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]"
            }`}
          >
            After: StarLab
          </button>
        </div>
      </div>

      {/* Connected Underline Scenario Tabs */}
      <div
        role="tablist"
        aria-label="StarLab workflow examples"
        className="mt-7 flex flex-wrap gap-6 border-b border-[var(--border-subtle)]"
      >
        {view.scenarios.map((scenario) => {
          const active = scenario.id === view.activeScenario.id;
          return (
            <button
              key={scenario.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onSelectScenario(scenario.id)}
              className={`craft-color relative pb-3 text-sm font-medium ${
                active
                  ? "text-[var(--ink-primary)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
              }`}
            >
              {scenario.shortLabel}
              {active && (
                <motion.span
                  layoutId="stage-scenario-underline"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent-coding)]"
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Unified Column-Locked Interactive Compare Stage */}
      <div
        ref={stageRef}
        className="relative mt-6 overflow-hidden rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-elevated)] select-none"
        style={{ boxShadow: "var(--shadow-stage)" }}
      >
        {/* UNDERLAY (AFTER): CONCEPT 1 CLARITY — ALIGNED MICRO-APPS + SOLID CONVERGENCE CURVES + SHARED BRAIN */}
        <div className="desk-dot-surface relative flex flex-col justify-between p-5 sm:p-8">
          <div
            aria-hidden="true"
            className="stage-aura-wash pointer-events-none absolute inset-x-0 top-0 h-56"
          />

          <div className="relative z-10 flex items-baseline justify-between gap-4">
            <span className="text-sm font-semibold text-[var(--accent-shared)]">
              After: StarLab shared brain
            </span>
            <span className="hidden text-sm text-[var(--ink-muted)] sm:inline">
              Solid paths: all three agents read and write one live truth
            </span>
          </div>

          {/* 3 Aligned Micro-Product Windows */}
          <div className="relative z-10 mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {view.agentSeats.map((seat) => (
              <AgentMiniWindow key={seat.agent.id} seat={seat} variant="shared" />
            ))}
          </div>

          {/* Explicit Solid 3-Color Convergence Curves (Concept 1 Signature Clarity) */}
          <div className="relative z-10 hidden h-12 sm:block" aria-hidden="true">
            <svg viewBox="0 0 960 48" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M 160 0 C 160 28, 480 18, 480 48"
                fill="none"
                stroke="var(--accent-coding)"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M 480 0 V 48"
                fill="none"
                stroke="var(--accent-os)"
                strokeWidth="2"
                opacity="0.85"
              />
              <path
                d="M 800 0 C 800 28, 480 18, 480 48"
                fill="none"
                stroke="var(--accent-shared)"
                strokeWidth="2"
                opacity="0.85"
              />
              <circle cx="480" cy="44" r="4.5" fill="var(--accent-coding)" />
            </svg>
          </div>

          {/* Elevated StarLab Shared Brain Workbench — Column-Locked with Top 3 Agents */}
          <div
            className="relative z-10 mt-5 overflow-hidden rounded-[16px] border border-[var(--accent-coding-border)] bg-[var(--surface-glass)] backdrop-blur-md sm:mt-0"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] bg-[var(--accent-coding-soft)]/55 px-5 py-3.5 sm:px-6">
              <h3 className="text-body font-semibold text-[var(--ink-primary)] sm:pl-[34%]">
                StarLab shared memory and living docs
              </h3>
              <span className="hidden text-sm text-[var(--ink-secondary)] lg:inline">
                Single source of truth
              </span>
            </div>

            <div className="grid grid-cols-1 divide-y divide-[var(--border-subtle)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {view.docs.map((item) => (
                <div key={item.row.id} className="flex flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <LayerIcon layer={item.row.layer} />
                      <div className="min-w-0">
                        <div className="text-body font-semibold text-[var(--ink-primary)]">
                          {item.row.label}
                        </div>
                        <code className="block truncate font-mono text-sm text-[var(--ink-muted)]">
                          {item.row.path}
                        </code>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ink-secondary)]">
                      {item.displayValue}
                    </p>
                  </div>

                  {item.isGatePending && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={onApproveGate}
                        className="craft-interactive inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-coding)] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>{view.activeScenario.gateActionLabel}</span>
                      </button>
                    </div>
                  )}

                  {item.isGateApproved && (
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-shared)]">
                      <Check className="h-4 w-4" />
                      <span>Approved by you</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OVERLAY (BEFORE · SMOOTHLY GLIDING CURTAIN): TILTED SILOS + RED DASHED BROKEN CURVES + HUMAN ROUTER */}
        <div
          aria-hidden={isAfterFull}
          className={`silo-plane-surface absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8 ${
            dragging ? "" : "curtain-glide"
          } ${isBeforeFull ? "pointer-events-auto" : "pointer-events-none"} ${
            splitPercent < 50 ? "hidden sm:flex" : "flex"
          }`}
          style={{
            clipPath: `inset(0 ${isBeforeFull ? 0 : 100 - splitPercent}% 0 0)`,
          }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-semibold text-[var(--accent-danger)]">
              Before: Siloed agents
            </span>
            <span className="hidden text-sm text-[var(--ink-muted)] sm:inline">
              Dashed paths: isolated threads forcing manual copy-paste
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {view.agentSeats.map((seat, idx) => (
              <AgentMiniWindow
                key={seat.agent.id}
                seat={seat}
                variant="siloed"
                tiltClass={
                  idx === 0 ? "sm:-rotate-1" : idx === 2 ? "sm:rotate-1" : "sm:translate-y-1.5"
                }
              />
            ))}
          </div>

          {/* Explicit Red Dashed Broken Convergence Curves */}
          <div className="hidden h-12 sm:block" aria-hidden="true">
            <svg viewBox="0 0 960 48" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M 160 2 C 160 28, 480 18, 480 46"
                fill="none"
                stroke="var(--accent-danger)"
                strokeWidth="1.8"
                strokeDasharray="5 5"
                opacity="0.72"
              />
              <path
                d="M 480 6 V 46"
                fill="none"
                stroke="var(--accent-danger)"
                strokeWidth="1.8"
                strokeDasharray="5 5"
                opacity="0.72"
              />
              <path
                d="M 800 2 C 800 28, 480 18, 480 46"
                fill="none"
                stroke="var(--accent-danger)"
                strokeWidth="1.8"
                strokeDasharray="5 5"
                opacity="0.72"
              />
              <circle cx="480" cy="44" r="4" fill="var(--accent-danger)" />
            </svg>
          </div>

          {/* Column-Locked Manual Copy-Paste Router Card (Exact Structural Mirror of Shared Brain) */}
          <div className="mt-5 overflow-hidden rounded-[16px] border border-dashed border-[var(--accent-danger-border)] bg-[var(--surface-elevated)]/95 sm:mt-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[var(--accent-danger-border)] bg-[var(--accent-danger-soft)]/70 px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-[var(--accent-danger)]">
                  <User className="h-4 w-4" />
                </span>
                <span className="text-body font-semibold text-[var(--ink-primary)]">
                  Manual copy-paste router
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSplitPercent(0)}
                className="craft-interactive inline-flex items-center gap-1.5 rounded-full bg-[var(--ink-primary)] px-4 py-1.5 text-sm font-medium text-[var(--bg-canvas)] hover:opacity-90"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Connect with StarLab</span>
              </button>
            </div>

            <div className="grid grid-cols-1 divide-y divide-dashed divide-[var(--accent-danger-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {view.agentSeats.map((seat) => (
                <div key={seat.agent.id} className="p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent-danger)]">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{seat.siloCard.problemTag}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
                    {seat.siloCard.snippet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tactile Draggable Curtain Handle (Desktop / Tablet, hidden when snapped fully to Before or After) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ left: `${splitPercent}%` }}
          className={`absolute inset-y-0 z-30 -ml-5 hidden w-10 cursor-ew-resize items-center justify-center touch-none sm:flex ${
            dragging ? "" : "curtain-glide"
          } ${isBeforeFull || isAfterFull ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <div className="h-full w-[2px] bg-[var(--ink-primary)]" />
          <div className="craft-interactive absolute flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-elevated)] text-[var(--ink-primary)] shadow-md hover:scale-105">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>

        <label className="sr-only" htmlFor="starlab-compare-range">
          Compare siloed agents and StarLab shared brain
        </label>
        <input
          id="starlab-compare-range"
          type="range"
          min={0}
          max={100}
          value={splitPercent}
          onChange={(event) => setSplitPercent(clampSplitPercentage(Number(event.target.value)))}
          className="sr-only"
        />
      </div>
    </section>
  );
}
