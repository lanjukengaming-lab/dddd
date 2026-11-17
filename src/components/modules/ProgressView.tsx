import { ArrowLeft, CheckSquare, Square } from 'lucide-react';
import { ProgressProgram } from '../../types/vaquita';

interface ProgressViewProps {
  programs: ProgressProgram[];
  onBack: () => void;
  onToggleMilestone: (programId: string, milestoneId: string) => void;
}

export function ProgressView({ programs, onBack, onToggleMilestone }: ProgressViewProps) {
  const totalMilestones = programs.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = programs.reduce(
    (acc, p) => acc + p.milestones.filter((m) => m.completed).length,
    0,
  );
  const overallPct =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

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
            Progress Program
          </h1>
          <p className="text-xs sm:text-sm text-[#526660]">
            Pantau dan perbarui capaian milestone kurikulum serta tata kelola sistem
          </p>
        </div>
      </div>

      {/* Overall Summary */}
      <section className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#526660]">Capaian Gabungan Seluruh Program</p>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#0F5C4D] font-mono-num mt-1">
              {overallPct}% selesai
            </p>
          </div>
          <p className="text-sm text-[#526660] font-mono-num">
            {completedMilestones} dari {totalMilestones} milestone tuntas
          </p>
        </div>
        <div className="w-full h-2.5 bg-[#E9F0EC] rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-[#0F5C4D] rounded-full transition-all duration-200"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </section>

      {/* Program Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program) => {
          const done = program.milestones.filter((m) => m.completed).length;
          const pct = Math.round((done / program.milestones.length) * 100);

          return (
            <section
              key={program.id}
              className="bg-white rounded-3xl border border-[#E4ECE8] p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-[#526660]">
                    {program.cohort} · Target {program.targetDate}
                  </p>
                  <h2 className="font-display text-lg font-bold text-[#162420] mt-1">
                    {program.name}
                  </h2>
                </div>
                <span className="font-mono-num text-base font-bold text-[#0F5C4D] shrink-0">
                  {pct}%
                </span>
              </div>

              <div className="w-full h-2 bg-[#E9F0EC] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F5C4D] rounded-full transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="divide-y divide-[#EDF2EF]">
                {program.milestones.map((ms) => (
                  <button
                    key={ms.id}
                    type="button"
                    onClick={() => onToggleMilestone(program.id, ms.id)}
                    className="w-full min-h-[48px] py-3 flex items-center gap-3 text-left hover:bg-[#F7FAF8] px-2 -mx-2 rounded-xl transition-colors"
                  >
                    {ms.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#0F5C4D] shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-[#8A9D96] shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        ms.completed ? 'text-[#6B7F78] line-through' : 'text-[#162420] font-medium'
                      }`}
                    >
                      {ms.title}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
