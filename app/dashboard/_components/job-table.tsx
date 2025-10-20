"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Table as TableInstance,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  Loader2,
  MapPin,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  formatPostedAt,
  formatSalary,
  getPriorityTone,
  getStatusTone,
} from "../_lib/helpers";
import type {
  JobListingEditableFields,
  JobListingRow,
  JobListingUpdateResult,
} from "../_lib/types";

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

interface JobTableProps {
  jobs: JobListingRow[];
  isLoading: boolean;
  hasBaseRows: boolean;
  searchInput: string;
  setSearchInput: (value: string) => void;
  clearSearch: () => void;
  fetchError: string | null;
  onUpdateJob: EditableUpdateHandler;
}

export function JobTable({
  jobs,
  isLoading,
  hasBaseRows,
  searchInput,
  setSearchInput,
  clearSearch,
  fetchError,
  onUpdateJob,
}: JobTableProps) {
  const statusOptions = React.useMemo(() => {
    const unique = new Set<string>();
    jobs.forEach((job) => unique.add(getStatusTone(job.status).label));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const priorityOptions = React.useMemo(() => {
    const unique = new Set<string>();
    jobs.forEach((job) => unique.add(getPriorityTone(job.priority).label));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "posted_at", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState<
    Record<string, boolean>
  >({});

  const handleUpdate = React.useCallback<EditableUpdateHandler>(
    (jobId, updates) => onUpdateJob(jobId, updates),
    [onUpdateJob]
  );

  const columns = React.useMemo<ColumnDef<JobListingRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-xs font-semibold tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Job Title
            <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            {row.original.title}
          </span>
        ),
        size: 260,
      },
      {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => (
          <span className="min-w-max whitespace-nowrap line-clamp-1 text-sm text-foreground">
            {row.original.company ?? "--"}
          </span>
        ),
        size: 180,
      },
      {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) =>
          row.original.location ? (
            <span className="min-w-max whitespace-nowrap inline-flex items-center gap-1 text-sm text-muted-foreground line-clamp-1">
              <MapPin className="h-3 w-3" aria-hidden />
              {row.original.location}
            </span>
          ) : (
            "--"
          ),
        size: 160,
      },
      {
        accessorKey: "work_type",
        header: "Work Type",
        cell: ({ row }) => (
          <span className="min-w-max whitespace-nowrap line-clamp-1 text-sm text-foreground">
            {row.original.work_type ?? "--"}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: "work_arrangement",
        header: "Arrangement",
        cell: ({ row }) => (
          <span className="min-w-max whitespace-nowrap line-clamp-1 text-sm text-foreground">
            {row.original.work_arrangement ?? "--"}
          </span>
        ),
        size: 140,
      },
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) =>
          row.original.salary ? (
            <span className="min-w-max whitespace-nowrap inline-flex items-center gap-1 text-sm text-muted-foreground line-clamp-1">
              {formatSalary(row.original.salary) ?? "N/A"}
            </span>
          ) : (
            "N/A"
          ),
        size: 120,
      },
      {
        accessorKey: "experience_needed",
        header: "Experience",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-sm text-foreground">
            {row.original.experience_needed ?? "--"}
          </span>
        ),
        size: 160,
      },
      {
        accessorKey: "skills",
        header: "Skills",
        cell: ({ row }) => {
          if (!row.original.skills?.length) {
            return "--";
          }
          const summary = row.original.skills.slice(0, 4).join(", ");
          const more =
            row.original.skills.length > 4
              ? ` +${row.original.skills.length - 4}`
              : "";
          return (
            <span className="line-clamp-1 text-sm text-muted-foreground">
              {summary}
              {more}
            </span>
          );
        },
        size: 220,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;
          const value = (row.getValue(columnId) as string) ?? "";
          return value
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <EditableStatusCell job={row.original} onUpdate={handleUpdate} />
        ),
        size: 120,
        filterFn: (row, columnId, filterValue) => {
          if (!Array.isArray(filterValue) || !filterValue.length) {
            return true;
          }
          const label = getStatusTone(row.original.status).label;
          return filterValue.includes(label);
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => (
          <EditablePriorityCell job={row.original} onUpdate={handleUpdate} />
        ),
        size: 110,
        filterFn: (row, columnId, filterValue) => {
          if (!Array.isArray(filterValue) || !filterValue.length) {
            return true;
          }
          const label = getPriorityTone(row.original.priority).label;
          return filterValue.includes(label);
        },
      },
      {
        accessorKey: "posted_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-xs font-semibold tracking-wide"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Posted
            <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
          </Button>
        ),
        cell: ({ row }) => (
          <span
            className="min-w-max whitespace-nowrap text-sm text-muted-foreground"
            title={row.original.posted_at ?? undefined}
          >
            {formatPostedAt(row.original.posted_at) ?? "--"}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: "applied_at",
        header: "Applied",
        cell: ({ row }) => (
          <EditableDateCell
            job={row.original}
            field="applied_at"
            onUpdate={handleUpdate}
            formatValue={formatPostedAt}
            emptyLabel="--"
          />
        ),
        size: 130,
      },
      {
        accessorKey: "last_updated",
        header: "Last Updated",
        cell: ({ row }) => (
          <EditableDateCell
            job={row.original}
            field="last_updated"
            onUpdate={handleUpdate}
            formatValue={formatAbsolute}
            emptyLabel="--"
            showNowShortcut
          />
        ),
        size: 150,
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => row.original.source ?? "--",
        size: 140,
      },
      {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => (
          <EditableNotesCell job={row.original} onUpdate={handleUpdate} />
        ),
        size: 220,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => <ActionsMenu job={row.original} />,
        size: 72,
      },
    ],
    [handleUpdate]
  );

  const table = useReactTable({
    data: jobs,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    manualFiltering: false,
  });

  const statusSelections =
    (table.getColumn("status")?.getFilterValue() as string[]) ?? [];
  const prioritySelections =
    (table.getColumn("priority")?.getFilterValue() as string[]) ?? [];

  const toggleStatus = React.useCallback(
    (option: string) => {
      const column = table.getColumn("status");
      if (!column) return;

      column.setFilterValue((current: string[] | undefined) => {
        const next = new Set(current ?? []);
        if (next.has(option)) {
          next.delete(option);
        } else {
          next.add(option);
        }
        return next.size ? Array.from(next) : undefined;
      });
    },
    [table]
  );

  const togglePriority = React.useCallback(
    (option: string) => {
      const column = table.getColumn("priority");
      if (!column) return;

      column.setFilterValue((current: string[] | undefined) => {
        const next = new Set(current ?? []);
        if (next.has(option)) {
          next.delete(option);
        } else {
          next.add(option);
        }
        return next.size ? Array.from(next) : undefined;
      });
    },
    [table]
  );

  const resetFilters = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  const filteredRowCount = table.getRowModel().rows.length;
  const activeFilterCount = table.getState().columnFilters.length;

  const emptyMessage = isLoading
    ? "Loading listings..."
    : hasBaseRows
    ? "No listings match the selected filters."
    : "No listings available yet.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Filter jobs..."
            className="h-8 rounded-md min-w-xs border-border/60 bg-background text-sm shadow-sm placeholder:text-muted-foreground"
          />
          <div className="inline-flex items-center gap-2">
            <FilterChip
              label="Status"
              options={statusOptions}
              selected={statusSelections}
              onToggle={toggleStatus}
            />
            <FilterChip
              label="Priority"
              options={priorityOptions}
              selected={prioritySelections}
              onToggle={togglePriority}
            />
          </div>
        </div>
        <ColumnsMenu table={table} />
      </div>

      {fetchError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {filteredRowCount.toLocaleString()} listing
          {filteredRowCount === 1 ? "" : "s"}
        </span>
        <span>•</span>
        <span>{jobs.length.toLocaleString()} loaded</span>
        {activeFilterCount ? (
          <>
            <span>•</span>
            <Badge className="gap-1 rounded-full bg-primary/10 px-3 text-[11px] font-semibold text-primary">
              {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground"
              onClick={() => {
                resetFilters();
              }}
            >
              <X className="h-3 w-3" aria-hidden />
              Reset filters
            </Button>
          </>
        ) : null}
        {searchInput ? (
          <>
            <span>•</span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs text-muted-foreground"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" aria-hidden />
              Clear search
            </Button>
          </>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-md border border-border/70 bg-background shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-1" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

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
      <PopoverContent align="start" className="w-72 space-y-3">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Set status"
              className="h-9"
              list={datalistId}
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
      <PopoverContent align="start" className="w-72 space-y-3">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Set priority"
              className="h-9"
              list={datalistId}
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

function formatAbsolute(value?: string | null) {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

interface FilterChipProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FilterChip({ label, options, selected, onToggle }: FilterChipProps) {
  if (!options.length) {
    return null;
  }

  const isActive = selected.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-1 rounded-md border-border/60 px-3 text-xs font-medium"
        >
          {label}
          {isActive ? (
            <Badge className="rounded-full bg-primary/10 px-2 text-[11px] font-semibold text-primary">
              {selected.length}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-0">
        <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            className="text-sm"
            checked={selected.includes(option)}
            onCheckedChange={() => onToggle(option)}
          >
            <span className="line-clamp-1">{option}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ColumnsMenuProps {
  table: TableInstance<JobListingRow>;
}

function ColumnsMenu({ table }: ColumnsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2 rounded-md border-border/60 px-3 text-xs font-medium text-muted-foreground"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          Columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {column.id.replace(/_/g, " ")}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ActionsMenuProps {
  job: JobListingRow;
}

function ActionsMenu({ job }: ActionsMenuProps) {
  const router = useRouter();

  const openExternal = (url?: string | null) => {
    if (!url) {
      return;
    }
    window.open(url, "_blank", "noreferrer noopener");
  };

  const detailHref = `/dashboard/jobs/${job.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden />
          <span className="sr-only">Open actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Quick actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push(detailHref)}>
          View job detail
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!job.apply_url}
          onSelect={() => openExternal(job.apply_url)}
        >
          Open apply link
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!job.job_url}
          onSelect={() => openExternal(job.job_url)}
        >
          View job listing
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!job.company_url}
          onSelect={() => openExternal(job.company_url)}
        >
          View company
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useTransientFlag(duration = 2000) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeout = window.setTimeout(() => setIsVisible(false), duration);
    return () => window.clearTimeout(timeout);
  }, [isVisible, duration]);

  const show = React.useCallback(() => setIsVisible(true), []);
  const hide = React.useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    show,
    hide,
  };
}

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMinutes = date.getTimezoneOffset();
  const localTime = new Date(date.getTime() - offsetMinutes * 60 * 1000);
  return localTime.toISOString().slice(0, 16);
}

function fromDateInputValue(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function getNowInputValue() {
  return toDateInputValue(new Date().toISOString());
}
