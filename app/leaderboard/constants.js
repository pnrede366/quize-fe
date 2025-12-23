export const RANK_EMOJIS = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
  4: "4️⃣",
  5: "5️⃣",
  6: "6️⃣",
  7: "7️⃣",
  8: "8️⃣",
  9: "9️⃣",
  10: "🔟",
};

// Table column headers configuration
export const TABLE_HEADERS = [
  { label: "Rank", align: "left" },
  { label: "Player", align: "left" },
  { label: "Level", align: "left" },
  { label: "Quizzes", align: "right" },
  { label: "Score", align: "right" },
];

// Points calculation configuration
export const POINTS_CONFIG = [
  { 
    difficulty: "Easy (0-2)", 
    points: "10 pts", 
    borderColor: "border-green-500/30", 
    bgColor: "bg-green-500/10", 
    textColor: "text-green-400" 
  },
  { 
    difficulty: "Medium (3-5)", 
    points: "15 pts", 
    borderColor: "border-yellow-500/30", 
    bgColor: "bg-yellow-500/10", 
    textColor: "text-yellow-400" 
  },
  { 
    difficulty: "Hard (6-8)", 
    points: "20 pts", 
    borderColor: "border-orange-500/30", 
    bgColor: "bg-orange-500/10", 
    textColor: "text-orange-400" 
  },
  { 
    difficulty: "Expert (9-10)", 
    points: "25 pts", 
    borderColor: "border-red-500/30", 
    bgColor: "bg-red-500/10", 
    textColor: "text-red-400" 
  },
];

// Level calculation configuration
export const LEVEL_CONFIG = [
  { level: "Level 1", range: "0-999", points: "points" },
  { level: "Level 2", range: "1,000-1,999", points: "points" },
  { level: "Level 3", range: "2,000-2,999", points: "points" },
  { level: "Level 4", range: "3,000-3,999", points: "points" },
  { level: "Level 5+", range: "4,000+", points: "points" },
];

// Leaderboard section configurations
export const LEADERBOARD_SECTIONS = [
  { title: "Rising Stars", startIndex: 3, endIndex: 8 },
  { title: "Elite Players", startIndex: 8, endIndex: 13 },
];

// Import LEVEL_COLORS from global helper
export { LEVEL_COLORS } from "../../../helper/constant";
