import { useState, useEffect } from 'react';
import { CurriculumPhase } from '../types';
import { ExternalLink, Code, CheckSquare, Sparkles, AlertCircle, Bookmark, Layers, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VisualDiagram from './VisualDiagram';
import AudioOverview from './AudioOverview';

interface PhaseExplorerProps {
  phase: CurriculumPhase;
  completedCriteria: Record<string, boolean>;
  toggleCriterion: (key: string) => void;
}

export default function PhaseExplorer({
  phase,
  completedCriteria,
  toggleCriterion,
}: PhaseExplorerProps) {
  // Navigation tabs for the phase view
  const [activeTab, setActiveTab] = useState<'specs' | 'visuals' | 'docs' | 'audio'>('specs');

  // Sync tab back to specs when phase switches to avoid empty tab loads
  useEffect(() => {
    setActiveTab('specs');
  }, [phase.id]);

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-sm">
              Milestone {phase.id}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white mt-1.5">
              {phase.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 space-x-1 p-1 bg-stone-100 dark:bg-stone-900 rounded-lg max-w-xl">
        {(['specs', 'visuals', 'audio', 'docs'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const label = {
            specs: 'Specifications',
            visuals: 'Active Flow',
            audio: 'Audio Overview',
            docs: 'Official Docs & Resources',
          }[tab];

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-stone-950 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Interactive Tabs Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${phase.id}-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* TAB 1: Specs, Code & Exit Criteria checklist */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Specs & Narrative Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Milestone Project */}
                <div className="bg-stone-55 border border-stone-200 dark:bg-stone-950/20 dark:border-stone-850 p-5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Bookmark id="specs-target-icon" className="w-4 h-4 text-sky-500" />
                    <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
                      Module Project Milestone
                    </span>
                  </div>
                  <p className="text-sm font-medium text-stone-800 dark:text-stone-300 leading-relaxed">
                    {phase.project}
                  </p>
                </div>

                {/* Narrative Details */}
                <div className="space-y-6">
                  {phase.details.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-md font-bold text-stone-900 dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2">
                        {section.title}
                      </h3>
                      {section.text.startsWith('```') ? (
                        <div className="overflow-x-auto rounded-lg bg-stone-900 border border-stone-800 text-stone-100 p-4 font-mono text-xs leading-relaxed">
                          <pre className="whitespace-pre">
                            <code>{section.text.replace(/```python|```sql|```/g, '').trim()}</code>
                          </pre>
                        </div>
                      ) : (
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                          {section.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Checklist column & Tooling properties */}
              <div className="space-y-6">
                {/* Active Tooling specification card */}
                <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-xl space-y-3.5">
                  <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                    Required Lab Environment
                  </h3>
                  <div className="flex items-start gap-3">
                    <Code className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-200">
                        Workstation Toolchain
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 italic font-medium">
                        {phase.tooling}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exit Criteria Checkbox List */}
                <div className="bg-stone-900 border border-stone-800 text-stone-100 p-6 rounded-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare id="checklist-heading-icon" className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                      Phase Exit Criteria
                    </h3>
                  </div>

                  <p className="text-xs text-stone-400 font-medium leading-relaxed">
                    Review and execute the target exercises inside your terminal. Check them off as you establish compliance:
                  </p>

                  <div className="space-y-3.5 pt-2">
                    {phase.exitCriteria.map((criterion, idx) => {
                      const key = `${phase.id}-${criterion}`;
                      const isComplete = !!completedCriteria[key];

                      return (
                        <button
                          key={idx}
                          onClick={() => toggleCriterion(key)}
                          className={`w-full text-left p-3.5 rounded-lg border flex gap-3 cursor-pointer text-xs font-medium transition-all ${
                            isComplete
                              ? 'border-emerald-500 bg-emerald-950/15 text-emerald-300'
                              : 'border-stone-800 bg-stone-950/40 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${
                              isComplete ? 'bg-emerald-500 text-stone-950' : 'border border-stone-600'
                            }`}
                          >
                            {isComplete && <svg className="w-3 h-3 fill-current font-bold" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>}
                          </div>
                          <span className="leading-tight">{criterion}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Interactive visualizations */}
          {activeTab === 'visuals' && (
            <div className="space-y-6">
              <VisualDiagram architecture={phase.architecture} />
              <div className="p-4 bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 text-xs rounded-lg flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">
                  This state pathway outlines the abstraction layers built in this phase. Notice how data moves between storage, processing buffers, and client-server boundaries before persisting securely.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Simulated Audio overview & transcript reader */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <AudioOverview segments={phase.audioSpeech} phaseId={phase.id} />
            </div>
          )}

          {/* TAB 4: Core documentation links & specs */}
          {activeTab === 'docs' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Layers id="docs-tab-icon" className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  Official Technical Documentation Links
                </h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-2xl">
                Always review the core specifications directly from creators to cultivate complete engineering logic. These references cover the precise APIs and libraries implemented inside this module:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {phase.docLinks.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer referrer"
                    className="p-5 border border-stone-250 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/50 hover:bg-stone-50 hover:border-sky-400 dark:hover:border-sky-600 rounded-xl block transition-all group duration-150 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-sky-600 dark:text-sky-400 uppercase bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded-sm">
                        {doc.category}
                      </span>
                      <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-sky-600 dark:group-hover:text-sky-450 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-450 transition-colors mb-1.5 leading-snug">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-semibold">
                      {doc.summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
