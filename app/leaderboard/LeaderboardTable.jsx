import { TABLE_HEADERS, LEVEL_COLORS } from "./constants";
import { getAvatar, getRankDisplay } from "./utility";

// Table cell renderers configuration
const CELL_RENDERERS = {
  rank: (player) => (
    <div className="flex items-center gap-2">
      <span className="text-base sm:text-lg md:text-xl">{getRankDisplay(player.rank)}</span>
    </div>
  ),
  player: (player) => (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="text-xl sm:text-2xl flex-shrink-0">{getAvatar(player.username)}</span>
      <span className="font-medium text-sm sm:text-base text-zinc-100 break-words">{player.username}</span>
    </div>
  ),
  level: (player) => (
    <span className={`text-xs sm:text-sm font-semibold ${LEVEL_COLORS[player.level]} whitespace-nowrap`}>
      Level {player.level}
    </span>
  ),
  quizzes: (player) => (
    <span className="text-xs sm:text-sm text-zinc-400 whitespace-nowrap">{player.quizzesTaken}</span>
  ),
  score: (player) => (
    <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-400 break-words">
      {player.score.toLocaleString()}
    </span>
  ),
};

export default function LeaderboardTable({ players }) {
  const cellKeys = ["rank", "player", "level", "quizzes", "score"];

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
      <table className="w-full min-w-[600px]">
        <thead className="border-b border-zinc-800 bg-zinc-950">
          <tr>
            {TABLE_HEADERS.map((header, index) => (
              <th
                key={index}
                className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${header.align === "right" ? "text-right" : "text-left"} text-xs sm:text-sm font-semibold text-zinc-300`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {players.map((player) => (
            <tr key={player.rank} className="transition-colors hover:bg-zinc-800">
              {cellKeys.map((key, index) => (
                <td
                  key={key}
                  className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 ${TABLE_HEADERS[index].align === "right" ? "text-right" : "text-left"}`}
                >
                  {CELL_RENDERERS[key](player)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

