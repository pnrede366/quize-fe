export const splitLeaderboard = (leaderboard) => {
  return {
    topThree: leaderboard.slice(0, 3),
    nextFive: leaderboard.slice(3, 8),
    followingFive: leaderboard.slice(8, 13),
    remaining: leaderboard.slice(13),
  };
};

