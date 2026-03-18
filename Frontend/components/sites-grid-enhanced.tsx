"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus as PlusIcon,
  GripVertical,
  X,
  ExternalLink,
  Globe,
  Search,
  Grid3x3,
  List,
  Tag,
  Star,
  Download,
  Upload,
  LayoutGrid,
  Layers,
  Pencil,
} from "lucide-react";
import initialSites from "@/app/sites.json";
import { SiteFormModal } from "./site-form-modal";

export interface Site {
  id: string;
  title: string;
  description: string;
  link: string;
  actionLabel?: string;
  favicon?: string;
  category?: string;
  pinned?: boolean;
}

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ sites }: { sites: Site[] }) {
  const totalSites = sites.length;
  const totalCategories = new Set(
    sites.map((s) => s.category).filter(Boolean)
  ).size;
  const totalPinned = sites.filter((s) => s.pinned).length;

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {[
        { label: "Sites", value: totalSites, icon: <LayoutGrid className="w-4 h-4" /> },
        { label: "Categories", value: totalCategories, icon: <Layers className="w-4 h-4" /> },
        { label: "Favourites", value: totalPinned, icon: <Star className="w-4 h-4" /> },
      ].map(({ label, value, icon }) => (
        <div
          key={label}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-sm"
        >
          <span className="text-blue-600">{icon}</span>
          <span className="text-sm font-semibold text-slate-800">{value}</span>
          <span className="text-xs text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Site Card ────────────────────────────────────────────────────────────────
function SiteCard({
  site,
  onRemove,
  onTogglePin,
  onEdit,
  viewMode,
}: {
  site: Site;
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (site: Site) => void;
  viewMode: "grid" | "list";
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: site.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/card">
      <Card
        className={`transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.15)] cursor-pointer h-full border-slate-200/80 ${site.pinned
          ? "ring-2 ring-yellow-400/60 shadow-[0_4px_16px_rgba(234,179,8,0.12)]"
          : ""
          } ${viewMode === "list" ? "flex-row items-center" : ""}`}
      >
        <CardHeader className={viewMode === "list" ? "flex-row items-center w-full" : ""}>
          <div className={`flex items-center gap-3 ${viewMode === "list" ? "flex-1" : ""}`}>
            {/* Drag handle */}
            <button
              {...attributes}
              {...listeners}
              className="absolute top-3 left-2 opacity-0 group-hover/card:opacity-40 hover:!opacity-100 text-slate-400 cursor-grab active:cursor-grabbing transition-opacity p-1 rounded touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            {/* Action Bar */}
            <div className="absolute top-3 right-3 flex items-center gap-1 transition-all z-10 p-1 rounded-lg border border-slate-200/50 bg-white/90 shadow-sm backdrop-blur-md opacity-0 group-hover/card:opacity-100">
              {/* Edit button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(site);
                }}
                className="p-1.5 rounded text-slate-400 hover:text-blue-500 hover:bg-slate-100 transition-colors"
                aria-label="Edit site"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>

              {/* Pin (favourite) button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTogglePin(site.id);
                }}
                className={`p-1.5 rounded transition-colors hover:bg-slate-100 ${site.pinned
                  ? "text-yellow-400"
                  : "text-slate-400 hover:text-yellow-500"
                  }`}
                aria-label={site.pinned ? "Unpin site" : "Pin site"}
              >
                <Star className={`w-3.5 h-3.5 ${site.pinned ? "fill-yellow-400" : ""}`} />
              </button>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(site.id);
                }}
                className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Remove site"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Favicon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform duration-300 overflow-hidden ml-4">
              {site.favicon ? (
                <Image
                  alt={site.title}
                  src={site.favicon}
                  width={28}
                  height={28}
                  className="object-contain"
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Globe className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="truncate flex items-center gap-2 flex-wrap">
                {site.title}
                {site.pinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-medium">
                    <Star className="w-2.5 h-2.5 fill-yellow-500" />
                    Favourite
                  </span>
                )}
                {site.category && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium">
                    <Tag className="w-2.5 h-2.5" />
                    {site.category}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="truncate">
                {site.description}
              </CardDescription>
            </div>
          </div>

          {site.link && (
            <CardAction>
              <a
                href={site.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 whitespace-nowrap"
              >
                <ExternalLink className="w-3 h-3" />
                {site.actionLabel || "Open"}
              </a>
            </CardAction>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}



// ─── Helper ───────────────────────────────────────────────────────────────────
function toSiteWithId(s: (typeof initialSites)[0], index: number): Site {
  const link = (s as { link?: string }).link || "";
  return {
    id: `site-${index}-${s.title}`,
    title: s.title,
    description: s.description,
    link,
    actionLabel: (s as { actionLabel?: string }).actionLabel,
    favicon: link ? getFaviconUrl(link) : "",
    category: (s as { category?: string }).category,
    pinned: false,
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SitesGrid() {
  const [sites, setSites] = useState<Site[]>(() =>
    initialSites.map(toSiteWithId)
  );
  const [showModal, setShowModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("awedashboard-sites");
    if (stored) {
      try {
        setSites(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("awedashboard-sites", JSON.stringify(sites));
  }, [sites]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (over && active.id !== over.id) {
      setSites((items) => {
        const oldIndex = items.findIndex((s) => s.id === active.id);
        const newIndex = items.findIndex((s) => s.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleSave(site: Omit<Site, "id">) {
    if (editingSite) {
      setSites((prev) =>
        prev.map((s) => (s.id === editingSite.id ? { ...site, id: s.id, pinned: s.pinned } : s))
      );
    } else {
      setSites((prev) => [...prev, { ...site, id: `site-${Date.now()}` }]);
    }
  }

  function handleEdit(site: Site) {
    setEditingSite(site);
    setShowModal(true);
  }

  function handleRemove(id: string) {
    setSites((prev) => prev.filter((s) => s.id !== id));
  }

  function handleTogglePin(id: string) {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  function handleExport() {
    const json = JSON.stringify(sites, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "awedashboard-sites.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Import ──────────────────────────────────────────────────────────────────
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as Site[];
        if (Array.isArray(parsed)) {
          setSites(parsed);
        }
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    // reset so the same file can be re-imported
    e.target.value = "";
  }

  const activeSite = sites.find((s) => s.id === activeId);

  const categories = Array.from(
    new Set(sites.map((s) => s.category).filter(Boolean))
  ) as string[];

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || site.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pinned sites go first, then the rest (order within each group is preserved)
  const sortedFilteredSites = [
    ...filteredSites.filter((s) => s.pinned),
    ...filteredSites.filter((s) => !s.pinned),
  ];

  return (
    <>
      {showModal && (
        <SiteFormModal
          onClose={() => {
            setShowModal(false);
            setEditingSite(null);
          }}
          onSave={handleSave}
          categories={categories}
          initialData={editingSite}
        />
      )}

      {/* Hidden file input for import */}
      <input
        ref={importRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImport}
      />

      {/* Stats bar */}
      <StatsBar sites={sites} />

      {/* Toolbar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sites…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
            />
          </div>

          {/* View mode + Export/Import */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "grid"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 rounded-xl transition-all ${viewMode === "list"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px bg-slate-200 mx-1 self-stretch" />

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-2.5 rounded-xl bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
              title="Export sites as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Import */}
            <button
              onClick={() => importRef.current?.click()}
              className="p-2.5 rounded-xl bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all"
              title="Import sites from JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!selectedCategory
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                : "bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1.5 ${selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                <Tag className="w-3 h-3" />
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid / List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedFilteredSites.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-3"
            }
          >
            {/* Add new site button */}
            <button
              onClick={() => setShowModal(true)}
              className="group text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)] rounded-xl border-dashed border-2 border-slate-200 hover:border-blue-400 bg-white/60 hover:bg-white/80 p-5 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <PlusIcon className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">Add new site</p>
                <p className="text-xs text-slate-400">Click to create a new entry</p>
              </div>
            </button>

            {sortedFilteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onRemove={handleRemove}
                onTogglePin={handleTogglePin}
                onEdit={handleEdit}
                viewMode={viewMode}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSite && (
            <div className="scale-105 shadow-2xl rounded-xl ring-2 ring-blue-500/50 bg-white">
              <Card className="h-full border-slate-200/80">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-slate-200/60 flex items-center justify-center shrink-0 overflow-hidden ml-4">
                      {activeSite.favicon ? (
                        <img
                          alt={activeSite.title}
                          src={activeSite.favicon}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <Globe className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate flex items-center gap-2 flex-wrap">
                        {activeSite.title}
                        {activeSite.pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-medium">
                            <Star className="w-2.5 h-2.5 fill-yellow-500" />
                            Favourite
                          </span>
                        )}
                        {activeSite.category && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-medium">
                            <Tag className="w-2.5 h-2.5" />
                            {activeSite.category}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="truncate">
                        {activeSite.description}
                      </CardDescription>
                    </div>
                  </div>
                  {activeSite.link && (
                    <CardAction>
                      <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        <ExternalLink className="w-3 h-3" />
                        {activeSite.actionLabel || "Open"}
                      </div>
                    </CardAction>
                  )}
                </CardHeader>
              </Card>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}