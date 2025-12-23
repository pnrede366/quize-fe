import PlayerCard from "../PlayerCard";

export default function LeaderboardSection({ title, players }) {
  if (players.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-12">
      <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-zinc-300">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {players.map((player) => (
          <PlayerCard key={player.rank} player={player} />
        ))}
      </div>
    </div>
  );
}

