import { ArrowLeft, CalendarClock, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ScheduleCategory, ScheduleItem } from '../../types/vaquita';

interface JadwalViewProps {
  schedules: ScheduleItem[];
  onBack: () => void;
  onAddSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  onRequestReschedule: (scheduleId: string) => void;
}

const DAY_LABELS = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const CATEGORIES: ('Semua' | ScheduleCategory)[] = ['Semua', 'Kelas', 'Mentoring', 'Rapat'];

export function JadwalView({
  schedules,
  onBack,
  onAddSchedule,
  onRequestReschedule,
}: JadwalViewProps) {
  const [selectedDay, setSelectedDay] = useState<number>(-1); // -1 = Semua
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | ScheduleCategory>('Semua');
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleCategory>('Kelas');
  const [dayIndex, setDayIndex] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = schedules.filter((item) => {
    const matchDay = selectedDay === -1 || item.dayIndex === selectedDay;
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchDay && matchCat;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;
    const dayDateMap: Record<number, string> = {
      0: 'Senin, 16 Nov',
      1: 'Selasa, 17 Nov',
      2: 'Rabu, 18 Nov',
      3: 'Kamis, 19 Nov',
      4: 'Jumat, 20 Nov',
    };
    onAddSchedule({
      title: title.trim(),
      category,
      dayIndex,
      dateLabel: dayDateMap[dayIndex] ?? 'Pekan Ini',
      startTime,
      endTime,
      location: location.trim(),
      participantCount: 10,
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setLocation('');
    setNotes('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
              Jadwal Kegiatan
            </h1>
            <p className="text-xs sm:text-sm text-[#526660]">
              Agenda kelas, mentoring, dan koordinasi warga Vaquita
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Tutup Form' : 'Tambah Jadwal'}</span>
        </button>
      </div>

      {/* Add Schedule Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-6 space-y-4"
        >
          <h2 className="font-display text-base font-bold text-[#162420]">Buat Jadwal Baru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="block space-y-1.5 sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-medium text-[#526660]">Judul Sesi</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Kelas Evaluasi Kurikulum"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Kategori</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ScheduleCategory)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] bg-white text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              >
                <option value="Kelas">Kelas</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Rapat">Rapat</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Hari</span>
              <select
                value={dayIndex}
                onChange={(e) => setDayIndex(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] bg-white text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              >
                <option value={0}>Senin, 16 Nov</option>
                <option value={1}>Selasa, 17 Nov</option>
                <option value={2}>Rabu, 18 Nov</option>
                <option value={3}>Kamis, 19 Nov</option>
                <option value={4}>Jumat, 20 Nov</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Mulai</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Selesai</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Lokasi / Ruang</span>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Ruang Meranti Lt. 2"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[#526660]">Catatan Sesi (opsional)</span>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Persiapan atau materi yang perlu dibawa..."
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
            />
          </label>
          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D8E3DE] text-sm font-medium text-[#526660] hover:text-[#162420]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold"
            >
              Simpan Jadwal
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl overflow-x-auto">
          {DAY_LABELS.map((label, idx) => {
            const value = idx - 1;
            const active = selectedDay === value;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedDay(value)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                    : 'text-[#526660] hover:text-[#162420]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                    : 'text-[#526660] hover:text-[#162420]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-3xl border border-[#E4ECE8] divide-y divide-[#EDF2EF]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="font-display text-base font-semibold text-[#162420]">
              Tidak ada jadwal pada filter ini
            </p>
            <p className="text-sm text-[#526660]">
              Pilih hari lain atau tambahkan jadwal baru untuk mengisi agenda Anda.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#526660]">
                  <span className="font-semibold text-[#0F5C4D]">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.dateLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">
                    {item.startTime} – {item.endTime}
                  </span>
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#162420]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#526660]">
                  {item.location} · {item.participantCount} peserta
                </p>
                {item.notes && <p className="text-xs text-[#6B7F78]">{item.notes}</p>}
              </div>

              <button
                type="button"
                onClick={() => onRequestReschedule(item.id)}
                className="min-h-[42px] px-4 py-2 rounded-xl border border-[#D8E3DE] hover:border-[#0F5C4D] hover:bg-[#F3FAF7] text-xs sm:text-sm font-semibold text-[#0F5C4D] inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
              >
                <CalendarClock className="w-4 h-4" />
                <span>Ajukan Reschedule</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
