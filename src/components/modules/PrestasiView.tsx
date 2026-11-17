import { ArrowLeft, Plus, Trophy } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PrestasiCategory, PrestasiItem } from '../../types/vaquita';

interface PrestasiViewProps {
  items: PrestasiItem[];
  onBack: () => void;
  onAddPrestasi: (item: Omit<PrestasiItem, 'id'>) => void;
}

const CATEGORIES: ('Semua' | PrestasiCategory)[] = ['Semua', 'Pengajaran', 'Komunitas', 'Inovasi'];

export function PrestasiView({ items, onBack, onAddPrestasi }: PrestasiViewProps) {
  const [filterCat, setFilterCat] = useState<'Semua' | PrestasiCategory>('Semua');
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PrestasiCategory>('Pengajaran');
  const [points, setPoints] = useState(100);
  const [description, setDescription] = useState('');

  const totalPoints = items.reduce((acc, item) => acc + item.points, 0);
  const filtered = items.filter((item) =>
    filterCat === 'Semua' ? true : item.category === filterCat,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    onAddPrestasi({
      title: title.trim(),
      category,
      dateLabel: '16 Nov 2026',
      points: Number(points) || 50,
      description: description.trim(),
    });
    setTitle('');
    setDescription('');
    setPoints(100);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              Prestasi & Kontribusi
            </h1>
            <p className="text-xs sm:text-sm text-[#526660]">
              Catatan pencapaian dan penghargaan warga Vaquita
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Tutup Form' : 'Catat Prestasi'}</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-6 space-y-4"
        >
          <h2 className="font-display text-base font-bold text-[#162420]">
            Tambah Catatan Prestasi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block space-y-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-[#526660]">Judul Pencapaian</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Penyusun Modul Terstruktur Terbaik"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Kategori</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PrestasiCategory)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] bg-white text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              >
                <option value="Pengajaran">Pengajaran</option>
                <option value="Komunitas">Komunitas</option>
                <option value="Inovasi">Inovasi</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <label className="block space-y-1.5 sm:col-span-3">
              <span className="text-xs font-medium text-[#526660]">Keterangan Singkat</span>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dampak atau hasil utama yang dicapai..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Poin Kontribusi</span>
              <input
                type="number"
                min={10}
                max={500}
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D8E3DE] text-sm font-medium text-[#526660]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold"
            >
              Simpan Prestasi
            </button>
          </div>
        </form>
      )}

      {/* Points Summary + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F2EE] flex items-center justify-center text-[#0F5C4D] shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#526660]">Akumulasi Poin Warga</p>
            <p className="font-mono-num text-2xl font-bold text-[#0F5C4D]">{totalPoints} poin</p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCat(cat)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                filterCat === cat
                  ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                  : 'text-[#526660] hover:text-[#162420]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-6 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-3 text-xs text-[#526660]">
              <span>
                {item.category} · {item.dateLabel}
              </span>
              <span className="font-mono-num font-bold text-[#0F5C4D]">+{item.points} poin</span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#162420]">
              {item.title}
            </h3>
            <p className="text-sm text-[#526660] leading-relaxed">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
