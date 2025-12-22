"use client";

import { useEffect, useState } from "react";
import { notification } from "antd";
import { io } from "socket.io-client";
import TopThreeCard from "./TopThreeCard";
import PlayerCard from "./PlayerCard";
import LeaderboardTable from "./LeaderboardTable";
import { userAPI } from "../../api/api";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    // Connect to Socket.IO for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO');
    });

    socket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update received:', data);
      // Refresh leaderboard when someone scores
      fetchLeaderboard();
      
      // Show notification
      notification.success({
        message: "Leaderboard Updated! 🎉",
        description: `${data.username} just scored points!`,
        placement: "bottomRight",
        duration: 3,
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await userAPI.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to load leaderboard",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">🏆</div>
          <p className="text-xl text-zinc-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
        <div className="text-center">
          <div className="mb-4 text-8xl">🏆</div>
          <h1 className="mb-4 text-4xl font-bold text-zinc-100">No Players Yet</h1>
          <p className="text-xl text-zinc-400">Be the first to take a quiz and claim the top spot!</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const nextFive = leaderboard.slice(3, 8);
  const followingFive = leaderboard.slice(8, 13);
  const remaining = leaderboard.slice(13);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-8 text-zinc-100">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-5xl font-bold">🏆 Leaderboard</h1>
          <p className="text-lg text-zinc-400">Top performers in AI Quiz Challenge</p>
        </div>

        {/* Points Calculation Info */}
        <div className="mb-12 mx-auto max-w-4xl rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-zinc-100">How Points are Calculated</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-center">
              <p className="mb-1 text-sm text-zinc-400">Easy (0-2)</p>
              <p className="text-2xl font-bold text-green-400">10 pts</p>
              <p className="text-xs text-zinc-500">per correct</p>
            </div>
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-center">
              <p className="mb-1 text-sm text-zinc-400">Medium (3-5)</p>
              <p className="text-2xl font-bold text-yellow-400">15 pts</p>
              <p className="text-xs text-zinc-500">per correct</p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 text-center">
              <p className="mb-1 text-sm text-zinc-400">Hard (6-8)</p>
              <p className="text-2xl font-bold text-orange-400">20 pts</p>
              <p className="text-xs text-zinc-500">per correct</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center">
              <p className="mb-1 text-sm text-zinc-400">Expert (9-10)</p>
              <p className="text-2xl font-bold text-red-400">25 pts</p>
              <p className="text-xs text-zinc-500">per correct</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-zinc-500">
            💡 Take harder quizzes to earn more points and climb the leaderboard faster!
          </p>
        </div>

        {/* Top 3 - Podium Style */}
        {topThree.length === 3 ? (
          <div className="mb-16">
            <h2 className="mb-8 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              🏆 Champions Podium 🏆
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-end max-w-6xl mx-auto">
              {/* 2nd Place - Left */}
              <div className="order-2 md:order-1 transform hover:scale-105 transition-transform">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-full bg-gray-400 px-6 py-2 text-2xl font-bold text-white shadow-lg">
                    2nd
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-gray-400 bg-gradient-to-br from-gray-400/20 to-gray-500/10 p-6 shadow-xl">
                  <div className="mb-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-4xl font-bold text-white shadow-lg">
                      {topThree[1].username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="mb-2 text-center text-xl font-bold text-zinc-100">{topThree[1].username}</h3>
                  <div className="mb-2 text-center">
                    <span className="rounded-full bg-gray-400/20 px-3 py-1 text-sm font-semibold text-gray-400">
                      Level {topThree[1].level}
                    </span>
                  </div>
                  <p className="text-center text-3xl font-bold text-gray-400">{topThree[1].score.toLocaleString()} pts</p>
                  <p className="text-center text-sm text-zinc-500">{topThree[1].quizzesTaken} quizzes</p>
                </div>
              </div>

              {/* 1st Place - Center (Bigger) */}
              <div className="order-1 md:order-2 transform hover:scale-105 transition-transform md:scale-110">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-3 text-3xl font-bold text-white shadow-2xl animate-pulse">
                    👑 1st 👑
                  </div>
                </div>
                <div className="rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-400/30 to-orange-500/20 p-8 shadow-2xl">
                  <div className="mb-6 text-center">
                    <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-5xl font-bold text-white shadow-2xl ring-4 ring-yellow-400/50">
                      {topThree[0].username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-2xl font-bold text-zinc-100">{topThree[0].username}</h3>
                  <div className="mb-3 text-center">
                    <span className="rounded-full bg-yellow-400/20 px-4 py-2 text-base font-semibold text-yellow-400">
                      Level {topThree[0].level}
                    </span>
                  </div>
                  <p className="text-center text-4xl font-bold text-yellow-400">{topThree[0].score.toLocaleString()} pts</p>
                  <p className="text-center text-sm text-zinc-500">{topThree[0].quizzesTaken} quizzes</p>
                </div>
              </div>

              {/* 3rd Place - Right */}
              <div className="order-3 transform hover:scale-105 transition-transform">
                <div className="mb-4 text-center">
                  <div className="inline-block rounded-full bg-orange-600 px-6 py-2 text-2xl font-bold text-white shadow-lg">
                    3rd
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-orange-600 bg-gradient-to-br from-orange-600/20 to-orange-700/10 p-6 shadow-xl">
                  <div className="mb-4 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-4xl font-bold text-white shadow-lg">
                      {topThree[2].username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <h3 className="mb-2 text-center text-xl font-bold text-zinc-100">{topThree[2].username}</h3>
                  <div className="mb-2 text-center">
                    <span className="rounded-full bg-orange-600/20 px-3 py-1 text-sm font-semibold text-orange-600">
                      Level {topThree[2].level}
                    </span>
                  </div>
                  <p className="text-center text-3xl font-bold text-orange-600">{topThree[2].score.toLocaleString()} pts</p>
                  <p className="text-center text-sm text-zinc-500">{topThree[2].quizzesTaken} quizzes</p>
                </div>
              </div>
            </div>
          </div>
        ) : topThree.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-zinc-300">Top Players</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topThree.map((player) => (
                <PlayerCard key={player.rank} player={player} />
              ))}
            </div>
          </div>
        )}

        {/* Ranks 4-8 */}
        {nextFive.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-zinc-300">Rising Stars</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {nextFive.map((player) => (
                <PlayerCard key={player.rank} player={player} />
              ))}
            </div>
          </div>
        )}

        {/* Ranks 9-13 */}
        {followingFive.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-zinc-300">Elite Players</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {followingFive.map((player) => (
                <PlayerCard key={player.rank} player={player} />
              ))}
            </div>
          </div>
        )}

        {/* Remaining - Table */}
        {remaining.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-zinc-300">All Players</h2>
            <LeaderboardTable players={remaining} />
          </div>
        )}
      </div>
    </main>
  );
}

