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
import { PlusIcon, GripVertical, X, ExternalLink, Globe } from "lucide-react";
import initialSites from "@/app/sites.json";

interface Site {
  id: string;
  title: string;
  description: string;
  link: string;
  actionLabel?: string;
  favicon?: string;
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

function SiteCard({
  site,
  onRemove,
}: {
  site: Site;
  onRemove: (id: string) => void;
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
      <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            {/* Drag handle */}
            <button
              {...attributes}
              {...listeners}
              className="absolute top-3 left-2 opacity-0 group-hover/card:opacity-40 hover:!opacity-100 text-slate-400 cursor-grab active:cursor-grabbing transition-opacity p-1 rounded touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(site.id);
              }}
              className="absolute top-3 right-3 opacity-0 group-hover/card:opacity-60 hover:!opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 rounded"
              aria-label="Remove site"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden ml-4">
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
              <CardTitle className="truncate">{site.title}</CardTitle>
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
                className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-slate-700 transition-all duration-200 whitespace-nowrap"
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

function AddSiteModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (site: Omit<Site, "id">) => void;
}) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [faviconError, setFaviconError] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    urlInputRef.current?.focus();
  }, []);

  const handleUrlBlur = () => {
    if (url) {
      try {
        const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
        const normalized = parsed.href;
        if (url !== normalized) setUrl(normalized);
        setFaviconPreview(getFaviconUrl(normalized));
        setFaviconError(false);
        if (!title) {
          setTitle(parsed.hostname.replace(/^www\./, ""));
        }
        if (!description) {
          setDescription(parsed.hostname);
        }
      } catch {
        // invalid URL
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    onAdd({
      title: title || normalizedUrl,
      description: description || normalizedUrl,
      link: normalizedUrl,
      actionLabel: actionLabel || "Open",
      favicon: getFaviconUrl(normalizedUrl),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Add new site</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">
                {faviconPreview && !faviconError ? (
                  <img
                    src={faviconPreview}
                    alt=""
                    className="w-5 h-5 object-contain"
                    onError={() => setFaviconError(true)}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <input
                ref={urlInputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://example.com"
                required
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My site"
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
          </div>

          {/* Action label */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Button label{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              placeholder="Open"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Add site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toSiteWithId(s: (typeof initialSites)[0], index: number): Site {
  const link = (s as { link?: string }).link || "";
  return {
    id: `site-${index}-${s.title}`,
    title: s.title,
    description: s.description,
    link,
    actionLabel: (s as { actionLabel?: string }).actionLabel,
    favicon: link ? getFaviconUrl(link) : "",
  };
}

export function SitesGrid() {
  const [sites, setSites] = useState<Site[]>(() =>
    initialSites.map(toSiteWithId)
  );
  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  function handleAdd(site: Omit<Site, "id">) {
    const newSite: Site = {
      ...site,
      id: `site-${Date.now()}`,
    };
    setSites((prev) => [...prev, newSite]);
  }

  function handleRemove(id: string) {
    setSites((prev) => prev.filter((s) => s.id !== id));
  }

  const activeSite = sites.find((s) => s.id === activeId);

  return (
    <>
      {showModal && (
        <AddSiteModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sites.map((s) => s.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {/* Add new site card */}
            <button
              onClick={() => setShowModal(true)}
              className="group text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl border-dashed border-2 border-slate-200 hover:border-slate-400 bg-white/60 hover:bg-white/80 p-5 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <PlusIcon className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">Add new site</p>
                <p className="text-xs text-slate-400">Click to create a new entry</p>
              </div>
            </button>

            {sites.map((site) => (
              <SiteCard key={site.id} site={site} onRemove={handleRemove} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSite && (
            <div className="opacity-90 rotate-1 scale-105 shadow-2xl rounded-xl">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 overflow-hidden">
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
                      <CardTitle className="truncate">{activeSite.title}</CardTitle>
                      <CardDescription className="truncate">
                        {activeSite.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
