"use client";

import { AlertCircle, CalendarClock, Check, Inbox, MailWarning, MessageSquare } from "lucide-react";
import type { StarLabAgentId } from "@/domain/profile-schema";
import type { EnrichedAgentSeat } from "./starlab-view-model";

interface AgentMiniWindowProps {
  seat: EnrichedAgentSeat;
  variant: "siloed" | "shared";
  tiltClass?: string;
}

function AgentIcon({ id, className }: { id: StarLabAgentId; className?: string }) {
  if (id === "chat") return <MessageSquare className={className} />;
  if (id === "inbox") return <Inbox className={className} />;
  return <CalendarClock className={className} />;
}

export function AgentMiniWindow({ seat, variant, tiltClass = "" }: AgentMiniWindowProps) {
  const isSiloed = variant === "siloed";
  const lines = isSiloed ? seat.miniPreview.beforeLines : seat.miniPreview.afterLines;

  return (
    <div
      className={`craft-interactive flex h-full flex-col justify-between rounded-[14px] border p-4 ${
        isSiloed
          ? `border-dashed border-[var(--border-strong)] bg-[var(--surface-elevated)]/95 ${tiltClass}`
          : "border-[var(--border-subtle)] bg-[var(--surface-elevated)]"
      }`}
      style={{
        boxShadow: isSiloed ? "none" : "var(--shadow-mini)",
      }}
    >
      {/* Mini App Header Bar */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
              style={{
                backgroundColor: isSiloed ? "var(--surface-subtle)" : seat.tokens.soft,
                color: isSiloed ? "var(--ink-muted)" : seat.tokens.color,
              }}
            >
              <AgentIcon id={seat.agent.id} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[var(--ink-primary)]">
                {seat.agent.name}
              </div>
              <div
                className="truncate text-sm font-medium"
                style={{
                  color: isSiloed ? "var(--accent-danger)" : seat.tokens.color,
                }}
              >
                {isSiloed ? seat.siloCard.statusLabel : seat.liveStatusLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Recognizable Micro-Product UI Surface (Chat Bubbles / Inbox List / Schedule Checklist) */}
        <div className="mt-3.5 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/85 p-3">
          {seat.agent.id === "chat" && (
            <div className="space-y-2 text-sm">
              <div
                className="ml-auto w-[86%] rounded-[10px] rounded-br-[3px] px-2.5 py-1.5 leading-snug"
                style={{
                  backgroundColor: isSiloed ? "var(--surface-subtle)" : seat.tokens.soft,
                  color: "var(--ink-primary)",
                }}
              >
                {lines[0]}
              </div>
              <div className="w-[90%] rounded-[10px] rounded-bl-[3px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1.5 leading-snug text-[var(--ink-secondary)]">
                {lines[1]}
              </div>
            </div>
          )}

          {seat.agent.id === "inbox" && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 rounded-[8px] bg-[var(--surface-elevated)] px-2.5 py-1.5 text-[var(--ink-primary)]">
                {isSiloed ? (
                  <MailWarning className="h-3.5 w-3.5 shrink-0 text-[var(--accent-danger)]" />
                ) : (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: seat.tokens.color }}
                  />
                )}
                <span className="truncate leading-snug">{lines[0]}</span>
              </div>
              <div className="flex items-center gap-2 rounded-[8px] bg-[var(--surface-elevated)]/75 px-2.5 py-1.5 text-[var(--ink-secondary)]">
                {isSiloed ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-danger)]/60" />
                ) : (
                  <Check className="h-3.5 w-3.5 shrink-0 text-[var(--accent-shared)]" />
                )}
                <span className="truncate leading-snug">{lines[1]}</span>
              </div>
            </div>
          )}

          {seat.agent.id === "brief" && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 rounded-[8px] bg-[var(--surface-elevated)] px-2.5 py-1.5 text-[var(--ink-primary)]">
                <span
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                  style={{
                    borderColor: isSiloed ? "var(--accent-danger-border)" : seat.tokens.border,
                    backgroundColor: isSiloed ? "var(--accent-danger-soft)" : seat.tokens.soft,
                    color: isSiloed ? "var(--accent-danger)" : seat.tokens.color,
                  }}
                >
                  {isSiloed ? "!" : <Check className="h-3 w-3" />}
                </span>
                <span className="truncate leading-snug">{lines[0]}</span>
              </div>
              <div className="flex items-center gap-2 px-1 text-[var(--ink-secondary)]">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: isSiloed ? "var(--accent-danger)" : seat.tokens.color,
                  }}
                />
                <span className="truncate leading-snug">{lines[1]}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Signal Footer */}
      {isSiloed && (
        <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[var(--accent-danger)]">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{seat.siloCard.problemTag}</span>
        </div>
      )}
    </div>
  );
}
