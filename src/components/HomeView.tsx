import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  FileClock,
  History,
  TrendingUp,
  Trophy,
  Wallet,
} from 'lucide-react';
import { AttendanceMode, ModuleId, VaquitaState } from '../types/vaquita';
import { formatIndonesianDate, getTodayISO } from '../utils/formatters';

interface HomeViewProps {
  state: VaquitaState;
  onNavigate: (module: ModuleId) => void;
  onQuickCheckIn: (mode: AttendanceMode) => void;
  onQuickCheckOut: () => void;
}

const MENU_TILES: {
  id: ModuleId;
  label: string;
  icon: typeof CalendarDays;
}[] = [
  { id: 'jadwal', label: 'Jadwal', icon: CalendarDays },
  { id: 'absensi', label: 'Absensi', icon: ClipboardCheck },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'rapor', label: 'Rapor', icon: BookOpenCheck },
  { id: 'prestasi', label: 'Prestasi', icon: Trophy },
  { id: 'reschedule', label: 'Reschedule', icon: CalendarClock },
  { id: 'gaji', label: 'Gaji', icon: Wallet },
  { id: 'cuti', label: 'Cuti', icon: FileClock },
  { id: 'histori', label: 'Histori', icon: History },
];

export function HomeView({
  state,
  onNavigate,
  onQuickCheckIn,
  onQuickCheckOut,
}: HomeViewProps) {
  const todayISO = getTodayISO();
  const todayRecord = state.attendance.find((item) => item.date === todayISO);

  const usedLeaveDays = state.leaves
    .filter((l) => l.type === 'Cuti Tahunan' && l.status !== 'Ditolak')
    .reduce((sum, l) => sum + l.days, 0);
  const remainingLeave = Math.max(0, state.profile.annualLeaveQuota - usedLeaveDays);

  const totalMilestones = state.programs.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = state.programs.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
    0,
  );
  const progressPct =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const totalPoints = state.prestasi.reduce((acc, item) => acc + item.points, 0);
  const upcomingSchedules = state.schedules.slice(0, 3);
  const recentHistory = state.history.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Greeting & Warga Identity Header */}
      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-sm font-medium text-[#526660]">
              {formatIndonesianDate()}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#162420] tracking-tight text-balance">
              Selamat datang, {state.profile.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#526660]">
              <span>{state.profile.role}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{state.profile.memberId}</span>
              <span aria-hidden="true">·</span>
              <span>{state.profile.unit}</span>
            </div>
          </div>

          {/* 4-column unboxed key summary metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#E4ECE8] lg:pl-8">
            <div>
              <p className="text-xs text-[#526660]">Kehadiran</p>
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[#0F5C4D] mt-0.5">
                {todayRecord ? (todayRecord.checkOut ? 'Selesai' : todayRecord.checkIn) : 'Belum'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Progress Modul</p>
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[#162420] mt-0.5">
                {progressPct}%
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Sisa Cuti</p>
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[#162420] mt-0.5">
                {remainingLeave} hari
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Poin Prestasi</p>
              <p className="font-mono-num text-lg sm:text-xl font-semibold text-[#162420] mt-0.5">
                {totalPoints}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-column workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Primary Column: Signature 3x3 Menu Lainnya + Agenda */}
        <div className="lg:col-span-7 space-y-6">
          <section
            aria-labelledby="menu-lainnya-heading"
            className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <h2
                id="menu-lainnya-heading"
                className="font-display text-sm sm:text-base font-bold text-[#4B5A55]"
              >
                Menu Lainnya
              </h2>
              <span className="text-xs text-[#6B7F78]">9 layanan warga</span>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {MENU_TILES.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => onNavigate(tile.id)}
                    className="group min-h-[96px] sm:min-h-[112px] flex flex-col items-center justify-center gap-2.5 px-2 py-4 rounded-2xl bg-white border border-[#E5ECE9] shadow-[0_2px_8px_rgba(15,92,77,0.03)] hover:border-[#0F5C4D]/45 hover:bg-[#F3FAF7] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C4D]"
                  >
                    <Icon
                      className="w-6 h-6 sm:w-7 sm:h-7 text-[#0F5C4D] transition-transform duration-150 group-hover:-translate-y-0.5"
                      strokeWidth={1.85}
                    />
                    <span className="font-display text-xs sm:text-sm font-bold text-[#0F5C4D] whitespace-nowrap">
                      {tile.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Upcoming Agenda */}
          <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
                Agenda Terdekat
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('jadwal')}
                className="min-h-[40px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F5C4D] hover:text-[#0A463A] whitespace-nowrap shrink-0"
              >
                <span>Semua jadwal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#EDF2EF]">
              {upcomingSchedules.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate('jadwal')}
                  className="w-full py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-4 text-left hover:bg-[#F8FBFA] rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#162420] truncate">{item.title}</p>
                    <p className="text-xs text-[#526660] mt-1">
                      <span>{item.dateLabel}</span>
                      <span aria-hidden="true"> · </span>
                      <span className="font-mono-num">
                        {item.startTime}–{item.endTime}
                      </span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.location}</span>
                    </p>
                  </div>
                  <span className="text-xs font-medium text-[#0F5C4D] whitespace-nowrap shrink-0">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Attendance + Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Attendance Widget */}
          <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
                Presensi Hari Ini
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('absensi')}
                className="text-xs font-semibold text-[#0F5C4D] hover:underline whitespace-nowrap shrink-0"
              >
                Buka detail
              </button>
            </div>

            {!todayRecord ? (
              <div className="space-y-4">
                <p className="text-sm text-[#526660] leading-relaxed">
                  Catat kehadiran harian Anda sesuai mode kerja hari ini. Waktu tercatat otomatis saat tombol ditekan.
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['WFO', 'WFH', 'Lapangan'] as AttendanceMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => onQuickCheckIn(mode)}
                      className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all whitespace-nowrap"
                    >
                      Hadir {mode}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 py-3 px-4 rounded-2xl bg-[#F4F8F6]">
                  <div>
                    <p className="text-xs text-[#526660]">Jam Masuk</p>
                    <p className="font-mono-num text-lg font-bold text-[#0F5C4D] mt-0.5">
                      {todayRecord.checkIn}
                    </p>
                    <p className="text-xs text-[#526660] mt-0.5">
                      {todayRecord.mode} · {todayRecord.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#526660]">Jam Pulang</p>
                    <p className="font-mono-num text-lg font-bold text-[#162420] mt-0.5">
                      {todayRecord.checkOut ?? '— : —'}
                    </p>
                    <p className="text-xs text-[#526660] mt-0.5">
                      {todayRecord.checkOut ? 'Selesai bertugas' : 'Sedang bertugas'}
                    </p>
                  </div>
                </div>

                {!todayRecord.checkOut ? (
                  <button
                    type="button"
                    onClick={onQuickCheckOut}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold transition-colors"
                  >
                    Catat Absen Pulang Sekarang
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('absensi')}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#EEF4F1] hover:bg-[#E1ECE7] text-[#0F5C4D] text-sm font-semibold transition-colors"
                  >
                    Lihat Rekap Kehadiran
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Recent Activity Feed */}
          <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
                Aktivitas Terbaru
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('histori')}
                className="min-h-[40px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F5C4D] hover:text-[#0A463A] whitespace-nowrap shrink-0"
              >
                <span>Semua histori</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-[#EDF2EF]">
              {recentHistory.map((log) => (
                <div key={log.id} className="py-3 first:pt-1 last:pb-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium text-[#162420]">{log.title}</p>
                    <span className="text-xs text-[#526660] shrink-0">{log.category}</span>
                  </div>
                  <p className="text-xs text-[#526660] mt-1">{log.detail}</p>
                  <p className="font-mono-num text-[11px] text-[#7A8D86] mt-1">{log.timestamp}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
