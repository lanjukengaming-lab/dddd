import { ModuleId } from '../types/vaquita';

interface TopBarProps {
  activeModule: ModuleId;
  onNavigate: (module: ModuleId) => void;
  hasCheckedInToday: boolean;
  hasCheckedOutToday: boolean;
}

const DESKTOP_NAV_ITEMS: { id: ModuleId; label: string }[] = [
  { id: 'home', label: 'Beranda' },
  { id: 'jadwal', label: 'Jadwal' },
  { id: 'absensi', label: 'Absensi' },
  { id: 'progress', label: 'Progress' },
  { id: 'histori', label: 'Histori' },
];

export function TopBar({
  activeModule,
  onNavigate,
  hasCheckedInToday,
  hasCheckedOutToday,
}: TopBarProps) {
  const ctaLabel = !hasCheckedInToday
    ? 'Absen Masuk'
    : !hasCheckedOutToday
      ? 'Absen Pulang'
      : 'Rekap Absensi';

  return (
    <header className="bg-white border-b border-[#E4ECE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-lg font-bold tracking-tight text-[#0F5C4D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C4D] rounded-md px-1 -ml-1"
        >
          Vaquita
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {DESKTOP_NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1.5 transition-colors whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C4D] rounded-t ${
                  isActive
                    ? 'text-[#0F5C4D] border-[#0F5C4D] font-semibold'
                    : 'text-[#526660] border-transparent hover:text-[#162420] hover:border-[#C8D8D2]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('absensi')}
            className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#0F5C4D] hover:bg-[#0A463A] active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F5C4D]"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
