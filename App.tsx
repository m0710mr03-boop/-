import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.TREE_SHAPE ? TreeState.SCATTERED : TreeState.TREE_SHAPE
    );
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene treeState={treeState} />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header */}
        <header className="flex flex-col items-start gap-2">
          <h1 className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] tracking-tighter">
            ARIX
          </h1>
          <p className="text-emerald-400/80 text-sm tracking-[0.3em] uppercase font-light border-b border-emerald-800/50 pb-2">
            Signature Interactive Collection
          </p>
        </header>

        {/* Footer / Controls */}
        <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
           <div className="text-white/40 text-xs font-mono max-w-xs text-center md:text-left">
             <p>EXPERIENCE MODE: <span className="text-yellow-400">{treeState}</span></p>
             <p className="mt-1">Drag to rotate • Scroll to zoom</p>
           </div>

           <button
             onClick={toggleState}
             className="group relative px-8 py-3 bg-emerald-950/40 backdrop-blur-md border border-emerald-500/30 overflow-hidden transition-all duration-500 hover:border-yellow-400/80 hover:bg-emerald-900/60"
           >
             <span className="relative z-10 font-serif text-yellow-100 group-hover:text-yellow-400 transition-colors tracking-widest text-sm">
               {treeState === TreeState.TREE_SHAPE ? 'DISSOLVE FORM' : 'ASSEMBLE TREE'}
             </span>
             
             {/* Button Glow Effect */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transform" style={{ transitionDuration: '1s' }} />
           </button>
        </footer>
      </div>
    </div>
  );
};

export default App;