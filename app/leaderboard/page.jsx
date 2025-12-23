"use client";

import PlayerCard from "./PlayerCard";
import LeaderboardTable from "./LeaderboardTable";
import Loader from "../../component/ui/Loader";
import { LEADERBOARD_SECTIONS } from "./constants";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { splitLeaderboard } from "./utils/leaderboardUtils";
import PointsCalculationInfo from "./chunkss/PointsCalculationInfo";
import LevelCalculationInfo from "./chunkss/LevelCalculationInfo";
import ChampionsPodium from "./chunkss/ChampionsPodium";
import LeaderboardSection from "./chunkss/LeaderboardSection";
import EmptyLeaderboard from "./chunkss/EmptyLeaderboard";

export default function LeaderboardPage() {
  const { leaderboard, loading } = useLeaderboard();

  if (loading) {
    return <Loader emoji="🏆" message="Loading leaderboard..." />;
  }

  if (leaderboard.length === 0) {
    return <EmptyLeaderboard />;
  }

  const { topThree, nextFive, followingFive, remaining } = splitLeaderboard(leaderboard);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 sm:px-6 sm:py-8 text-zinc-100">
      <div className="container mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-5xl font-bold">🏆 Leaderboard</h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400">Top performers in AI Quiz Challenge</p>
        </div>

        {/* Points & Level Calculation Info */}
        <div className="mb-8 sm:mb-12 mx-auto max-w-4xl space-y-4 sm:space-y-6">
          <PointsCalculationInfo />
          <LevelCalculationInfo />
        </div>

        {/* Top 3 - Podium Style */}
        {topThree.length === 3 ? (
          <ChampionsPodium topThree={topThree} />
        ) : topThree.length > 0 && (
          <LeaderboardSection title="Top Players" players={topThree} />
        )}

        {/* Ranks 4-8 */}
        <LeaderboardSection title={LEADERBOARD_SECTIONS[0].title} players={nextFive} />

        {/* Ranks 9-13 */}
        <LeaderboardSection title={LEADERBOARD_SECTIONS[1].title} players={followingFive} />

        {/* Remaining - Table */}
        {remaining.length > 0 && (
          <div>
            <h2 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold text-zinc-300">All Players</h2>
            <LeaderboardTable players={remaining} />
          </div>
        )}
      </div>
    </main>
  );
}

