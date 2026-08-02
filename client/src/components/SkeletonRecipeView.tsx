import React, { useState, useEffect } from 'react';
import { Sparkles, ChefHat, Flame, Cpu } from 'lucide-react';

const LOADING_STEPS = [
  'Analyzing fridge inventory & ingredient flavor profiles...',
  'Pairing herbs, aromatic bases & pantry staples...',
  'Calculating precise cook timings & temperature curves...',
  'Structuring step-by-step editorial chef instructions...',
  'Synthesizing high-contrast culinary presentation...',
];

export const SkeletonRecipeView: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Cycle status messages
    const stepInterval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);

    // Smoothly increment fake progress up to 92%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8 lg:py-12 font-['Space_Grotesk',sans-serif] space-y-10">
      {/* Dynamic Culinary Synthesis Control Banner */}
      <div className="bg-[#121212] border-2 border-[#FF3E00]/50 p-6 shadow-2xl relative overflow-hidden animate-pulse-glow">
        <div className="animate-skeleton-wave pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF3E00] text-black flex items-center justify-center font-bold shrink-0 animate-bounce">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[#FF3E00] font-mono text-xs font-black uppercase tracking-[0.25em]">
                <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-ping" />
                <span>AI CULINARY ENGINE ACTIVE</span>
              </div>
              <h3 className="font-['Syne'] text-lg md:text-xl font-extrabold uppercase text-[#F5F5F5] tracking-tight mt-0.5">
                {LOADING_STEPS[currentStepIdx]}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right font-mono">
              <span className="text-2xl font-black text-[#FF3E00]">{progress}%</span>
              <span className="block text-[10px] text-white/50 uppercase tracking-widest font-bold">Progress</span>
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full h-1.5 bg-[#1a1a1a] mt-5 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF3E00] via-white to-[#FF3E00] transition-all duration-300 shadow-[0_0_12px_#FF3E00]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Recipe Skeleton Content */}
      <div className="space-y-10 opacity-90">
        {/* Header Section Skeleton */}
        <section className="border-b border-white/10 pb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              {/* Tag Badges Skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 bg-[#181818] border border-white/10 relative overflow-hidden">
                  <div className="animate-skeleton-wave" />
                </div>
                <div className="h-6 w-20 bg-[#181818] border border-white/10 relative overflow-hidden">
                  <div className="animate-skeleton-wave" />
                </div>
              </div>

              {/* Title Lines Skeleton */}
              <div className="space-y-2">
                <div className="h-10 md:h-14 w-11/12 bg-[#181818] border border-white/10 relative overflow-hidden">
                  <div className="animate-skeleton-wave" />
                </div>
                <div className="h-10 md:h-14 w-3/4 bg-[#181818] border border-white/10 relative overflow-hidden">
                  <div className="animate-skeleton-wave" />
                </div>
              </div>

              {/* Tagline Skeleton */}
              <div className="h-5 w-4/5 bg-[#181818] border border-white/10 relative overflow-hidden">
                <div className="animate-skeleton-wave" />
              </div>
            </div>

            {/* Servings Stepper Skeleton */}
            <div className="h-12 w-44 bg-[#121212] border-2 border-white/20 relative overflow-hidden shrink-0">
              <div className="animate-skeleton-wave" />
            </div>
          </div>

          {/* Hero Image Skeleton with Active Laser Scan */}
          <div className="w-full aspect-[21/9] bg-[#121212] border-2 border-white/20 relative overflow-hidden group">
            {/* Laser Scan Line */}
            <div className="animate-laser-scan" />
            <div className="animate-skeleton-wave" />

            {/* Grid overlay lines effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Center Loading Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
              <div className="relative mb-3">
                <div className="w-16 h-16 border-2 border-[#FF3E00] border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[#FF3E00]">
                  <ChefHat className="w-7 h-7 stroke-[2]" />
                </div>
              </div>
              <span className="font-['Syne'] text-xs font-black uppercase tracking-[0.3em] text-[#F5F5F5] bg-black/80 px-4 py-1.5 border border-white/20">
                GENERATING HIGH-RES DISH PREVIEW
              </span>
            </div>
          </div>
        </section>

        {/* Main Grid: Ingredients + Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Ingredients Sidebar Skeleton */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="border-l-2 border-[#FF3E00] pl-6 space-y-5">
              <div className="flex justify-between items-center mb-2">
                <div className="h-7 w-36 bg-[#181818] border border-white/10 relative overflow-hidden">
                  <div className="animate-skeleton-wave" />
                </div>
                <div className="h-4 w-16 bg-[#181818] border border-white/10 relative overflow-hidden">
                  <div className="animate-skeleton-wave" />
                </div>
              </div>

              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse shrink-0" />
                    <div className="h-4 w-36 bg-[#181818] border border-white/10 relative overflow-hidden">
                      <div className="animate-skeleton-wave" />
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-[#181818] border border-white/10 relative overflow-hidden">
                    <div className="animate-skeleton-wave" />
                  </div>
                </div>
              ))}
            </div>

            {/* Missing Staples Skeleton Box */}
            <div className="bg-[#121212] p-6 border-2 border-[#FF3E00]/30 space-y-4 relative overflow-hidden">
              <div className="animate-skeleton-wave" />
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF3E00]" />
                <div className="h-4 w-32 bg-[#181818] border border-white/10 relative overflow-hidden" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 bg-[#181818]" />
                <div className="h-3 w-1/2 bg-[#181818]" />
              </div>
              <div className="h-10 w-full bg-[#FF3E00]/20 border border-[#FF3E00]/40 mt-4" />
            </div>
          </aside>

          {/* Preparation Steps Skeleton */}
          <section className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="h-7 w-40 bg-[#181818] border border-white/10 relative overflow-hidden">
                <div className="animate-skeleton-wave" />
              </div>
              <div className="h-5 w-24 bg-[#181818] border border-white/10 relative overflow-hidden">
                <div className="animate-skeleton-wave" />
              </div>
            </div>

            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="p-5 bg-[#121212] border border-white/10 space-y-4 relative overflow-hidden">
                <div className="animate-skeleton-wave" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-['Syne'] font-black text-xl text-[#FF3E00]">
                      0{step}.
                    </span>
                    <div className="h-5 w-36 bg-[#181818] border border-white/10" />
                  </div>
                  <div className="h-7 w-28 bg-[#FF3E00]/20 border border-[#FF3E00]/40" />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full bg-[#181818]" />
                  <div className="h-4 w-11/12 bg-[#181818]" />
                  <div className="h-4 w-4/5 bg-[#181818]" />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Editorial Footer Note */}
      <div className="text-center pt-6 border-t border-white/10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF3E00]">
          <Cpu className="w-4 h-4 stroke-[2]" />
          <span>REAL-TIME STUDIO CULINARY SYNTHESIS</span>
        </div>
        <p className="font-['Space_Grotesk'] text-xs text-white/50 italic max-w-md">
          Combining thousands of gourmet flavor techniques to construct your custom recipe...
        </p>
      </div>
    </div>
  );
};
