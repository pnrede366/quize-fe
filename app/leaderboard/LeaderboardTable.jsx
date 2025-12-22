import { RANK_EMOJIS, LEVEL_COLORS } from "./constants";

const AVATAR_EMOJIS = ["👑", "🏆", "🥉", "🎯", "💡", "🧠", "📊", "🥷", "♠️", "💻", "⚡", "🎨", "🚀", "📚", "🐛", "🔀", "🔌", "☁️", "💾", "⚛️"];

export default function LeaderboardTable({ players }) {
  const getAvatar = (username) => {
    const index = username.charCodeAt(0) % AVATAR_EMOJIS.length;
    return AVATAR_EMOJIS[index];
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <table className="w-full">
        <thead className="border-b border-zinc-800 bg-zinc-950">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Rank</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Player</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Level</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">Quizzes</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-300">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {players.map((player) => (
            <tr key={player.rank} className="transition-colors hover:bg-zinc-800">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{RANK_EMOJIS[player.rank] || `#${player.rank}`}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getAvatar(player.username)}</span>
                  <span className="font-medium text-zinc-100">{player.username}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`font-semibold ${LEVEL_COLORS[player.level]}`}>
                  Level {player.level}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-zinc-400">{player.quizzesTaken}</td>
              <td className="px-6 py-4 text-right">
                <span className="text-lg font-bold text-indigo-400">
                  {player.score.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

