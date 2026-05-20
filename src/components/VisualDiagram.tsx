import { useState } from 'react';
import { VisualArchitecture, Node } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Database, Cpu, Terminal, ShieldAlert, ArrowRight } from 'lucide-react';

interface VisualDiagramProps {
  architecture: VisualArchitecture;
}

export default function VisualDiagram({ architecture }: VisualDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Map node category to icon
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'storage':
        return <Database className="w-5 h-5" />;
      case 'process':
        return <Cpu className="w-5 h-5" />;
      case 'network':
        return <Network className="w-5 h-5" />;
      case 'user':
        return <Terminal className="w-5 h-5" />;
      default:
        return <Terminal className="w-5 h-5" />;
    }
  };

  // Map category to styles
  const getNodeStyles = (type: string, isSelected: boolean) => {
    let base = 'duration-150 transition-all border p-5 rounded-xl shadow-xs cursor-pointer select-none flex flex-col justify-between ';
    if (isSelected) {
      base += 'ring-2 ring-sky-500 bg-sky-50/70 border-sky-400 dark:bg-sky-950/20 dark:border-sky-400 ';
    } else {
      switch (type) {
        case 'storage':
          base += 'bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100';
          break;
        case 'process':
          base += 'bg-blue-55/10 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900 text-stone-900 dark:text-stone-100';
          break;
        case 'network':
          base += 'bg-purple-55/10 border-purple-200 dark:bg-purple-950/10 dark:border-purple-900 hover:bg-purple-100 dark:hover:bg-purple-900 text-stone-900 dark:text-stone-100';
          break;
        case 'user':
          base += 'bg-emerald-55/10 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-stone-900 dark:text-stone-100';
          break;
        default:
          base += 'bg-stone-50 border-stone-250 dark:bg-stone-900 dark:border-stone-850 hover:bg-stone-100 text-stone-900 ';
      }
    }
    return base;
  };

  return (
    <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-6 rounded-xl space-y-6 shadow-xs">
      {/* Visual Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-md font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          Interactive Architecture Flow
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {architecture.description}
        </p>
      </div>

      <div className="bg-stone-50/50 dark:bg-stone-900/40 p-1 bg-stripes rounded-lg relative overflow-hidden">
        {/* Interactive Prompt Overlay */}
        <div className="px-4 py-2 bg-stone-100 dark:bg-stone-850 text-xs text-stone-600 dark:text-stone-400 font-semibold flex items-center gap-2 border-b border-stone-200/50 dark:border-stone-800/50">
          <ShieldAlert className="w-4 h-4 text-sky-500 animate-pulse" />
          <span>{architecture.interactionPrompt}</span>
        </div>

        {/* Modular responsive node layout container */}
        <div className="p-8 flex flex-col md:flex-row items-stretch justify-around gap-6 relative">
          {architecture.nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div key={node.id} className="flex-1 flex flex-col md:flex-row items-center gap-5">
                {/* Node Box */}
                <motion.div
                  whileHover={{ y: -3 }}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full ${getNodeStyles(node.type, isSelected)}`}
                  id={`arch-node-${node.id}`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500 text-white' : 'bg-stone-200/50 dark:bg-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      Layer {index + 1}: {node.type}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-snug tracking-tight mb-1 text-stone-900 dark:text-white">
                      {node.label}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                      {node.description}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow Connector (Between Nodes) */}
                {index < architecture.nodes.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center text-stone-300 dark:text-stone-700 select-none">
                    <ArrowRight className="w-5 h-5 transform rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Spec Panel */}
      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-5 border border-sky-200 bg-sky-50/30 dark:border-sky-900/60 dark:bg-sky-950/10 rounded-xl relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-sm">
                Active View
              </span>
              <h4 className="text-sm font-bold text-stone-950 dark:text-white">
                {selectedNode.label} Engineering Specs
              </h4>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Render any associated custom active transaction pathway descriptions */}
            {architecture.edges.filter(edge => edge.from === selectedNode.id || edge.to === selectedNode.id).map((edge, i) => (
              <div key={i} className="mt-3.5 pt-3.5 border-t border-sky-200/50 dark:border-sky-900/40 text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  Data Transition ({edge.label}):{' '}
                </span>
                <span className="text-stone-600 dark:text-stone-400">
                  {edge.action}
                </span>
              </div>
            ))}

            {/* Close detail button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-xs font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        ) : (
          <div className="p-5 border border-dashed border-stone-200 dark:border-stone-800 text-center text-xs text-stone-400 rounded-xl">
            Click on any structural pipeline node layer above to drill deep into its hardware parameters and binary execution boundaries.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
