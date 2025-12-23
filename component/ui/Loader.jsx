export default function Loader({ emoji = "⏳", message = "Loading...", size = "lg" }) {
  const emojiSizes = {
    sm: "text-4xl",
    md: "text-5xl",
    lg: "text-6xl",
    xl: "text-8xl",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className={`mb-4 ${emojiSizes[size]}`}>{emoji}</div>
        <p className={`${textSizes[size]} text-zinc-400`}>{message}</p>
      </div>
    </div>
  );
}

