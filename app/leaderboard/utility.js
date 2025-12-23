import { RANK_EMOJIS } from "./constants";

const AVATAR_EMOJIS = ["👑", "🏆", "🥉", "🎯", "💡", "🧠", "📊", "🥷", "♠️", "💻", "⚡", "🎨", "🚀", "📚", "🐛", "🔀", "🔌", "☁️", "💾", "⚛️"];

export const getAvatar = (username) => {
  const index = username.charCodeAt(0) % AVATAR_EMOJIS.length;
  return AVATAR_EMOJIS[index];
};

export const getRankDisplay = (rank) => {
  return RANK_EMOJIS[rank] || `#${rank}`;
};

export const renderAvatar = (username, profilePicture, size = "md") => {
  const sizeClasses = {
    sm: "h-8 w-8 text-lg",
    md: "h-10 w-10 text-xl",
    lg: "h-12 w-12 text-2xl",
    xl: "h-16 w-16 text-3xl",
    "2xl": "h-20 w-20 text-4xl",
    "3xl": "h-24 w-24 text-5xl",
  };

  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={username}
        className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          // Fallback to emoji if image fails to load
          const parent = e.target.parentNode;
          const fallback = document.createElement("div");
          fallback.className = `${sizeClasses[size]} flex items-center justify-center flex-shrink-0`;
          fallback.textContent = getAvatar(username);
          parent.replaceChild(fallback, e.target);
        }}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center flex-shrink-0`}>
      {getAvatar(username)}
    </div>
  );
};

