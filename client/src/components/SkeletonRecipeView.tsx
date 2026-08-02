import React from 'react';

export const SkeletonRecipeView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-16 py-8 lg:py-16 animate-pulse font-['Space_Grotesk',sans-serif]">
      {/* Recipe Header Skeleton */}
      <section className="mb-8 border-b border-white/10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-white/10"></div>
              <div className="h-6 w-16 bg-white/10"></div>
            </div>
            <div className="h-10 md:h-12 bg-white/20 w-3/4"></div>
            <div className="h-5 bg-white/10 w-full"></div>
            <div className="h-5 bg-white/10 w-2/3"></div>
          </div>
          {/* Servings Control Skeleton */}
          <div className="h-10 w-36 bg-white/10 border border-white/20"></div>
        </div>

        {/* Hero Image Skeleton */}
        <div className="w-full aspect-[21/9] bg-[#121212] border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/15 to-white/5 animate-shimmer"></div>
        </div>
      </section>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingredients Sidebar Skeleton */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="border-l-2 border-[#FF3E00] pl-6 space-y-4">
            <div className="h-6 w-32 bg-white/20 mb-6"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/10">
                <div className="h-4 w-40 bg-white/10"></div>
                <div className="h-4 w-8 bg-white/10"></div>
              </div>
            ))}
          </div>

          <div className="bg-[#121212] p-6 border border-white/20 space-y-3">
            <div className="h-4 w-36 bg-white/20"></div>
            <div className="h-3 w-48 bg-white/10"></div>
            <div className="h-8 w-full bg-[#FF3E00]/30 mt-4"></div>
          </div>
        </aside>

        {/* Preparation Steps Skeleton */}
        <section className="lg:col-span-8 space-y-8">
          <div className="h-7 w-36 bg-white/20 mb-8"></div>
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex gap-6 items-start">
              <div className="w-6 h-6 bg-[#FF3E00]/40"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 w-48 bg-white/20"></div>
                <div className="h-4 w-full bg-white/10"></div>
                <div className="h-4 w-5/6 bg-white/10"></div>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="text-center mt-12 font-['Syne'] text-sm uppercase tracking-widest font-bold text-[#FF3E00]">
        CURATING RECIPE INSTRUCTIONS & SCALING INGREDIENTS...
      </div>
    </div>
  );
};
