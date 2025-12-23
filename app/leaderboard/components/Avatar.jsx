import { getAvatar } from "../utility";

export default function Avatar({ username, profilePicture, size = "md" }) {
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
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center flex-shrink-0`}>
      {getAvatar(username)}
    </div>
  );
}

