import React, { useState, useEffect } from 'react';
import { KitchenTimer } from '../types';
import { Clock, Play, Pause, RotateCcw, Plus, Trash2, BellRing, Volume2, VolumeX } from 'lucide-react';

interface TimerDrawerProps {
  timers: KitchenTimer[];
  onUpdateTimers: (timers: KitchenTimer[]) => void;
}

export const TimerDrawer: React.FC<TimerDrawerProps> = ({ timers, onUpdateTimers }) => {
  const [newLabel, setNewLabel] = useState('');
  const [newMinutes, setNewMinutes] = useState('5');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Interval timer ticks
  useEffect(() => {
    const interval = setInterval(() => {
      onUpdateTimers(
        timers.map((t) => {
          if (t.isRunning && t.remainingSeconds > 0) {
            const nextSec = t.remainingSeconds - 1;
            if (nextSec === 0 && soundEnabled) {
              playBeep();
            }
            return {
              ...t,
              remainingSeconds: nextSec,
              isRunning: nextSec > 0,
            };
          }
          return t;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, soundEnabled, onUpdateTimers]);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(newMinutes, 10);
    if (isNaN(mins) || mins <= 0) return;

    const newTimer: KitchenTimer = {
      id: `timer-${Date.now()}`,
      label: newLabel.trim() || `${mins} min Kitchen Timer`,
      totalSeconds: mins * 60,
      remainingSeconds: mins * 60,
      isRunning: true,
    };

    onUpdateTimers([...timers, newTimer]);
    setNewLabel('');
    setNewMinutes('5');
  };

  const toggleTimer = (id: string) => {
    onUpdateTimers(
      timers.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    onUpdateTimers(
      timers.map((t) =>
        t.id === id
          ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false }
          : t
      )
    );
  };

  const deleteTimer = (id: string) => {
    onUpdateTimers(timers.filter((t) => t.id !== id));
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 font-['Space_Grotesk',sans-serif]">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#FF3E00] font-mono text-xs font-bold uppercase tracking-[0.25em] mb-2">
            <Clock className="w-4 h-4 stroke-[2.5]" />
            <span>KITCHEN UTILITY</span>
          </div>
          <h1 className="font-['Syne'] text-3xl md:text-5xl font-black uppercase text-[#F5F5F5] tracking-tight">
            ACTIVE KITCHEN TIMERS
          </h1>
          <p className="font-['Space_Grotesk'] text-sm text-white/60 italic mt-1">
            Track searing, simmering, and broiling precisely without leaving the page.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 border border-white/20 bg-[#121212] text-[#F5F5F5] hover:border-[#FF3E00] text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-none"
          title="Toggle Timer Sound Alert"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-[#FF3E00]" />
              <span className="hidden sm:inline">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-white/40" />
              <span className="hidden sm:inline">Sound Off</span>
            </>
          )}
        </button>
      </div>

      {/* Add New Timer Form */}
      <form
        onSubmit={handleAddTimer}
        className="bg-[#121212] p-4 md:p-6 border-2 border-white/20 space-y-4"
      >
        <h3 className="font-['Syne'] text-base font-bold uppercase text-[#F5F5F5]">
          Set a Quick Timer
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Timer label (e.g. Broiling Frittata, Boiling Pasta)"
              className="w-full bg-[#181818] border border-white/20 px-4 py-2.5 text-sm font-['Space_Grotesk'] text-[#F5F5F5] placeholder-white/30 focus:outline-none focus:border-[#FF3E00]"
            />
          </div>
          <div className="sm:col-span-3 flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="180"
              value={newMinutes}
              onChange={(e) => setNewMinutes(e.target.value)}
              className="w-full bg-[#181818] border border-white/20 px-3 py-2.5 text-sm font-mono text-[#FF3E00] focus:outline-none focus:border-[#FF3E00] text-center font-black"
            />
            <span className="font-mono text-xs uppercase text-white/50 font-bold">Mins</span>
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full bg-[#FF3E00] hover:bg-white text-black px-4 py-2.5 text-xs font-['Space_Grotesk'] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Start Timer</span>
            </button>
          </div>
        </div>
      </form>

      {/* Active Timers List */}
      {timers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/20 p-8 bg-[#121212]">
          <Clock className="w-8 h-8 text-[#FF3E00] mx-auto mb-3 stroke-[2]" />
          <p className="font-['Syne'] text-lg text-[#F5F5F5] font-bold uppercase">
            No active timers right now.
          </p>
          <p className="font-['Space_Grotesk'] text-xs text-white/50 mt-1">
            Start a timer from step instructions or create one above!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timers.map((t) => {
            const isDone = t.remainingSeconds === 0;
            const progress = ((t.totalSeconds - t.remainingSeconds) / t.totalSeconds) * 100;

            return (
              <div
                key={t.id}
                className={`p-6 border-2 transition-all bg-[#121212] relative overflow-hidden ${
                  isDone
                    ? 'border-[#FF3E00] bg-[#FF3E00]/10 animate-pulse'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {/* Progress Bar Background */}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-[#FF3E00] transition-all"
                  style={{ width: `${progress}%` }}
                />

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-['Syne'] text-base font-bold text-[#F5F5F5] uppercase line-clamp-1">
                      {t.label}
                    </h4>
                    <span className="font-mono text-[10px] text-white/40 uppercase font-bold">
                      Total: {Math.ceil(t.totalSeconds / 60)}m
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTimer(t.id)}
                    className="text-white/40 hover:text-[#FF3E00] p-1 transition-colors"
                    title="Delete Timer"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="font-mono text-4xl font-black tracking-widest text-[#F5F5F5]">
                    {formatTime(t.remainingSeconds)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTimer(t.id)}
                      disabled={isDone}
                      className={`px-3.5 py-2 text-xs font-mono font-extrabold uppercase border transition-colors ${
                        t.isRunning
                          ? 'bg-[#181818] text-[#F5F5F5] border-white/30 hover:border-white'
                          : 'bg-[#FF3E00] text-black border-[#FF3E00] hover:bg-white'
                      }`}
                    >
                      {t.isRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Start</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => resetTimer(t.id)}
                      className="p-2 border border-white/20 hover:border-white text-white/70 transition-colors"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isDone && (
                  <div className="mt-3 pt-2 border-t border-[#FF3E00] text-[#FF3E00] font-mono text-xs font-black uppercase flex items-center gap-1.5">
                    <BellRing className="w-4 h-4 animate-bounce" />
                    <span>Timer Complete! Check your skillet.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
