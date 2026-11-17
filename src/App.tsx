import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { TopBar } from './components/TopBar';
import { AbsensiView } from './components/modules/AbsensiView';
import { CutiView } from './components/modules/CutiView';
import { GajiView } from './components/modules/GajiView';
import { HistoriView } from './components/modules/HistoriView';
import { JadwalView } from './components/modules/JadwalView';
import { PrestasiView } from './components/modules/PrestasiView';
import { ProgressView } from './components/modules/ProgressView';
import { RaporView } from './components/modules/RaporView';
import { RescheduleView } from './components/modules/RescheduleView';
import { INITIAL_VAQUITA_STATE } from './data/initialData';
import {
  AttendanceMode,
  HistoryCategory,
  LeaveRequest,
  ModuleId,
  PrestasiItem,
  RescheduleRequest,
  ScheduleItem,
  VaquitaState,
} from './types/vaquita';
import {
  formatIndonesianDate,
  formatShortTimestamp,
  getCurrentTimeHHMM,
  getTodayISO,
} from './utils/formatters';

const STORAGE_KEY = 'vaquita_portal_state_v1';

function loadInitialState(): VaquitaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_VAQUITA_STATE;
    const parsed = JSON.parse(raw) as VaquitaState;
    if (parsed && parsed.profile && Array.isArray(parsed.schedules)) {
      return parsed;
    }
    return INITIAL_VAQUITA_STATE;
  } catch {
    return INITIAL_VAQUITA_STATE;
  }
}

export default function App() {
  const [state, setState] = useState<VaquitaState>(loadInitialState);
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | undefined>(undefined);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const navigate = (module: ModuleId) => {
    setActiveModule(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prependHistory = (
    prev: VaquitaState,
    category: HistoryCategory,
    title: string,
    detail: string,
  ) => [
    {
      id: `hist-${Date.now()}`,
      category,
      title,
      detail,
      timestamp: formatShortTimestamp(),
    },
    ...prev.history,
  ];

  const todayISO = getTodayISO();
  const todayRecord = state.attendance.find((r) => r.date === todayISO);

  const handleCheckIn = (mode: AttendanceMode, note?: string) => {
    if (todayRecord) {
      setFeedback('Presensi masuk hari ini sudah tercatat.');
      return;
    }
    const nowTime = getCurrentTimeHHMM();
    const isLate = nowTime > '09:00';
    const newRecord = {
      id: `att-${Date.now()}`,
      date: todayISO,
      dateLabel: formatIndonesianDate(todayISO),
      checkIn: nowTime,
      checkOut: null,
      mode,
      status: isLate ? ('Terlambat' as const) : ('Hadir' as const),
      note,
    };
    setState((prev) => ({
      ...prev,
      attendance: [newRecord, ...prev.attendance],
      history: prependHistory(
        prev,
        'Absensi',
        `Absen masuk tercatat (${mode})`,
        `Pukul ${nowTime} · Status: ${newRecord.status}${note ? ` · ${note}` : ''}`,
      ),
    }));
    setFeedback(`Absen masuk ${mode} berhasil dicatat pukul ${nowTime}.`);
  };

  const handleCheckOut = () => {
    if (!todayRecord || todayRecord.checkOut) return;
    const nowTime = getCurrentTimeHHMM();
    setState((prev) => ({
      ...prev,
      attendance: prev.attendance.map((r) =>
        r.date === todayISO ? { ...r, checkOut: nowTime } : r,
      ),
      history: prependHistory(
        prev,
        'Absensi',
        `Absen pulang tercatat (${todayRecord.mode})`,
        `Masuk ${todayRecord.checkIn} · Pulang ${nowTime}`,
      ),
    }));
    setFeedback(`Absen pulang berhasil dicatat pukul ${nowTime}.`);
  };

  const handleAddSchedule = (item: Omit<ScheduleItem, 'id'>) => {
    const created: ScheduleItem = { ...item, id: `sch-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      schedules: [created, ...prev.schedules],
      history: prependHistory(
        prev,
        'Jadwal',
        `Jadwal baru ditambahkan: ${created.title}`,
        `${created.dateLabel} · ${created.startTime}–${created.endTime} · ${created.location}`,
      ),
    }));
    setFeedback(`Jadwal "${created.title}" berhasil disimpan.`);
  };

  const handleOpenRescheduleFor = (scheduleId: string) => {
    setRescheduleTargetId(scheduleId);
    navigate('reschedule');
  };

  const handleToggleMilestone = (programId: string, milestoneId: string) => {
    setState((prev) => {
      let toggledTitle = '';
      let nextCompleted = false;
      const nextPrograms = prev.programs.map((prog) => {
        if (prog.id !== programId) return prog;
        return {
          ...prog,
          milestones: prog.milestones.map((m) => {
            if (m.id !== milestoneId) return m;
            toggledTitle = m.title;
            nextCompleted = !m.completed;
            return { ...m, completed: nextCompleted };
          }),
        };
      });
      return {
        ...prev,
        programs: nextPrograms,
        history: toggledTitle
          ? prependHistory(
              prev,
              'Progress',
              nextCompleted ? 'Milestone ditandai selesai' : 'Milestone dibuka kembali',
              toggledTitle,
            )
          : prev.history,
      };
    });
  };

  const handleAddPrestasi = (item: Omit<PrestasiItem, 'id'>) => {
    const created: PrestasiItem = { ...item, id: `pres-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      prestasi: [created, ...prev.prestasi],
      history: prependHistory(
        prev,
        'Prestasi',
        `Prestasi dicatat: ${created.title}`,
        `Kategori ${created.category} · +${created.points} poin`,
      ),
    }));
    setFeedback(`Prestasi "${created.title}" berhasil ditambahkan.`);
  };

  const handleSubmitReschedule = (
    req: Omit<RescheduleRequest, 'id' | 'status' | 'submittedAt'>,
  ) => {
    const created: RescheduleRequest = {
      ...req,
      id: `res-${Date.now()}`,
      status: 'Menunggu',
      submittedAt: formatShortTimestamp(),
    };
    setState((prev) => ({
      ...prev,
      reschedules: [created, ...prev.reschedules],
      history: prependHistory(
        prev,
        'Jadwal',
        `Pengajuan reschedule: ${created.sessionTitle}`,
        `Usulan baru: ${created.proposedDate} · ${created.proposedTime} · Status: Menunggu`,
      ),
    }));
    setFeedback('Pengajuan reschedule berhasil dikirim.');
  };

  const handleCancelReschedule = (id: string) => {
    const target = state.reschedules.find((r) => r.id === id);
    setState((prev) => ({
      ...prev,
      reschedules: prev.reschedules.filter((r) => r.id !== id),
      history: target
        ? prependHistory(
            prev,
            'Jadwal',
            `Reschedule dibatalkan: ${target.sessionTitle}`,
            `Usulan ${target.proposedDate} · ${target.proposedTime} ditarik oleh pengaju`,
          )
        : prev.history,
    }));
    setFeedback('Pengajuan reschedule dibatalkan.');
  };

  const handleSubmitLeave = (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const created: LeaveRequest = {
      ...req,
      id: `lv-${Date.now()}`,
      status: 'Menunggu',
      submittedAt: formatShortTimestamp(),
    };
    setState((prev) => ({
      ...prev,
      leaves: [created, ...prev.leaves],
      history: prependHistory(
        prev,
        'Cuti',
        `Pengajuan ${created.type} (${created.days} hari)`,
        `${created.startDate} s.d. ${created.endDate} · Status: Menunggu`,
      ),
    }));
    setFeedback(`Pengajuan ${created.type} berhasil dikirim.`);
  };

  const handleCancelLeave = (id: string) => {
    const target = state.leaves.find((l) => l.id === id);
    setState((prev) => ({
      ...prev,
      leaves: prev.leaves.filter((l) => l.id !== id),
      history: target
        ? prependHistory(
            prev,
            'Cuti',
            `Permohonan ${target.type} dibatalkan`,
            `Tanggal ${target.startDate} s.d. ${target.endDate} dibatalkan`,
          )
        : prev.history,
    }));
    setFeedback('Permohonan cuti dibatalkan.');
  };

  const handleResetDemo = () => {
    setState(INITIAL_VAQUITA_STATE);
    localStorage.removeItem(STORAGE_KEY);
    setFeedback('Data portal dikembalikan ke kondisi awal.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F7] text-[#162420]">
      <TopBar
        activeModule={activeModule}
        onNavigate={navigate}
        hasCheckedInToday={Boolean(todayRecord)}
        hasCheckedOutToday={Boolean(todayRecord?.checkOut)}
      />

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4"
        >
          <div className="bg-[#0F5C4D] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl flex items-center justify-between gap-4">
            <span>{feedback}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-white/80 hover:text-white text-xs font-semibold shrink-0"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {activeModule === 'home' && (
          <HomeView
            state={state}
            onNavigate={navigate}
            onQuickCheckIn={(mode) => handleCheckIn(mode)}
            onQuickCheckOut={handleCheckOut}
          />
        )}

        {activeModule === 'jadwal' && (
          <JadwalView
            schedules={state.schedules}
            onBack={() => navigate('home')}
            onAddSchedule={handleAddSchedule}
            onRequestReschedule={handleOpenRescheduleFor}
          />
        )}

        {activeModule === 'absensi' && (
          <AbsensiView
            records={state.attendance}
            onBack={() => navigate('home')}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}

        {activeModule === 'progress' && (
          <ProgressView
            programs={state.programs}
            onBack={() => navigate('home')}
            onToggleMilestone={handleToggleMilestone}
          />
        )}

        {activeModule === 'rapor' && (
          <RaporView
            rapors={state.rapors}
            memberName={state.profile.name}
            memberId={state.profile.memberId}
            onBack={() => navigate('home')}
          />
        )}

        {activeModule === 'prestasi' && (
          <PrestasiView
            items={state.prestasi}
            onBack={() => navigate('home')}
            onAddPrestasi={handleAddPrestasi}
          />
        )}

        {activeModule === 'reschedule' && (
          <RescheduleView
            schedules={state.schedules}
            requests={state.reschedules}
            initialScheduleId={rescheduleTargetId}
            onBack={() => navigate('home')}
            onSubmitRequest={handleSubmitReschedule}
            onCancelRequest={handleCancelReschedule}
          />
        )}

        {activeModule === 'gaji' && (
          <GajiView
            payrolls={state.payrolls}
            memberName={state.profile.name}
            memberId={state.profile.memberId}
            onBack={() => navigate('home')}
          />
        )}

        {activeModule === 'cuti' && (
          <CutiView
            leaves={state.leaves}
            annualQuota={state.profile.annualLeaveQuota}
            onBack={() => navigate('home')}
            onSubmitLeave={handleSubmitLeave}
            onCancelLeave={handleCancelLeave}
          />
        )}

        {activeModule === 'histori' && (
          <HistoriView logs={state.history} onBack={() => navigate('home')} />
        )}
      </main>

      <footer className="hidden md:block border-t border-[#E4ECE8] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between text-xs text-[#6B7F78]">
          <span>Vaquita Portal · Layanan terpadu untuk seluruh warga Vaquita</span>
          <button
            type="button"
            onClick={handleResetDemo}
            className="hover:text-[#0F5C4D] font-medium transition-colors"
          >
            Atur ulang data awal
          </button>
        </div>
      </footer>

      <BottomNav activeModule={activeModule} onNavigate={navigate} />
    </div>
  );
}
