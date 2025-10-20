"use client";

import * as React from "react";

import { Check, Loader2, Pencil, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { getPriorityTone, getStatusTone } from "../../_lib/helpers";
import type {
  JobListingEditableFields,
  JobListingRow,
  JobListingUpdateResult,
} from "../../_lib/types";

import {
  fromDateInputValue,
  getNowInputValue,
  toDateInputValue,
  useTransientFlag,
} from "./utils";

type EditableUpdateHandler = (
  jobId: string,
  updates: Partial<JobListingEditableFields>
) => Promise<JobListingUpdateResult>;

const STATUS_SUGGESTIONS = [
  "New",
  "Interested",
  "Applied",
  "Interviewing",
  "Offer",
  "Watching",
  "Rejected",
];

const PRIORITY_SUGGESTIONS = ["High", "Medium", "Low"];

interface EditableStatusCellProps {
  job: JobListingRow;
  onUpdate: EditableUpdateHandler;
}

function EditableStatusCell({ job, onUpdate }: EditableStatusCellProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(job.status ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const {
    isVisible: successVisible,
    show: showSuccess,
    hide: hideSuccess,
  } = useTransientFlag();
  const datalistId = React.useId();

  React.useEffect(() => {
    if (!open) {
      setDraft(job.status ?? "");
    }
  }, [open, job.status]);

  const { label, className } = getStatusTone(job.status);
  const displayLabel = job.status ? label : "--";

  const persistValue = async (nextValue: string | null) => {
    if (isSaving) {
      return;
    }

    const previousValue = job.status ?? null;
    if ((previousValue ?? null) === (nextValue ?? null)) {
      setOpen(false);
      showSuccess();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const result = await onUpdate(job.id, { status: nextValue });
    if (result.error) {
      setErrorMessage(result.error.message ?? "Failed to update status.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setDraft(nextValue ?? "");
    setOpen(false);
    showSuccess();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = draft.trim();
    void persistValue(normalized.length ? normalized : null);
  };

  const handleClear = () => {
    void persistValue(null);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (isSaving) {
          return;
        }
        setOpen(next);
        if (next) {
          hideSuccess();
          setErrorMessage(null);
        } else {
          setDraft(job.status ?? "");
          setErrorMessage(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1 text-left text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Badge
            variant="outline"
            className={cn(
              "border px-3 py-1 text-[11px] font-medium",
              className
            )}
          >
            {displayLabel}
          </Badge>
          <Pencil
            className="h-3.5 w-3.5 text-muted-foreground/60 transition group-hover:text-foreground"
            aria-hidden
          />
          <Check
            className={cn(
              "h-3 w-3 text-emerald-500 transition-opacity",
              successVisible ? "opacity-100" : "opacity-0"
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] space-y-3">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide text-muted-foreground">
              Status
            </label>
            <input
              list={datalistId}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-9 w-full rounded-md border border-border/60 bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              placeholder="Add a status"
              autoFocus
              disabled={isSaving}
            />
            <datalist id={datalistId}>
              {STATUS_SUGGESTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-1">
              {STATUS_SUGGESTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="rounded-full border border-border/60 bg-background px-2 py-1 text-[11px] text-muted-foreground transition hover:border-border hover:text-foreground"
                  onClick={() => setDraft(option)}
                  disabled={isSaving}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {errorMessage ? (
            <p className="text-xs text-destructive/90">{errorMessage}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden />
              )}
              <span className="text-xs">Save</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                hideSuccess();
                setDraft(job.status ?? "");
                setErrorMessage(null);
                setOpen(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isSaving}
            >
              Clear
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

interface EditablePriorityCellProps {
  job: JobListingRow;
  onUpdate: EditableUpdateHandler;
}

function EditablePriorityCell({ job, onUpdate }: EditablePriorityCellProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(job.priority ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const {
    isVisible: successVisible,
    show: showSuccess,
    hide: hideSuccess,
  } = useTransientFlag();
  const datalistId = React.useId();

  React.useEffect(() => {
    if (!open) {
      setDraft(job.priority ?? "");
    }
  }, [open, job.priority]);

  const { label, className } = getPriorityTone(job.priority);
  const displayLabel = job.priority ? label : "--";

  const persistValue = async (nextValue: string | null) => {
    if (isSaving) {
      return;
    }

    const previousValue = job.priority ?? null;
    if ((previousValue ?? null) === (nextValue ?? null)) {
      setOpen(false);
      showSuccess();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const result = await onUpdate(job.id, { priority: nextValue });

    if (result.error) {
      setErrorMessage(result.error.message ?? "Failed to update priority.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setDraft(nextValue ?? "");
    setOpen(false);
    showSuccess();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = draft.trim();
    void persistValue(normalized.length ? normalized : null);
  };

  const handleClear = () => {
    void persistValue(null);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (isSaving) {
          return;
        }
        setOpen(next);
        if (next) {
          hideSuccess();
          setErrorMessage(null);
        } else {
          setDraft(job.priority ?? "");
          setErrorMessage(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1 text-left text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Badge
            variant="outline"
            className={cn(
              "border px-3 py-1 text-[11px] font-medium",
              className
            )}
          >
            {displayLabel}
          </Badge>
          <Pencil
            className="h-3.5 w-3.5 text-muted-foreground/60 transition group-hover:text-foreground"
            aria-hidden
          />
          <Check
            className={cn(
              "h-3 w-3 text-emerald-500 transition-opacity",
              successVisible ? "opacity-100" : "opacity-0"
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] space-y-3">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-wide text-muted-foreground">
              Priority
            </label>
            <input
              list={datalistId}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-9 w-full rounded-md border border-border/60 bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              placeholder="Add a priority"
              autoFocus
              disabled={isSaving}
            />
            <datalist id={datalistId}>
              {PRIORITY_SUGGESTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-1">
              {PRIORITY_SUGGESTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="rounded-full border border-border/60 bg-background px-2 py-1 text-[11px] text-muted-foreground transition hover:border-border hover:text-foreground"
                  onClick={() => setDraft(option)}
                  disabled={isSaving}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {errorMessage ? (
            <p className="text-xs text-destructive/90">{errorMessage}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden />
              )}
              <span className="text-xs">Save</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                hideSuccess();
                setDraft(job.priority ?? "");
                setErrorMessage(null);
                setOpen(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isSaving}
            >
              Clear
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

type EditableDateField = "applied_at" | "last_updated";

interface EditableDateCellProps {
  job: JobListingRow;
  field: EditableDateField;
  onUpdate: EditableUpdateHandler;
  formatValue: (value?: string | null) => string | null | undefined;
  emptyLabel?: string;
  showNowShortcut?: boolean;
}

function EditableDateCell({
  job,
  field,
  onUpdate,
  formatValue,
  emptyLabel = "--",
  showNowShortcut = false,
}: EditableDateCellProps) {
  const [open, setOpen] = React.useState(false);
  const rawValue = job[field] ?? null;
  const [draft, setDraft] = React.useState(toDateInputValue(rawValue));
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const {
    isVisible: successVisible,
    show: showSuccess,
    hide: hideSuccess,
  } = useTransientFlag();

  React.useEffect(() => {
    if (!open) {
      setDraft(toDateInputValue(rawValue));
    }
  }, [open, rawValue]);

  const displayValue = formatValue(rawValue) ?? emptyLabel;

  const persistValue = async (nextValue: string | null) => {
    if (isSaving) {
      return;
    }

    if ((rawValue ?? null) === (nextValue ?? null)) {
      setOpen(false);
      showSuccess();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const updates = { [field]: nextValue } as Partial<JobListingEditableFields>;
    const result = await onUpdate(job.id, updates);

    if (result.error) {
      setErrorMessage(result.error.message ?? "Failed to update date.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setDraft(toDateInputValue(nextValue));
    setOpen(false);
    showSuccess();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextValue = draft ? fromDateInputValue(draft) : null;
    void persistValue(nextValue);
  };

  const handleClear = () => {
    setDraft("");
    void persistValue(null);
  };

  const handleNow = () => {
    const now = getNowInputValue();
    setDraft(now);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (isSaving) {
          return;
        }
        setOpen(next);
        if (next) {
          hideSuccess();
          setErrorMessage(null);
        } else {
          setDraft(toDateInputValue(rawValue));
          setErrorMessage(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-1 text-left text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          title={rawValue ?? undefined}
        >
          <span className="truncate">{displayValue}</span>
          <Pencil
            className="h-3.5 w-3.5 text-muted-foreground/60 transition group-hover:text-foreground"
            aria-hidden
          />
          <Check
            className={cn(
              "h-3 w-3 text-emerald-500 transition-opacity",
              successVisible ? "opacity-100" : "opacity-0"
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 space-y-3">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            type="datetime-local"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="h-9"
            step={60}
            autoFocus
            disabled={isSaving}
          />
          {errorMessage ? (
            <p className="text-xs text-destructive/90">{errorMessage}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden />
              )}
              <span className="text-xs">Save</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                hideSuccess();
                setDraft(toDateInputValue(rawValue));
                setErrorMessage(null);
                setOpen(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isSaving}
            >
              Clear
            </Button>
            {showNowShortcut ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleNow}
                disabled={isSaving}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Now
              </Button>
            ) : null}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

interface EditableNotesCellProps {
  job: JobListingRow;
  onUpdate: EditableUpdateHandler;
}

function EditableNotesCell({ job, onUpdate }: EditableNotesCellProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(job.notes ?? "");
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const {
    isVisible: successVisible,
    show: showSuccess,
    hide: hideSuccess,
  } = useTransientFlag();

  React.useEffect(() => {
    if (!open) {
      setDraft(job.notes ?? "");
    }
  }, [open, job.notes]);

  const persistValue = async (nextValue: string | null) => {
    if (isSaving) {
      return;
    }

    const previousValue = job.notes ?? null;
    if ((previousValue ?? null) === (nextValue ?? null)) {
      setOpen(false);
      showSuccess();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const result = await onUpdate(job.id, { notes: nextValue });
    if (result.error) {
      setErrorMessage(result.error.message ?? "Failed to update notes.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setDraft(nextValue ?? "");
    setOpen(false);
    showSuccess();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draft.trim();
    const nextValue = trimmed.length ? draft : null;
    void persistValue(nextValue);
  };

  const handleClear = () => {
    setDraft("");
    void persistValue(null);
  };

  const charCount = draft.length;
  const displayText = job.notes && job.notes.trim().length ? job.notes : "--";

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (isSaving) {
          return;
        }
        setOpen(next);
        if (next) {
          hideSuccess();
          setErrorMessage(null);
        } else {
          setDraft(job.notes ?? "");
          setErrorMessage(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group inline-flex w-full items-start gap-1 text-left text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span className=" line-clamp-1 flex-1">{displayText}</span>
          <div className="flex items-center gap-1">
            <Pencil
              className="mt-0.5 h-3.5 w-3.5 text-muted-foreground/60 transition group-hover:text-foreground"
              aria-hidden
            />
            <Check
              className={cn(
                "h-3 w-3 text-emerald-500 transition-opacity",
                successVisible ? "opacity-100" : "opacity-0"
              )}
              aria-hidden
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[420px] space-y-3">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <textarea
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={6}
            placeholder="Add notes"
            className="h-32 w-full resize-y rounded-md border border-border/60 bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            disabled={isSaving}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {charCount} character{charCount === 1 ? "" : "s"}
            </span>
          </div>
          {errorMessage ? (
            <p className="text-xs text-destructive/90">{errorMessage}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden />
              )}
              <span className="text-xs">Save</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                hideSuccess();
                setDraft(job.notes ?? "");
                setErrorMessage(null);
                setOpen(false);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={isSaving}
            >
              Clear
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}

export {
  EditableDateCell,
  EditableNotesCell,
  EditablePriorityCell,
  EditableStatusCell,
};
export type { EditableDateField, EditableUpdateHandler };
