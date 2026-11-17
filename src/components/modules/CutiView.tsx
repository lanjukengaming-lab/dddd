import { ArrowLeft, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { LeaveRequest, LeaveType } from '../../types/vaquita';

interface CutiViewProps {
  leaves: LeaveRequest[];
  annualQuota: number;
  onBack: () => void;
  onSubmitLeave: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => void;
  onCancelLeave: (id: string) => void;
}

export function CutiView({
  leaves,
  annualQuota,
  onBack,
  onSubmitLeave,
  onCancelLeave,
}: CutiViewProps) {
  const [type, setType] = useState<LeaveType>('Cuti Tahunan');
  const [startDate, setStartDate] = useState('2026-11-26');
  const [endDate, setEndDate] = useState('2026-11-27');
  const [reason, setReason] = useState('');

  const usedAnnual = leaves
    .filter((l) => l.type === 'Cuti Tahunan' && l.status !== 'Ditolak')
    .reduce((acc, l) => acc + l.days, 0);
  const remainingAnnual = Math.max(0, annualQuota - usedAnnual);

  const calcDays = () => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmitLeave({
      type,
      startDate,
      endDate: endDate < startDate ? startDate : endDate,
      days: calcDays(),
      reason: reason.trim(),
    });
    setReason('');
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
            Pengajuan Cuti & Izin
          </h1>
          <p className="text-xs sm:text-sm text-[#526660]">
            Kelola kuota cuti tahunan dan riwayat permohonan izin warga
          </p>
        </div>
      </div>

      {/* Quota Strip */}
      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[#526660]">Kuota Tahunan</p>
          <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#162420] mt-1">
            {annualQuota} hari
          </p>
        </div>
        <div>
          <p className="text-xs text-[#526660]">Terpakai / Diajukan</p>
          <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#B45309] mt-1">
            {usedAnnual} hari
          </p>
        </div>
        <div>
          <p className="text-xs text-[#526660]">Sisa Kuota</p>
          <p className="font-mono-num text-xl sm:text-2xl font-bold text-[#0F5C4D] mt-1">
            {remainingAnnual} hari
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-4"
        >
          <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
            Form Pengajuan Cuti
          </h2>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[#526660]">Jenis Cuti / Izin</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as LeaveType)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] bg-white text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
            >
              <option value="Cuti Tahunan">Cuti Tahunan</option>
              <option value="Cuti Sakit">Cuti Sakit</option>
              <option value="Izin Khusus">Izin Khusus</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Tanggal Mulai</span>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Tanggal Selesai</span>
              <input
                type="date"
                required
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
          </div>

          <p className="text-xs text-[#526660]">
            Durasi pengajuan: <span className="font-mono-num font-bold">{calcDays()} hari</span>
          </p>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[#526660]">Keterangan / Alasan</span>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tuliskan keterangan dan PIC pengganti bila ada..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
            />
          </label>

          <button
            type="submit"
            className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold transition-colors"
          >
            Kirim Pengajuan Cuti
          </button>
        </form>

        <section className="lg:col-span-7 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-4">
          <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
            Riwayat Permohonan ({leaves.length})
          </h2>

          {leaves.length === 0 ? (
            <p className="text-sm text-[#526660] py-6">Belum ada permohonan cuti.</p>
          ) : (
            <div className="divide-y divide-[#EDF2EF]">
              {leaves.map((lv) => (
                <div key={lv.id} className="py-4 first:pt-1 last:pb-1 space-y-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#526660]">
                        Diajukan {lv.submittedAt} ·{' '}
                        <span
                          className={`font-semibold ${
                            lv.status === 'Disetujui'
                              ? 'text-[#0F5C4D]'
                              : lv.status === 'Ditolak'
                                ? 'text-[#B91C1C]'
                                : 'text-[#B45309]'
                          }`}
                        >
                          {lv.status}
                        </span>
                      </p>
                      <h3 className="font-display text-base font-bold text-[#162420] mt-1">
                        {lv.type} · <span className="font-mono-num">{lv.days} hari</span>
                      </h3>
                    </div>

                    {lv.status === 'Menunggu' && (
                      <button
                        type="button"
                        onClick={() => onCancelLeave(lv.id)}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E4ECE8] hover:bg-[#FEF2F2] hover:border-[#FECACA] text-xs font-medium text-[#526660] hover:text-[#B91C1C] inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Batalkan</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-mono-num text-[#526660]">
                    {lv.startDate} s.d. {lv.endDate}
                  </p>
                  <p className="text-xs text-[#6B7F78]">{lv.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
