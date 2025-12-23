export default function EmptyLeaderboard() {
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

