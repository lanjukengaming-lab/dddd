import { ArrowLeft, Download, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { PayrollSlip } from '../../types/vaquita';
import { formatRupiah } from '../../utils/formatters';

interface GajiViewProps {
  payrolls: PayrollSlip[];
  memberName: string;
  memberId: string;
  onBack: () => void;
}

export function GajiView({ payrolls, memberName, memberId, onBack }: GajiViewProps) {
  const [selectedId, setSelectedId] = useState(payrolls[0]?.id ?? '');
  const [hideAmounts, setHideAmounts] = useState(false);

  const activeSlip = payrolls.find((p) => p.id === selectedId) ?? payrolls[0];
  if (!activeSlip) return null;

  const incomes = activeSlip.items.filter((i) => i.type === 'income');
  const deductions = activeSlip.items.filter((i) => i.type === 'deduction');
  const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
  const totalDeduction = deductions.reduce((acc, i) => acc + i.amount, 0);
  const netPay = totalIncome - totalDeduction;

  const displayMoney = (val: number) => (hideAmounts ? 'Rp •••••••' : formatRupiah(val));

  const handleDownloadSlip = () => {
    const lines = [
      `SLIP HONORARIUM WARGA VAQUITA`,
      `Nama: ${memberName} (${memberId})`,
      `Periode: ${activeSlip.period}`,
      `Tanggal Pembayaran: ${activeSlip.payDate}`,
      `Status: ${activeSlip.status}`,
      ``,
      `PENDAPATAN:`,
      ...incomes.map((i) => `+ ${i.label}: ${formatRupiah(i.amount)}`),
      `Total Pendapatan: ${formatRupiah(totalIncome)}`,
      ``,
      `POTONGAN:`,
      ...deductions.map((d) => `- ${d.label}: ${formatRupiah(d.amount)}`),
      `Total Potongan: ${formatRupiah(totalDeduction)}`,
      ``,
      `TOTAL DITERIMA BERSIH: ${formatRupiah(netPay)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slip-gaji-${activeSlip.id}.txt`;
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
              Gaji & Honorarium
            </h1>
            <p className="text-xs sm:text-sm text-[#526660]">
              Rincian penerimaan bulanan, tunjangan mengajar, dan potongan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setHideAmounts((v) => !v)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#E4ECE8] hover:bg-[#F3FAF7] text-xs sm:text-sm font-medium text-[#162420] inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {hideAmounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{hideAmounts ? 'Tampilkan Nominal' : 'Sembunyikan'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadSlip}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0F5C4D] hover:bg-[#0A463A] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Slip</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-1 p-1 bg-[#EBF1EE] rounded-xl w-fit max-w-full overflow-x-auto">
        {payrolls.map((slip) => (
          <button
            key={slip.id}
            type="button"
            onClick={() => setSelectedId(slip.id)}
            className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              slip.id === activeSlip.id
                ? 'bg-white text-[#0F5C4D] font-semibold shadow-xs'
                : 'text-[#526660] hover:text-[#162420]'
            }`}
          >
            {slip.period}
          </button>
        ))}
      </div>

      {/* Net Summary */}
      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#EDF2EF]">
          <div>
            <p className="text-xs text-[#526660]">
              Periode {activeSlip.period} · Jadwal Cair {activeSlip.payDate} ·{' '}
              <span
                className={`font-semibold ${
                  activeSlip.status === 'Dibayarkan' ? 'text-[#0F5C4D]' : 'text-[#B45309]'
                }`}
              >
                {activeSlip.status}
              </span>
            </p>
            <p className="text-xs text-[#6B7F78] mt-1">Total Diterima Bersih</p>
            <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#0F5C4D] mt-0.5">
              {displayMoney(netPay)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-[#526660]">Total Pendapatan</p>
              <p className="font-mono-num text-base sm:text-lg font-semibold text-[#162420] mt-0.5">
                {displayMoney(totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#526660]">Total Potongan</p>
              <p className="font-mono-num text-base sm:text-lg font-semibold text-[#B45309] mt-0.5">
                {displayMoney(totalDeduction)}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="font-display text-sm font-bold text-[#162420]">Rincian Pendapatan</h2>
            <div className="divide-y divide-[#EDF2EF]">
              {incomes.map((item) => (
                <div
                  key={item.label}
                  className="py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-[#526660]">{item.label}</span>
                  <span className="font-mono-num font-semibold text-[#162420] shrink-0">
                    {displayMoney(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm font-bold text-[#162420]">Rincian Potongan</h2>
            <div className="divide-y divide-[#EDF2EF]">
              {deductions.map((item) => (
                <div
                  key={item.label}
                  className="py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-[#526660]">{item.label}</span>
                  <span className="font-mono-num font-semibold text-[#B45309] shrink-0">
                    -{displayMoney(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
