import { ArrowLeft, Download } from 'lucide-react';
import { useState } from 'react';
import { RaporPeriod } from '../../types/vaquita';

interface RaporViewProps {
  rapors: RaporPeriod[];
  memberName: string;
  memberId: string;
  onBack: () => void;
}

export function RaporView({ rapors, memberName, memberId, onBack }: RaporViewProps) {
  const [selectedId, setSelectedId] = useState(rapors[0]?.id ?? '');
  const activeRapor = rapors.find((r) => r.id === selectedId) ?? rapors[0];

  if (!activeRapor) {
    return null;
  }

  const avgScore = Math.round(
    activeRapor.metrics.reduce((acc, m) => acc + m.score, 0) / activeRapor.metrics.length,
  );

  const handleDownloadSummary = () => {
    const lines = [
      `RAPOR EVALUASI WARGA VAQUITA`,
      `Nama: ${memberName} (${memberId})`,
      `Periode: ${activeRapor.periodName}`,
      `Evaluator: ${activeRapor.evaluator}`,
      `Tanggal Terbit: ${activeRapor.publishedDate}`,
      `Rata-rata Capaian: ${avgScore}/100`,
      ``,
      `RINCIAN ASPEK:`,
      ...activeRapor.metrics.map(
        (m) => `- ${m.aspect}: ${m.score}/${m.maxScore} (${m.predicate}) — ${m.comment}`,
      ),
      ``,
      `Catatan Pembina: ${activeRapor.overallNote}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapor-vaquita-${activeRapor.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
              Rapor Evaluasi
            </h1>
            <p className="text-xs sm:text-sm text-[#526660]">
              Ringkasan capaian berkala dan catatan pembina Vaquita
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadSummary}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Ringkasan</span>
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl w-fit max-w-full overflow-x-auto">
        {rapors.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              r.id === activeRapor.id
                ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                : 'text-[#526660] hover:text-[#162420]'
            }`}
          >
            {r.periodName}
          </button>
        ))}
      </div>

      {/* Summary & Evaluator Note */}
      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#EDF2EF]">
          <div>
            <p className="text-xs text-[#526660]">
              Diterbitkan {activeRapor.publishedDate} · {activeRapor.evaluator}
            </p>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#162420] mt-1">
              {activeRapor.periodName}
            </h2>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-[#526660]">Indeks Rata-rata</p>
            <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#0F5C4D]">
              {avgScore}
              <span className="text-sm font-normal text-[#6B7F78]"> / 100</span>
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#EDF2EF]">
          {activeRapor.metrics.map((metric) => (
            <div key={metric.id} className="py-4 first:pt-1 last:pb-1 space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-sm sm:text-base font-semibold text-[#162420]">
                  {metric.aspect}
                </p>
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-xs font-medium text-[#0F5C4D]">{metric.predicate}</span>
                  <span className="font-mono-num text-base font-bold text-[#162420]">
                    {metric.score}
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-[#E9F0EC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F5C4D] rounded-full"
                  style={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
                />
              </div>
              <p className="text-xs sm:text-sm text-[#526660]">{metric.comment}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#EDF2EF]">
          <p className="text-xs font-semibold text-[#526660]">Catatan Pembina</p>
          <p className="text-sm text-[#162420] leading-relaxed mt-1">{activeRapor.overallNote}</p>
        </div>
      </section>
    </div>
  );
}
