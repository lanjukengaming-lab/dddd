import { ArrowLeft, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { RescheduleRequest, ScheduleItem } from '../../types/vaquita';

interface RescheduleViewProps {
  schedules: ScheduleItem[];
  requests: RescheduleRequest[];
  initialScheduleId?: string;
  onBack: () => void;
  onSubmitRequest: (req: Omit<RescheduleRequest, 'id' | 'status' | 'submittedAt'>) => void;
  onCancelRequest: (id: string) => void;
}

export function RescheduleView({
  schedules,
  requests,
  initialScheduleId,
  onBack,
  onSubmitRequest,
  onCancelRequest,
}: RescheduleViewProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState(
    initialScheduleId || schedules[0]?.id || '',
  );
  const [proposedDate, setProposedDate] = useState('2026-11-23');
  const [proposedTime, setProposedTime] = useState('10:00 – 12:00');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = schedules.find((s) => s.id === selectedScheduleId);
    if (!target || !reason.trim()) return;
    onSubmitRequest({
      scheduleId: target.id,
      sessionTitle: target.title,
      originalSlot: `${target.dateLabel} · ${target.startTime}–${target.endTime}`,
      proposedDate,
      proposedTime,
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
            Pengajuan Reschedule
          </h1>
          <p className="text-xs sm:text-sm text-[#526660]">
            Atur ulang waktu sesi kelas atau mentoring tanpa bentrok jadwal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-4"
        >
          <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
            Ajukan Perubahan Jadwal
          </h2>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[#526660]">Pilih Sesi Terjadwal</span>
            <select
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] bg-white text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
            >
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.dateLabel} · {s.startTime})
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Tanggal Pengganti</span>
              <input
                type="date"
                required
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-[#526660]">Jam Pengganti</span>
              <input
                type="text"
                required
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                placeholder="10:00 – 12:00"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-[#D8E3DE] text-sm font-mono-num text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-[#526660]">Alasan Penyesuaian</span>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tuliskan alasan perubahan agar koordinator dapat menyetujui..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8E3DE] text-sm text-[#162420] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]"
            />
          </label>

          <button
            type="submit"
            className="w-full min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold transition-colors"
          >
            Kirim Pengajuan Reschedule
          </button>
        </form>

        {/* Request List */}
        <section className="lg:col-span-7 bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-4">
          <h2 className="font-display text-base sm:text-lg font-bold text-[#162420]">
            Daftar Pengajuan ({requests.length})
          </h2>

          {requests.length === 0 ? (
            <p className="text-sm text-[#526660] py-6">
              Belum ada pengajuan reschedule saat ini.
            </p>
          ) : (
            <div className="divide-y divide-[#EDF2EF]">
              {requests.map((req) => (
                <div key={req.id} className="py-4 first:pt-1 last:pb-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#526660]">
                        Diajukan {req.submittedAt} ·{' '}
                        <span
                          className={`font-semibold ${
                            req.status === 'Disetujui'
                              ? 'text-[#0F5C4D]'
                              : req.status === 'Ditolak'
                                ? 'text-[#B91C1C]'
                                : 'text-[#B45309]'
                          }`}
                        >
                          {req.status}
                        </span>
                      </p>
                      <h3 className="font-display text-base font-bold text-[#162420] mt-1">
                        {req.sessionTitle}
                      </h3>
                    </div>

                    {req.status === 'Menunggu' && (
                      <button
                        type="button"
                        onClick={() => onCancelRequest(req.id)}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#E4ECE8] hover:bg-[#FEF2F2] hover:border-[#FECACA] text-xs font-medium text-[#526660] hover:text-[#B91C1C] inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Batalkan</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#526660]">
                    Semula: <span className="font-mono-num">{req.originalSlot}</span> → Diusulkan:{' '}
                    <span className="font-mono-num font-semibold text-[#162420]">
                      {req.proposedDate} · {req.proposedTime}
                    </span>
                  </p>
                  <p className="text-xs text-[#6B7F78]">{req.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
