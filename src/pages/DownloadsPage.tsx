import React, { useState, useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import { DownloadItem } from '../types/index.ts';

interface DownloadsPageProps {
  downloads: DownloadItem[];
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({ downloads }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(
    () => Array.from(new Set(downloads.map((d) => d.category))).sort(),
    [downloads]
  );

  const visibleDownloads = useMemo(
    () =>
      selectedCategory === 'all'
        ? downloads
        : downloads.filter((d) => d.category === selectedCategory),
    [downloads, selectedCategory]
  );

  return (
    <div className="w-full bg-white text-[#333333] min-h-screen py-10 px-4 lg:px-8 max-w-7xl mx-auto space-y-10">
      <div>
        <div className="text-xs font-mono font-bold text-[#1783C1] uppercase tracking-widest mb-1">
          Engineering Sheets & Product Manuals
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0A3C6E] uppercase tracking-tight">
          Downloads & Technical Catalogues
        </h1>
        <p className="text-sm text-[#333333]/80 mt-1 max-w-2xl">
          Access official brand spec sheets, load-inflation engineering charts, and OTR TKPH calculation tables.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#0A3C6E] text-white'
              : 'bg-[#F4F7FA] text-[#333333] border border-slate-200 hover:border-[#1783C1]'
          }`}
        >
          All Documents ({downloads.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1783C1] text-white'
                : 'bg-[#F4F7FA] text-[#333333] border border-slate-200 hover:border-[#1783C1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleDownloads.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 hover:border-[#1783C1] rounded-xl p-6 flex flex-col justify-between gap-4 shadow-xs transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4F7FA] border border-slate-200 flex items-center justify-center text-[#0A3C6E] shrink-0">
                <FileText className="w-6 h-6 text-[#1783C1]" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#1783C1] uppercase tracking-wider">
                  {item.category}
                  {item.brandName ? ` · ${item.brandName}` : ''}
                </div>
                <h2 className="text-base font-bold text-[#0A3C6E] mt-0.5">
                  {item.title}
                </h2>
                <p className="text-xs text-[#333333]/80 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono text-[#333333]/70">
                {item.fileSize}
              </span>
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0A3C6E] hover:bg-[#1783C1] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Specification</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
