import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';
import { Brand, Category } from '../../types/index.ts';
import { api } from '../../api/client.ts';
import { resolveCategoryImage, TYRE_STUDIO_ASSETS } from '../../utils/tyreImages.ts';

interface AdminCategoriesProps {
  categories: Category[];
  brands: Brand[];
  onRefresh: () => Promise<void>;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  brands,
  onRefresh,
}) => {
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [image, setImage] = useState<string>(TYRE_STUDIO_ASSETS.tbr);
  const [error, setError] = useState('');

  const openNew = () => {
    setEditing(null);
    setName('');
    setDescription('');
    setBrandIds([]);
    setImage(TYRE_STUDIO_ASSETS.tbr);
    setError('');
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setBrandIds(cat.brandIds || []);
    setImage(resolveCategoryImage(cat));
    setError('');
    setShowForm(true);
  };

  const toggleBrand = (id: string) => {
    setBrandIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await api.updateCategory(editing.id, { name, description, brandIds, image });
      } else {
        await api.createCategory({ name, description, brandIds, image });
      }
      setShowForm(false);
      await onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (cat: Category) => {
    setError('');
    try {
      await api.deleteCategory(cat.id);
      await onRefresh();
    } catch (err: any) {
      setError(err.message || 'Could not delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-[#0A3C6E] uppercase">
            Tyre Categories Management
          </h1>
          <p className="text-xs text-[#333333]/75 mt-0.5">
            Create categories and assign multiple international brands to each segment.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="px-4 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-sm font-bold text-[#0A3C6E] uppercase">
            {editing ? `Edit ${editing.name}` : 'Create Category'}
          </h2>
          <div>
            <label className="block text-xs font-semibold mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F7FA] border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Assigned Brands</label>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => toggleBrand(b.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    brandIds.includes(b.id)
                      ? 'bg-[#0A3C6E] text-white border-[#0A3C6E]'
                      : 'bg-[#F4F7FA] text-[#333333] border-slate-200'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold bg-[#F4F7FA] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-[#0A3C6E] text-white rounded-lg"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="h-32 bg-[#F4F7FA] border border-slate-200 rounded-lg mb-3 overflow-hidden">
                <img
                  src={resolveCategoryImage(cat)}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="text-base font-bold text-[#0A3C6E]">{cat.name}</h3>
              <p className="text-xs text-[#333333]/75 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="font-mono text-[#1783C1] font-semibold">
                {cat.tyreCount ?? 0} tyres
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  aria-label={`Edit ${cat.name}`}
                  className="p-1.5 text-[#0A3C6E] hover:bg-slate-100 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  aria-label={`Delete ${cat.name}`}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
