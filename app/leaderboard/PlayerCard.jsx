import { LEVEL_COLORS } from "./constants";

const AVATAR_EMOJIS = ["👑", "🏆", "🥉", "🎯", "💡", "🧠", "📊", "🥷", "♠️", "💻", "⚡", "🎨", "🚀", "📚", "🐛", "🔀", "🔌", "☁️", "💾", "⚛️"];

export default function PlayerCard({ player }) {
  const getAvatar = (username) => {
    const index = username.charCodeAt(0) % AVATAR_EMOJIS.length;
    return AVATAR_EMOJIS[index];
  };

  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:scale-105 hover:border-indigo-500/50 hover:bg-zinc-800">
      <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
        {player.rank}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-5xl">{getAvatar(player.username)}</div>
        <div className="flex-1">
          <h4 className="mb-1 font-semibold text-zinc-100">{player.username}</h4>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className={`font-semibold ${LEVEL_COLORS[player.level]}`}>Lvl {player.level}</span>
            <span>•</span>
            <span>{player.quizzesTaken} quizzes</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-indigo-400">{player.score.toLocaleString()}</div>
          <div className="text-xs text-zinc-500">points</div>
        </div>
      </div>
    </div>
  );
}

