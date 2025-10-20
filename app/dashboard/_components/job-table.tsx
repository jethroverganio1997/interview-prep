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
  MapPin,
  MoreHorizontal,
  Plus,
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
import type { JobListingRow } from "../_lib/types";

interface JobTableProps {
  jobs: JobListingRow[];
  isLoading: boolean;
  hasBaseRows: boolean;
  searchInput: string;
  setSearchInput: (value: string) => void;
  clearSearch: () => void;
  fetchError: string | null;
}

export function JobTable({
  jobs,
  isLoading,
  hasBaseRows,
  searchInput,
  setSearchInput,
  clearSearch,
  fetchError,
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
          <span className="line-clamp-1 text-sm text-foreground">
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
          <span className="line-clamp-1 text-sm text-foreground">
            {row.original.work_type ?? "--"}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: "work_arrangement",
        header: "Arrangement",
        cell: ({ row }) => (
          <span className="line-clamp-1 text-sm text-foreground">
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
        cell: ({ row }) => {
          const { label, className } = getStatusTone(row.original.status);
          return (
            <Badge
              variant="outline"
              className={cn(
                "border px-3 py-1 text-[11px] font-medium",
                className
              )}
            >
              {label}
            </Badge>
          );
        },
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
        cell: ({ row }) => {
          const { label, className } = getPriorityTone(row.original.priority);
          return (
            <Badge
              variant="outline"
              className={cn(
                "border px-3 py-1 text-[11px] font-medium",
                className
              )}
            >
              {label}
            </Badge>
          );
        },
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
            className="text-sm text-muted-foreground"
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
          <span
            className="text-sm text-muted-foreground"
            title={row.original.applied_at ?? undefined}
          >
            {formatPostedAt(row.original.applied_at) ?? "--"}
          </span>
        ),
        size: 130,
      },
      {
        accessorKey: "last_updated",
        header: "Last Updated",
        cell: ({ row }) => (
          <span
            className="text-sm text-muted-foreground"
            title={row.original.last_updated ?? undefined}
          >
            {formatAbsolute(row.original.last_updated)}
          </span>
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
        cell: ({ row }) =>
          row.original.notes ? (
            <span className="line-clamp-1 text-sm text-muted-foreground">
              {row.original.notes}
            </span>
          ) : (
            "--"
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
    []
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
          className={cn(
            "gap-2 rounded-md border-dashed border-border/70 px-3 text-xs font-medium text-muted-foreground",
            isActive && "border-primary/40 bg-primary/10 text-primary"
          )}
        >
          <Plus className="h-3 w-3 text-muted-foreground" aria-hidden />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          {label} filters
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            className="text-sm"
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
