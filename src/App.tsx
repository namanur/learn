import { useState, useEffect } from 'react';
import { overviewData, curriculumPhases } from './data/curriculumData';
import Sidebar from './components/Sidebar';
import PhaseExplorer from './components/PhaseExplorer';
import { BookOpen, HelpCircle, HardDrive, RefreshCw, Layers, CheckSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | 'overview'>('overview');
  const [completedCriteria, setCompletedCriteria] = useState<Record<string, boolean>>({});

  // Hydrate checked milestones from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aeroparts_curriculum_progress');
      if (saved) {
        setCompletedCriteria(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse progress from local storage', e);
    }
  }, []);

  // Save criteria changes to preserve state
  const toggleCriterion = (key: string) => {
    const fresh = { ...completedCriteria, [key]: !completedCriteria[key] };
    setCompletedCriteria(fresh);
    try {
      localStorage.setItem('aeroparts_curriculum_progress', JSON.stringify(fresh));
    } catch (e) {
      console.error('Failed to write progress to local storage', e);
    }
  };

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to clear all your module exit checkpoints?')) {
      setCompletedCriteria({});
      try {
        localStorage.removeItem('aeroparts_curriculum_progress');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Calculate global summary variables
  const totalCriteriaCount = curriculumPhases.reduce((acc, p) => acc + p.exitCriteria.length, 0);
  const completedCriteriaCount = Object.values(completedCriteria).filter(Boolean).length;
  const globalPercentage = totalCriteriaCount > 0 ? Math.round((completedCriteriaCount / totalCriteriaCount) * 100) : 0;

  const currentPhase = selectedPhaseId !== 'overview'
    ? curriculumPhases.find((p) => p.id === selectedPhaseId)
    : null;

  return (
    <div className="h-screen flex bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 overflow-hidden font-sans">
      {/* Navigation Sidebar */}
      <Sidebar
        phases={curriculumPhases}
        selectedPhaseId={selectedPhaseId}
        onSelectPhase={(id) => setSelectedPhaseId(id)}
        completedCriteria={completedCriteria}
      />

      {/* Main Focus Content Pane */}
      <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-stone-950 p-6 md:p-12 relative flex flex-col justify-between">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {selectedPhaseId === 'overview' ? (
              <motion.div
                key="overview-pane"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="max-w-5xl mx-auto space-y-10"
              >
                {/* Header Block */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-sm uppercase tracking-widest">
                      SYSTEM ARCHITECTURE CURRICULUM
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-tight">
                    {overviewData.title}
                  </h1>
                  <p className="text-md md:text-lg text-stone-600 dark:text-stone-400 font-medium leading-relaxed max-w-4xl">
                    {overviewData.description}
                  </p>
                </div>

                {/* Progress Stats Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 rounded-xl space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Course Progress</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-stone-900 dark:text-white">{globalPercentage}%</span>
                      <span className="text-xs text-stone-500">of checkpoints</span>
                    </div>
                    <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 transition-all duration-300" style={{ width: `${globalPercentage}%` }} />
                    </div>
                  </div>

                  <div className="p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 rounded-xl space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 font-medium">Completed Exercises</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-stone-900 dark:text-white">{completedCriteriaCount}</span>
                      <span className="text-xs text-stone-500">/ {totalCriteriaCount} checkpoints</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wide">
                      Interactive sandbox checklist
                    </span>
                  </div>

                  <div className="p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 rounded-xl space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Active Lab Container</span>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mt-1">
                        Workspace Connected
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </p>
                    </div>
                    <button
                      onClick={resetAllProgress}
                      className="text-left text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 underline cursor-pointer"
                    >
                      Clear module checkpoints progress
                    </button>
                  </div>
                </div>

                {/* Sub-Interactive Phase roadmap outline */}
                <div className="p-6 border border-stone-250 dark:border-stone-850 rounded-xl space-y-5 bg-white dark:bg-stone-950">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                      Curriculum Path & Complexity Scale
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl font-semibold">
                    The milestones below stack sequentially. Direct linear transitions build local file processing logic into full enterprise APIs. Click on any block to jump directly to that phase specs:
                  </p>

                  <div className="relative mt-4">
                    {/* SVG Connector Line */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-stone-100 dark:bg-stone-850 transform -translate-y-1/2 z-0 hidden md:block" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                      {curriculumPhases.map((phase) => {
                        const isDone = phase.exitCriteria.every(cri => completedCriteria[`${phase.id}-${cri}`]);
                        return (
                          <button
                            key={phase.id}
                            onClick={() => setSelectedPhaseId(phase.id)}
                            className={`p-4 border text-left rounded-xl transition-all hover:bg-stone-50 dark:hover:bg-stone-900 hover:-translate-y-1 duration-150 cursor-pointer ${
                              isDone
                                ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10'
                                : 'border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-mono text-xs font-bold text-stone-400 dark:text-stone-500">P{phase.id}</span>
                              <span className="w-2 h-2 rounded-full bg-sky-55" />
                            </div>
                            <h4 className="text-xs font-extrabold text-stone-900 dark:text-white line-clamp-1 leading-snug">
                              {phase.title.replace(`Phase ${phase.id}: `, '')}
                            </h4>
                            <p className="text-[10px] text-stone-400 dark:text-stone-450 mt-1 line-clamp-2">
                              {phase.project}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lab Infrastructure Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 prose max-w-none pt-2">
                  {overviewData.environment.map((env, idx) => (
                    <div key={idx} className="space-y-3 p-5 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50/20 dark:bg-stone-900/10">
                      <h3 className="text-sm font-extrabold text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-2 mt-0">
                        <HardDrive className="w-4 h-4 text-sky-500" />
                        {env.title}
                      </h3>
                      <ul className="space-y-2 pl-4 text-xs font-medium text-stone-600 dark:text-stone-400">
                        {env.items.map((item, id) => (
                          <li key={id} className="leading-relaxed list-disc">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Core Learning Mandate */}
                <div className="p-6 bg-amber-500/10 border border-amber-500/35 rounded-xl space-y-2">
                  <h3 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mt-0">
                    <Sparkles className="w-4 h-4" />
                    The First-Principles Teaching Discipline
                  </h3>
                  <p className="text-xs font-semibold leading-relaxed text-stone-700 dark:text-stone-300">
                    {overviewData.methodology}
                  </p>
                </div>
              </motion.div>
            ) : (
              currentPhase && (
                <PhaseExplorer
                  phase={currentPhase}
                  completedCriteria={completedCriteria}
                  toggleCriterion={toggleCriterion}
                />
              )
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
