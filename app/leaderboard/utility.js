import { RANK_EMOJIS } from "./constants";

const AVATAR_EMOJIS = ["👑", "🏆", "🥉", "🎯", "💡", "🧠", "📊", "🥷", "♠️", "💻", "⚡", "🎨", "🚀", "📚", "🐛", "🔀", "🔌", "☁️", "💾", "⚛️"];

export const getAvatar = (username) => {
  const index = username.charCodeAt(0) % AVATAR_EMOJIS.length;
  return AVATAR_EMOJIS[index];
};

export const getRankDisplay = (rank) => {
  return RANK_EMOJIS[rank] || `#${rank}`;
};

