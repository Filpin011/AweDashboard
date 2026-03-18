"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Site, getFaviconUrl } from "./sites-grid-enhanced";

export function SiteFormModal({
  onClose,
  onSave,
  categories,
  initialData,
}: {
  onClose: () => void;
  onSave: (site: Omit<Site, "id">) => void;
  categories: string[];
  initialData?: Site | null;
}) {
  const [url, setUrl] = useState(initialData?.link || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [actionLabel, setActionLabel] = useState(initialData?.actionLabel || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [faviconPreview, setFaviconPreview] = useState(initialData?.favicon || "");
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
        if (!title) setTitle(parsed.hostname.replace(/^www\./, ""));
        if (!description) setDescription(parsed.hostname);
      } catch {
        // invalid URL
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    onSave({
      title,
      description,
      link: normalizedUrl,
      actionLabel: actionLabel || undefined,
      favicon: getFaviconUrl(normalizedUrl),
      category: category || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900">{initialData ? "Edit site" : "Add new site"}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              URL <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2 items-center">
              {faviconPreview && !faviconError && (
                <img
                  src={faviconPreview}
                  alt=""
                  className="w-7 h-7 rounded-lg border border-slate-200 object-contain shrink-0"
                  onError={() => setFaviconError(true)}
                />
              )}
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
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My favourite site"
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Category{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder={categories.length > 0 ? categories[0] : "Work, Tools…"}
              list="categories-list"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-400 transition-all"
            />
            {categories.length > 0 && (
              <datalist id="categories-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
          </div>

          {/* Action label */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
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
              {initialData ? "Save changes" : "Add site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
