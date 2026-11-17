export type ModuleId =
  | 'home'
  | 'jadwal'
  | 'absensi'
  | 'progress'
  | 'rapor'
  | 'prestasi'
  | 'reschedule'
  | 'gaji'
  | 'cuti'
  | 'histori';

export type ScheduleCategory = 'Kelas' | 'Mentoring' | 'Rapat';

export interface ScheduleItem {
  id: string;
  title: string;
  category: ScheduleCategory;
  dayIndex: number; // 0 = Senin ... 6 = Minggu
  dateLabel: string;
  startTime: string;
  endTime: string;
  location: string;
  participantCount: number;
  notes?: string;
}

export type AttendanceMode = 'WFO' | 'WFH' | 'Lapangan';
export type AttendanceStatus = 'Hadir' | 'Terlambat' | 'Izin';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dateLabel: string;
  checkIn: string;
  checkOut: string | null;
  mode: AttendanceMode;
  status: AttendanceStatus;
  note?: string;
}

export interface ProgressMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProgressProgram {
  id: string;
  name: string;
  cohort: string;
  targetDate: string;
  milestones: ProgressMilestone[];
}

export interface RaporMetric {
  id: string;
  aspect: string;
  score: number;
  maxScore: number;
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup';
  comment: string;
}

export interface RaporPeriod {
  id: string;
  periodName: string;
  publishedDate: string;
  evaluator: string;
  overallNote: string;
  metrics: RaporMetric[];
}

export type PrestasiCategory = 'Pengajaran' | 'Komunitas' | 'Inovasi';

export interface PrestasiItem {
  id: string;
  title: string;
  category: PrestasiCategory;
  dateLabel: string;
  points: number;
  description: string;
}

export type RequestStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';

export interface RescheduleRequest {
  id: string;
  scheduleId: string;
  sessionTitle: string;
  originalSlot: string;
  proposedDate: string;
  proposedTime: string;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
}

export interface PayrollItem {
  label: string;
  amount: number;
  type: 'income' | 'deduction';
}

export interface PayrollSlip {
  id: string;
  period: string;
  payDate: string;
  status: 'Dibayarkan' | 'Diproses';
  items: PayrollItem[];
}

export type LeaveType = 'Cuti Tahunan' | 'Cuti Sakit' | 'Izin Khusus';

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
}

export type HistoryCategory = 'Absensi' | 'Jadwal' | 'Progress' | 'Gaji' | 'Cuti' | 'Prestasi';

export interface HistoryLog {
  id: string;
  category: HistoryCategory;
  title: string;
  detail: string;
  timestamp: string;
}

export interface WargaProfile {
  name: string;
  role: string;
  memberId: string;
  unit: string;
  annualLeaveQuota: number;
}

export interface VaquitaState {
  profile: WargaProfile;
  schedules: ScheduleItem[];
  attendance: AttendanceRecord[];
  programs: ProgressProgram[];
  rapors: RaporPeriod[];
  prestasi: PrestasiItem[];
  reschedules: RescheduleRequest[];
  payrolls: PayrollSlip[];
  leaves: LeaveRequest[];
  history: HistoryLog[];
}
