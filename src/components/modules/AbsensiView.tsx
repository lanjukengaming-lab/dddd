import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { AttendanceMode, AttendanceRecord, AttendanceStatus } from '../../types/vaquita';
import { getTodayISO } from '../../utils/formatters';

interface AbsensiViewProps {
  records: AttendanceRecord[];
  onBack: () => void;
  onCheckIn: (mode: AttendanceMode, note?: string) => void;
  onCheckOut: () => void;
}

const FILTER_OPTIONS: ('Semua' | AttendanceStatus)[] = ['Semua', 'Hadir', 'Terlambat', 'Izin'];

export function AbsensiView({ records, onBack, onCheckIn, onCheckOut }: AbsensiViewProps) {
  const [mode, setMode] = useState<AttendanceMode>('WFO');
  const [note, setNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Semua' | AttendanceStatus>('Semua');

  const todayISO = getTodayISO();
  const todayRecord = records.find((r) => r.date === todayISO);

  const totalDays = records.length;
  const onTimeCount = records.filter((r) => r.status === 'Hadir').length;
  const lateCount = records.filter((r) => r.status === 'Terlambat').length;
  const attendancePct = totalDays > 0 ? Math.round(((onTimeCount + lateCount) / totalDays) * 100) : 100;

  const filtered = records.filter((r) =>
    filterStatus === 'Semua' ? true : r.status === filterStatus,
  );

  const handleCheckInSubmit = () => {
    onCheckIn(mode, note.trim() || undefined);
    setNote('');
  };

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
            Absensi Harian
          </h1>
          <p className="text-xs sm:text-sm text-[#526660]">
            Pencatatan jam masuk, jam pulang, dan rekap kehadiran bulanan
          </p>
        </div>
      </div>

      {/* Live Check-in / Check-out & Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <section className="lg:col-span-7 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 flex flex-col justify-between gap-5">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
              Status Presensi Hari Ini
            </h2>
            <p className="text-sm text-[#526660] mt-1">
              {todayRecord
                ? todayRecord.checkOut
                  ? 'Presensi masuk dan pulang hari ini sudah tercatat lengkap.'
                  : 'Anda sudah absen masuk. Jangan lupa catat absen pulang setelah selesai bertugas.'
                : 'Pilih mode kerja lalu tekan tombol Absen Masuk untuk mencatat waktu mulai bertugas.'}
            </p>
          </div>

          {!todayRecord ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#526660]">Mode Kerja</span>
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#EBF1EE] rounded-xl">
                  {(['WFO', 'WFH', 'Lapangan'] as AttendanceMode[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setMode(item)}
                      className={`min-h-[40px] rounded-lg text-sm font-semibold transition-colors ${
                        mode === item
                          ? 'bg-white text-[#0F5C4D] shadow-xs'
                          : 'text-[#526660] hover:text-[#162420]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#526660]">Catatan (opsional)</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Mengajar kelas pagi & tinjau modul"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
                />
              </label>

              <button
                type="button"
                onClick={handleCheckInSubmit}
                className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] active:scale-[0.99] text-white text-sm font-semibold transition-all"
              >
                Catat Absen Masuk ({mode})
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F4F8F6]">
                <div>
                  <p className="text-xs text-[#526660]">Masuk · {todayRecord.mode}</p>
                  <p className="font-mono-num text-2xl font-bold text-[#0F5C4D] mt-1">
                    {todayRecord.checkIn}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#526660]">Pulang</p>
                  <p className="font-mono-num text-2xl font-bold text-[#162420] mt-1">
                    {todayRecord.checkOut ?? '— : —'}
                  </p>
                </div>
              </div>

              {!todayRecord.checkOut && (
                <button
                  type="button"
                  onClick={onCheckOut}
                  className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] active:scale-[0.99] text-white text-sm font-semibold transition-all"
                >
                  Catat Absen Pulang Sekarang
                </button>
              )}
            </div>
          )}
        </section>

        {/* Monthly Stats */}
        <section className="lg:col-span-5 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 flex flex-col justify-between">
          <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
            Ringkasan Bulan Ini
          </h2>

          <div className="grid grid-cols-2 gap-5 my-4">
            <div>
              <p className="text-xs text-[#526660]">Total Hari Tercatat</p>
              <p className="font-mono-num text-2xl font-bold text-[#162420] mt-1">{totalDays}</p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Persentase Hadir</p>
              <p className="font-mono-num text-2xl font-bold text-[#0F5C4D] mt-1">
                {attendancePct}%
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Tepat Waktu</p>
              <p className="font-mono-num text-2xl font-bold text-[#162420] mt-1">{onTimeCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Terlambat</p>
              <p className="font-mono-num text-2xl font-bold text-[#B45309] mt-1">{lateCount}</p>
            </div>
          </div>

          <p className="text-xs text-[#6B7F78] pt-3 border-t border-[#EDF2EF]">
            Batas hadir tepat waktu pukul 09:00 WIB untuk seluruh warga aktif.
          </p>
        </section>
      </div>

      {/* Attendance Log */}
      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
            Riwayat Kehadiran
          </h2>
          <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl overflow-x-auto">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFilterStatus(opt)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  filterStatus === opt
                    ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                    : 'text-[#526660] hover:text-[#162420]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {filtered.map((rec) => {
            const isLate = rec.status === 'Terlambat';
            return (
              <div
                key={rec.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-semibold text-[#162420]">{rec.dateLabel}</p>
                  <p className="text-xs text-[#526660] mt-0.5">
                    <span>{rec.mode}</span>
                    {rec.note && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>{rec.note}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm">
                  <span className="font-mono-num text-[#162420]">
                    {rec.checkIn} – {rec.checkOut ?? 'Aktif'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold whitespace-nowrap ${
                      isLate ? 'text-[#B45309]' : 'text-[#0F5C4D]'
                    }`}
                  >
                    {isLate ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{rec.status}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
