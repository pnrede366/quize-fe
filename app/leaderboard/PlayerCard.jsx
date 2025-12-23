import { LEVEL_COLORS } from "./constants";
import { renderAvatar } from "./utility";

export default function PlayerCard({ player }) {
  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900 p-3 sm:p-4 transition-all hover:scale-105 hover:border-indigo-500/50 hover:bg-zinc-800">
      <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-600 text-xs sm:text-sm font-bold text-white">
        {player.rank}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {renderAvatar(player.username, player.profilePicture, "2xl")}
        <div className="flex-1 min-w-0">
          <h4 className="mb-1 text-sm sm:text-base font-semibold text-zinc-100 break-words">{player.username}</h4>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-zinc-400">
            <span className={`font-semibold ${LEVEL_COLORS[player.level]} whitespace-nowrap`}>Lvl {player.level}</span>
            <span className="hidden sm:inline">•</span>
            <span className="whitespace-nowrap">{player.quizzesTaken} quizzes</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-400 break-words">{player.score.toLocaleString()}</div>
          <div className="text-xs text-zinc-500">points</div>
        </div>
      </div>
    </div>
  );
}

