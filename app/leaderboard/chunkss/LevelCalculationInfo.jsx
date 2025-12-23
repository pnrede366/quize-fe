import { LEVEL_CONFIG } from "../constants";

export default function LevelCalculationInfo() {
  return (
    <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 sm:p-6 backdrop-blur-sm">
      <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2">
        <span className="text-xl sm:text-2xl">⭐</span>
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">How Levels are Calculated</h2>
      </div>
      <div className="mb-4 text-center">
        <p className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
          Level = ⌊Points ÷ 1000⌋ + 1
        </p>
        <p className="text-xs sm:text-sm text-zinc-400">
          Your level increases every 1,000 points you earn
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {LEVEL_CONFIG.map((level, index) => (
          <div key={index} className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 text-center">
            <p className="text-xs sm:text-sm text-zinc-400 mb-1">{level.level}</p>
            <p className="text-sm sm:text-base font-bold text-purple-400">{level.range}</p>
            <p className="text-xs text-zinc-500">{level.points}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-zinc-500 px-2">
        🎯 Level up by earning points! Each level requires 1,000 more points than the previous one.
      </p>
    </div>
  );
}

