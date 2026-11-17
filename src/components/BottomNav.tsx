import { CalendarDays, ClipboardCheck, Home } from 'lucide-react';
import { ModuleId } from '../types/vaquita';

interface BottomNavProps {
  activeModule: ModuleId;
  onNavigate: (module: ModuleId) => void;
}

const BOTTOM_TABS: {
  id: ModuleId;
  label: string;
  icon: typeof Home;
}[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'jadwal', label: 'Jadwal', icon: CalendarDays },
  { id: 'absensi', label: 'Absensi', icon: ClipboardCheck },
];

export function BottomNav({ activeModule, onNavigate }: BottomNavProps) {
  // Highlight HOME whenever user is on home or one of the secondary Menu Lainnya views
  const resolvedActive: ModuleId =
    activeModule === 'jadwal' || activeModule === 'absensi' ? activeModule : 'home';

  return (
    <nav
      aria-label="Menu cepat bawah"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4ECE8] shadow-[0_-4px_20px_rgba(15,92,77,0.06)]"
    >
      <div className="grid grid-cols-3 items-center h-16 px-4">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = resolvedActive === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className="min-h-[48px] flex flex-col items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C4D] rounded-xl"
            >
              <span
                className={`flex flex-col items-center justify-center px-5 py-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-[#DDF0EA] text-[#0F5C4D]' : 'text-[#526660]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.9} />
              </span>
              <span
                className={`text-[10px] tracking-wider whitespace-nowrap ${
                  isActive ? 'font-bold text-[#0F5C4D]' : 'font-semibold text-[#526660]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
