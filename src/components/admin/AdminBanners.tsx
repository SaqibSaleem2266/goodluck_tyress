import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { Banner } from '../../types/index.ts';
import { api } from '../../api/client.ts';
import { TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface AdminBannersProps {
  banners: Banner[];
  onRefresh: () => Promise<void>;
  onPreviewHomepage?: () => void;
}

const SLIDE_PRESETS = [
  { label: 'Port Qasim Warehouse Hero', url: TYRE_STUDIO_ASSETS.heroWarehouse },
  { label: 'TBR Highway Commercial', url: TYRE_STUDIO_ASSETS.tbr },
  { label: 'OTR Mining Earthmover', url: TYRE_STUDIO_ASSETS.otr },
  { label: 'SUV 4x4 All-Terrain', url: TYRE_STUDIO_ASSETS.suv },
  { label: 'Agricultural Tractor', url: TYRE_STUDIO_ASSETS.agri },
  { label: 'Industrial Port Handling', url: TYRE_STUDIO_ASSETS.industrial },
];

export const AdminBanners: React.FC<AdminBannersProps> = ({
  banners,
  onRefresh,
  onPreviewHomepage,
}) => {
  const [slides, setSlides] = useState<Banner[]>(banners);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Browse Tyre Catalogue');
  const [ctaLink, setCtaLink] = useState('/tyres');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Request Bulk Quote');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState('modal:quote');
  const [imageUrl, setImageUrl] = useState<string>(TYRE_STUDIO_ASSETS.heroWarehouse);
  const [isActive, setIsActive] = useState(true);
  const [showFirst, setShowFirst] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setSlides(
      banners
        .slice()
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    );
  }, [banners]);

  const persistSlides = async (nextList: Banner[], message: string) => {
    setSaving(true);
    setError('');
    try {
      const normalized = nextList.map((b, idx) => ({
        ...b,
        isActive: b.isActive !== false,
        displayOrder: idx + 1,
      }));
      const saved = await api.updateBanners(normalized);
      setSlides(saved);
      await onRefresh();
      setNotice(message);
    } catch (err: any) {
      setError(err.message || 'Could not save homepage banners');
    } finally {
      setSaving(false);
    }
  };

  const openAddSlide = () => {
    setEditingSlide(null);
    setTitle('');
    setSubtitle('');
    setCtaText('Browse Tyre Catalogue');
    setCtaLink('/tyres');
    setSecondaryCtaText('Request Bulk Quote');
    setSecondaryCtaLink('modal:quote');
    setImageUrl(TYRE_STUDIO_ASSETS.heroWarehouse);
    setIsActive(true);
    setShowFirst(true);
    setError('');
    setNotice('');
    setShowForm(true);
  };

  const openEditSlide = (slide: Banner) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setCtaText(slide.ctaText || 'Browse Tyre Catalogue');
    setCtaLink(slide.ctaLink || '/tyres');
    setSecondaryCtaText(slide.secondaryCtaText || '');
    setSecondaryCtaLink(slide.secondaryCtaLink || '');
    setImageUrl(slide.imageUrl || TYRE_STUDIO_ASSETS.heroWarehouse);
    setIsActive(slide.isActive !== false);
    setShowFirst(slide.displayOrder === 1);
    setError('');
    setNotice('');
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'Banner image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Slide headline is required');
      return;
    }

    let updated: Banner[];
    if (editingSlide) {
      const modified: Banner = {
        ...editingSlide,
        title: title.trim(),
        subtitle: subtitle.trim(),
        ctaText: ctaText.trim() || 'Browse Catalogue',
        ctaLink: ctaLink.trim() || '/tyres',
        secondaryCtaText: secondaryCtaText.trim() || undefined,
        secondaryCtaLink: secondaryCtaLink.trim() || undefined,
        imageUrl,
        isActive,
      };
      const others = slides.filter((s) => s.id !== editingSlide.id);
      updated = showFirst ? [modified, ...others] : [...others, modified];
    } else {
      const created: Banner = {
        id: `bnr-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle.trim(),
        ctaText: ctaText.trim() || 'Browse Catalogue',
        ctaLink: ctaLink.trim() || '/tyres',
        secondaryCtaText: secondaryCtaText.trim() || undefined,
        secondaryCtaLink: secondaryCtaLink.trim() || undefined,
        imageUrl,
        isActive,
        displayOrder: 1,
      };
      updated = showFirst ? [created, ...slides] : [...slides, created];
    }

    await persistSlides(
      updated,
      isActive
        ? 'Slide saved and published live on the Homepage Hero Slider.'
        : 'Slide saved as hidden draft.'
    );
    setShowForm(false);
  };

  const toggleActive = async (slide: Banner) => {
    const updated = slides.map((s) =>
      s.id === slide.id ? { ...s, isActive: !(s.isActive !== false) } : s
    );
    await persistSlides(updated, 'Slide visibility updated.');
  };

  const moveSlide = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const copy = [...slides];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    await persistSlides(copy, 'Updated slide display sequence.');
  };

  const deleteSlide = async (id: string) => {
    const remaining = slides.filter((s) => s.id !== id);
    await persistSlides(remaining, 'Slide removed from Hero Slider.');
  };

  const inputClass =
    'w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] focus:bg-white rounded-lg text-xs text-[#333333] outline-none';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
            Homepage Banners & Hero Slider
          </h1>
          <p className="text-xs text-[#333333]/75 mt-0.5">
            Add, reorder, or publish hero slider slides immediately to the public homepage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onPreviewHomepage && (
            <button
              type="button"
              onClick={onPreviewHomepage}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0A3C6E] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1783C1]" />
              <span>Preview Homepage</span>
            </button>
          )}
          <button
            type="button"
            onClick={openAddSlide}
            className="px-4 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Slide</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          {onPreviewHomepage && (
            <button
              type="button"
              onClick={onPreviewHomepage}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider rounded-lg self-start sm:self-auto"
            >
              View on Homepage →
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSaveForm}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
            {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Slide Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Heavy-Duty Mining & Highway Radial Stock Arrival"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Short summary displayed under the main hero heading..."
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Primary Button Route
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={secondaryCtaText}
                    onChange={(e) => setSecondaryCtaText(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Secondary Route / Action
                  </label>
                  <input
                    type="text"
                    value={secondaryCtaLink}
                    onChange={(e) => setSecondaryCtaLink(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#0A3C6E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>Publish Immediately on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#0A3C6E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFirst}
                    onChange={(e) => setShowFirst(e.target.checked)}
                  />
                  <span>Show First (Slide 01)</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold">Slide Visual Preview</div>
              <div className="h-44 rounded-xl overflow-hidden border border-slate-200 bg-[#06284B]">
                <img
                  src={imageUrl}
                  alt="Slide preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="block w-full py-2 px-3 bg-[#F4F7FA] hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-center cursor-pointer">
                <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Custom Banner Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              <div>
                <div className="text-[11px] font-semibold text-[#333333]/75 mb-1.5">
                  Or Pick Local Studio Image:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {SLIDE_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`p-1 rounded-lg border text-left ${
                        imageUrl === preset.url
                          ? 'border-[#1783C1] ring-2 ring-[#1783C1]/30'
                          : 'border-slate-200'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-12 object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold bg-[#F4F7FA] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save & Publish Slide'}
            </button>
          </div>
        </form>
      )}

      {/* Existing Slides List */}
      <div className="space-y-4">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-5"
          >
            <img
              src={slide.imageUrl || TYRE_STUDIO_ASSETS.heroWarehouse}
              alt={slide.title}
              className="w-full md:w-44 h-28 object-cover rounded-lg border border-slate-200 shrink-0"
            />

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-[#1783C1]">
                  SLIDE {String(idx + 1).padStart(2, '0')}
                </span>
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    slide.isActive !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {slide.isActive !== false ? 'Published' : 'Hidden'}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0A3C6E]">{slide.title}</h3>
              <p className="text-xs text-[#333333]/80 line-clamp-2">{slide.subtitle}</p>
              <div className="text-[11px] font-mono text-[#333333]/65">
                CTA: {slide.ctaText} → {slide.ctaLink}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={idx === 0 || saving}
                onClick={() => moveSlide(idx, -1)}
                aria-label="Move slide up"
                className="p-2 bg-[#F4F7FA] hover:bg-slate-200 disabled:opacity-40 rounded-lg text-[#0A3C6E]"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === slides.length - 1 || saving}
                onClick={() => moveSlide(idx, 1)}
                aria-label="Move slide down"
                className="p-2 bg-[#F4F7FA] hover:bg-slate-200 disabled:opacity-40 rounded-lg text-[#0A3C6E]"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => toggleActive(slide)}
                aria-label={slide.isActive !== false ? 'Hide slide' : 'Publish slide'}
                className="p-2 bg-[#F4F7FA] hover:bg-slate-200 rounded-lg text-[#0A3C6E]"
              >
                {slide.isActive !== false ? (
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() => openEditSlide(slide)}
                aria-label={`Edit ${slide.title}`}
                className="p-2 bg-[#F4F7FA] hover:bg-slate-200 rounded-lg text-[#0A3C6E]"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => deleteSlide(slide.id)}
                aria-label={`Delete ${slide.title}`}
                className="p-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
