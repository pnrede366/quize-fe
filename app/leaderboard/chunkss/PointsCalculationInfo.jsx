import { POINTS_CONFIG } from "../constants";

export default function PointsCalculationInfo() {
  return (
    <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 sm:p-6 backdrop-blur-sm">
      <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2">
        <span className="text-xl sm:text-2xl">📊</span>
        <h2 className="text-lg sm:text-xl font-bold text-zinc-100">How Points are Calculated</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 md:grid-cols-4">
        {POINTS_CONFIG.map((config, index) => (
          <div key={index} className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-3 sm:p-4 text-center`}>
            <p className="mb-1 text-xs sm:text-sm text-zinc-400">{config.difficulty}</p>
            <p className={`text-lg sm:text-xl md:text-2xl font-bold ${config.textColor}`}>{config.points}</p>
            <p className="text-xs text-zinc-500">per correct</p>
          </div>
        ))}
      </div>
      <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-zinc-500 px-2">
        💡 Take harder quizzes to earn more points and climb the leaderboard faster!
      </p>
    </div>
  );
}

