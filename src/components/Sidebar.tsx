import { useState } from 'react';
import { CurriculumPhase } from '../types';
import { BookOpen, CheckSquare, Search, Award } from 'lucide-react';

interface SidebarProps {
  phases: CurriculumPhase[];
  selectedPhaseId: number | 'overview';
  onSelectPhase: (id: number | 'overview') => void;
  completedCriteria: Record<string, boolean>;
}

export default function Sidebar({
  phases,
  selectedPhaseId,
  onSelectPhase,
  completedCriteria,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate completion percentage for each phase
  const getPhaseProgress = (phase: CurriculumPhase) => {
    const total = phase.exitCriteria.length;
    if (total === 0) return 0;
    const completed = phase.exitCriteria.filter(
      (criterion) => completedCriteria[`${phase.id}-${criterion}`]
    ).length;
    return Math.round((completed / total) * 100);
  };

  // Filter phases based on search term
  const filteredPhases = phases.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(searchLower) ||
      p.goals.some((g) => g.toLowerCase().includes(searchLower)) ||
      p.tooling.toLowerCase().includes(searchLower) ||
      p.project.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-80 bg-stone-100 dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-lg">
            <Award id="sidebar-icon-award" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-md font-bold text-stone-900 dark:text-white leading-tight tracking-tight">
              Systems Architecture
            </h1>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium tracking-wider uppercase">
              First Principles Course
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
        <div className="relative">
          <Search id="sidebar-icon-search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search phases, tools, goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => onSelectPhase('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm transition-all duration-150 ${
            selectedPhaseId === 'overview'
              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-semibold shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <BookOpen id="sidebar-icon-book" className="w-4 h-4 shrink-0 transition-transform duration-150" />
          <div className="flex-1">
            <p className="font-semibold">Curriculum Overview</p>
            <p className="text-xs text-stone-500 dark:text-stone-500 font-normal">Introduction & Hardware</p>
          </div>
        </button>

        <div className="my-4 border-t border-stone-200 dark:border-stone-800" />

        <div className="px-3 pb-2">
          <span className="text-xs font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase">
            Curriculum Milestones
          </span>
        </div>

        {filteredPhases.map((phase) => {
          const progress = getPhaseProgress(phase);
          const isSelected = selectedPhaseId === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              className={`w-full flex flex-col gap-1.5 px-4 py-3.5 rounded-lg text-left text-sm transition-all duration-150 relative ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded-sm">
                  {phase.id}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-500 font-bold">
                  {progress === 100 && <CheckSquare id={`phase-check-${phase.id}`} className="w-3.5 h-3.5" />}
                  {progress}%
                </span>
              </div>
              <div>
                <p className="text-stone-900 dark:text-stone-100 font-bold leading-tight">
                  {phase.title.replace(`Phase ${phase.id}: `, '')}
                </p>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>
          );
        })}

        {filteredPhases.length === 0 && (
          <div className="p-8 text-center text-stone-400 dark:text-stone-500">
            <p className="text-sm">No curriculum modules match your search query.</p>
          </div>
        )}
      </div>

      {/* Persistence State Reset / Total Stats */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-xs text-stone-500 dark:text-stone-400 flex justify-between items-center">
        <span>AeroParts Sysops Dashboard</span>
        <span>Est. Local 2026</span>
      </div>
    </div>
  );
}
