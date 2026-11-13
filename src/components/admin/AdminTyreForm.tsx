import React, { useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { ApplicationType, Brand, Category, Tyre } from '../../types/index.ts';
import { api } from '../../api/client.ts';
import { TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface AdminTyreFormProps {
  existingTyre?: Tyre | null;
  brands: Brand[];
  categories: Category[];
  applications: ApplicationType[];
  onSaved: () => Promise<void>;
  onCancel: () => void;
}

export const AdminTyreForm: React.FC<AdminTyreFormProps> = ({
  existingTyre,
  brands,
  categories,
  applications,
  onSaved,
  onCancel,
}) => {
  const [name, setName] = useState(existingTyre?.name || '');
  const [sku, setSku] = useState(existingTyre?.sku || '');
  const [brandId, setBrandId] = useState(existingTyre?.brandId || brands[0]?.id || '');
  const [categoryIds, setCategoryIds] = useState<string[]>(
    existingTyre?.categoryIds || (categories[0] ? [categories[0].id] : [])
  );
  const [sizesInput, setSizesInput] = useState(
    existingTyre?.sizes?.join(', ') || '12R22.5, 295/80R22.5'
  );
  const [plyRating, setPlyRating] = useState(existingTyre?.plyRating || '18PR');
  const [loadIndex, setLoadIndex] = useState(existingTyre?.loadIndex || '152/149');
  const [speedRating, setSpeedRating] = useState(existingTyre?.speedRating || 'M');
  const [treadPattern, setTreadPattern] = useState(existingTyre?.treadPattern || '');
  const [treadDepth, setTreadDepth] = useState(existingTyre?.treadDepth || '16.5mm');
  const [constructionType, setConstructionType] = useState<'Radial' | 'Bias'>(
    existingTyre?.constructionType || 'Radial'
  );
  const [application, setApplication] = useState(
    existingTyre?.application || applications[0]?.name || 'Long Haul / Steer Axle'
  );
  const [shortDescription, setShortDescription] = useState(
    existingTyre?.shortDescription || ''
  );
  const [fullDescription, setFullDescription] = useState(
    existingTyre?.fullDescription || ''
  );
  const [featuresInput, setFeaturesInput] = useState(
    existingTyre?.features?.join('\n') || ''
  );
  const [rimSize, setRimSize] = useState(existingTyre?.technicalSpecs?.rimSize || '');
  const [overallDiameter, setOverallDiameter] = useState(
    existingTyre?.technicalSpecs?.overallDiameter || ''
  );
  const [sectionWidth, setSectionWidth] = useState(
    existingTyre?.technicalSpecs?.sectionWidth || ''
  );
  const [maxLoadSingle, setMaxLoadSingle] = useState(
    existingTyre?.technicalSpecs?.maxLoadSingle || ''
  );
  const [inflationPressure, setInflationPressure] = useState(
    existingTyre?.technicalSpecs?.inflationPressure || ''
  );
  const [tkph, setTkph] = useState(existingTyre?.technicalSpecs?.tkph || '');
  const [stockQuantity, setStockQuantity] = useState(
    existingTyre?.stockQuantity ?? 40
  );
  const [minimumStockAlert, setMinimumStockAlert] = useState(
    existingTyre?.minimumStockAlert ?? 10
  );
  const [stockStatus, setStockStatus] = useState(
    existingTyre?.stockStatus || 'in_stock'
  );
  const [mainImage, setMainImage] = useState(
    existingTyre?.mainImage || TYRE_STUDIO_ASSETS.tbr
  );
  const [publishingStatus, setPublishingStatus] = useState<'published' | 'draft'>(
    existingTyre?.publishingStatus || 'published'
  );
  const [isFeatured, setIsFeatured] = useState(existingTyre?.isFeatured ?? true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setMainImage(url);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryIds.length === 0) {
      setError('Select at least one tyre category');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const payload: Partial<Tyre> = {
        name,
        sku,
        brandId,
        categoryIds,
        sizes: sizesInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        plyRating,
        loadIndex,
        speedRating,
        treadPattern,
        treadDepth,
        constructionType,
        application,
        shortDescription,
        fullDescription,
        features: featuresInput
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        technicalSpecs: {
          rimSize,
          overallDiameter,
          sectionWidth,
          maxLoadSingle,
          inflationPressure,
          tkph,
        },
        stockQuantity: Number(stockQuantity) || 0,
        minimumStockAlert: Number(minimumStockAlert) || 10,
        stockStatus,
        mainImage,
        publishingStatus,
        isFeatured,
      };

      if (existingTyre) {
        await api.updateTyre(existingTyre.id, payload);
      } else {
        await api.createTyre(payload);
      }
      await onSaved();
    } catch (err: any) {
      setError(err.message || 'Could not save tyre product');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 focus:border-[#1783C1] focus:bg-white rounded-lg text-xs text-[#333333] outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 bg-white border border-slate-200 rounded-lg text-[#0A3C6E] hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
              {existingTyre ? `Edit ${existingTyre.name}` : 'Add New Tyre Product'}
            </h1>
            <p className="text-xs text-[#333333]/75">
              Assign brand, multi-category tags, engineering specs, and live stock units.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#0A3C6E] hover:bg-[#1783C1] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Tyre Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
              Core Identity & Fitment
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">SKU Code *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Brand *</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className={inputClass}
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Application</label>
                <select
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  className={inputClass}
                >
                  {applications.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Construction</label>
                <select
                  value={constructionType}
                  onChange={(e) => setConstructionType(e.target.value as 'Radial' | 'Bias')}
                  className={inputClass}
                >
                  <option value="Radial">Radial</option>
                  <option value="Bias">Bias</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Categories * (Select one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      categoryIds.includes(cat.id)
                        ? 'bg-[#0A3C6E] text-white border-[#0A3C6E]'
                        : 'bg-[#F4F7FA] text-[#333333] border-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Available Sizes (comma separated)
              </label>
              <input
                type="text"
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Ply Rating</label>
                <input
                  type="text"
                  value={plyRating}
                  onChange={(e) => setPlyRating(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Load Index</label>
                <input
                  type="text"
                  value={loadIndex}
                  onChange={(e) => setLoadIndex(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Speed</label>
                <input
                  type="text"
                  value={speedRating}
                  onChange={(e) => setSpeedRating(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Pattern</label>
                <input
                  type="text"
                  value={treadPattern}
                  onChange={(e) => setTreadPattern(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Tread Depth</label>
                <input
                  type="text"
                  value={treadDepth}
                  onChange={(e) => setTreadDepth(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
              Descriptions & Technical Matrix
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Short Summary</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Full Engineering Overview</label>
              <textarea
                rows={3}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Key Features (one per line)
              </label>
              <textarea
                rows={3}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Rim Size</label>
                <input
                  type="text"
                  value={rimSize}
                  onChange={(e) => setRimSize(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Diameter</label>
                <input
                  type="text"
                  value={overallDiameter}
                  onChange={(e) => setOverallDiameter(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Section Width</label>
                <input
                  type="text"
                  value={sectionWidth}
                  onChange={(e) => setSectionWidth(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Max Load Single</label>
                <input
                  type="text"
                  value={maxLoadSingle}
                  onChange={(e) => setMaxLoadSingle(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Pressure</label>
                <input
                  type="text"
                  value={inflationPressure}
                  onChange={(e) => setInflationPressure(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">TKPH Rating</label>
                <input
                  type="text"
                  value={tkph}
                  onChange={(e) => setTkph(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Image & Stock */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
              Product Photography
            </h2>
            <div className="h-44 bg-[#F4F7FA] border border-slate-200 rounded-xl p-3 flex items-center justify-center">
              <img src={mainImage} alt="Preview" className="w-full h-full object-contain" />
            </div>

            <label className="block w-full py-2 px-3 bg-[#F4F7FA] hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-center cursor-pointer">
              <Upload className="w-3.5 h-3.5 inline mr-1.5" />
              <span>{uploading ? 'Uploading...' : 'Upload Custom Tyre Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <div>
              <div className="text-[11px] font-semibold text-[#333333]/75 mb-1.5">
                Or Choose Studio Tyre Photo:
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(TYRE_STUDIO_ASSETS)
                  .filter(([k]) => k !== 'heroWarehouse')
                  .map(([key, url]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMainImage(url)}
                      className={`p-1 rounded border bg-[#F4F7FA] ${
                        mainImage === url ? 'border-[#1783C1] ring-2 ring-[#1783C1]/30' : 'border-slate-200'
                      }`}
                    >
                      <img src={url} alt={key} className="w-full h-10 object-contain" />
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#0A3C6E] uppercase tracking-wider">
              Stock & Publishing
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Stock Quantity</label>
              <input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Minimum Stock Alert</label>
              <input
                type="number"
                min={0}
                value={minimumStockAlert}
                onChange={(e) => setMinimumStockAlert(Number(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as any)}
                className={inputClass}
              >
                <option value="in_stock">In Stock</option>
                <option value="on_order">On Order / Incoming</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Publishing</label>
              <select
                value={publishingStatus}
                onChange={(e) => setPublishingStatus(e.target.value as any)}
                className={inputClass}
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#0A3C6E] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
