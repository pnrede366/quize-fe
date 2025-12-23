import { RANK_EMOJIS, LEVEL_COLORS } from "./constants";
import { renderAvatar } from "./utility";

// Podium position configurations
const PODIUM_CONFIG = {
  1: { 
    container: "scale-110", 
    avatar: "text-8xl", 
    card: "h-64",
    border: "border-yellow-500/50 bg-gradient-to-b from-yellow-500/10 to-zinc-900"
  },
  2: { 
    container: "scale-100", 
    avatar: "text-7xl", 
    card: "h-56",
    border: "border-zinc-400/50 bg-gradient-to-b from-zinc-400/10 to-zinc-900"
  },
  3: { 
    container: "scale-100", 
    avatar: "text-7xl", 
    card: "h-56",
    border: "border-orange-500/50 bg-gradient-to-b from-orange-500/10 to-zinc-900"
  },
};

export default function TopThreeCard({ player, position }) {
  const config = PODIUM_CONFIG[position];

  return (
    <div className={`${config.container} transition-transform hover:scale-110`}>
      <div className={`relative rounded-2xl border-2 ${config.border} ${config.card} p-6 text-center`}>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">
          {RANK_EMOJIS[position]}
        </div>
        <div className="mb-4 mt-4 flex justify-center">
          {renderAvatar(player.username, player.profilePicture, position === 1 ? "3xl" : "2xl")}
        </div>
        <h3 className="mb-2 text-xl font-bold text-zinc-100">{player.username}</h3>
        <div className="mb-2 text-3xl font-bold text-indigo-400">{player.score.toLocaleString()}</div>
        <div className="flex items-center justify-center gap-4 text-sm text-zinc-400">
          <span className={`font-semibold ${LEVEL_COLORS[player.level]}`}>Level {player.level}</span>
          <span>•</span>
          <span>{player.quizzesTaken} quizzes</span>
        </div>
      </div>
    </div>
  );
}

