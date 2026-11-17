import { ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';
import { HistoryCategory, HistoryLog } from '../../types/vaquita';

interface HistoriViewProps {
  logs: HistoryLog[];
  onBack: () => void;
}

const CATEGORIES: ('Semua' | HistoryCategory)[] = [
  'Semua',
  'Absensi',
  'Jadwal',
  'Progress',
  'Cuti',
  'Gaji',
  'Prestasi',
];

export function HistoriView({ logs, onBack }: HistoriViewProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Semua' | HistoryCategory>('Semua');

  const filtered = logs.filter((log) => {
    const matchCat = category === 'Semua' || log.category === category;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q || log.title.toLowerCase().includes(q) || log.detail.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white border border-[#E4ECE8] text-[#162420] hover:bg-[#F3FAF7] transition-colors"
          aria-label="Kembali ke beranda"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#162420]">
            Histori Aktivitas
          </h1>
          <p className="text-xs sm:text-sm text-[#526660]">
            Catatan kronologis seluruh aktivitas dan transaksi warga di portal
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6B7F78] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari aktivitas, tanggal, atau catatan..."
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-white border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`min-h-[36px] px-3 py-1 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                category === cat
                  ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                  : 'text-[#526660] hover:text-[#162420]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7">
        {filtered.length === 0 ? (
          <div className="py-8 text-center space-y-1.5">
            <p className="font-display text-base font-semibold text-[#162420]">
              Tidak ada aktivitas yang cocok
            </p>
            <p className="text-sm text-[#526660]">
              Ubah kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EDF2EF]">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#526660]">
                    <span className="font-semibold text-[#0F5C4D]">{log.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">{log.timestamp}</span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#162420]">{log.title}</p>
                  <p className="text-xs sm:text-sm text-[#526660]">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
