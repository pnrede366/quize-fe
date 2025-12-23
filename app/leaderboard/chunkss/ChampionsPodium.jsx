import { renderAvatar } from "../utility";

export default function ChampionsPodium({ topThree }) {
  if (topThree.length !== 3) return null;

  return (
    <div className="mb-8 sm:mb-12 md:mb-16">
      <h2 className="mb-4 sm:mb-6 md:mb-8 text-center text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
        🏆 Champions Podium 🏆
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 items-end max-w-6xl mx-auto">
        {/* 2nd Place - Left */}
        <div className="order-2 md:order-1 transform hover:scale-105 transition-transform">
          <div className="mb-3 sm:mb-4 text-center">
            <div className="inline-block rounded-full bg-gray-400 px-4 sm:px-6 py-1.5 sm:py-2 text-lg sm:text-xl md:text-2xl font-bold text-white shadow-lg">
              2nd
            </div>
          </div>
          <div className="rounded-2xl border-2 border-gray-400 bg-gradient-to-br from-gray-400/20 to-gray-500/10 p-4 sm:p-6 shadow-xl">
            <div className="mb-3 sm:mb-4 text-center">
              {topThree[1].profilePicture ? (
                <img
                  src={topThree[1].profilePicture}
                  alt={topThree[1].username}
                  className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full object-cover border-2 border-gray-400 shadow-lg"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className = "mx-auto flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-lg";
                    fallback.textContent = topThree[1].username.charAt(0).toUpperCase();
                    e.target.parentNode.insertBefore(fallback, e.target);
                  }}
                />
              ) : (
                <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-lg">
                  {topThree[1].username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="mb-2 text-center text-base sm:text-lg md:text-xl font-bold text-zinc-100 break-words px-2">{topThree[1].username}</h3>
            <div className="mb-2 text-center">
              <span className="rounded-full bg-gray-400/20 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-400">
                Level {topThree[1].level}
              </span>
            </div>
            <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-400 break-words">{topThree[1].score.toLocaleString()} pts</p>
            <p className="text-center text-xs sm:text-sm text-zinc-500">{topThree[1].quizzesTaken} quizzes</p>
          </div>
        </div>

        {/* 1st Place - Center (Bigger) */}
        <div className="order-1 md:order-2 transform hover:scale-105 transition-transform md:scale-110">
          <div className="mb-3 sm:mb-4 text-center">
            <div className="inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-xl sm:text-2xl md:text-3xl font-bold text-white shadow-2xl animate-pulse">
              👑 1st 👑
            </div>
          </div>
          <div className="rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-yellow-400/30 to-orange-500/20 p-4 sm:p-6 md:p-8 shadow-2xl">
            <div className="mb-4 sm:mb-5 md:mb-6 text-center">
              {topThree[0].profilePicture ? (
                <img
                  src={topThree[0].profilePicture}
                  alt={topThree[0].username}
                  className="mx-auto h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-yellow-400/50 shadow-2xl ring-2 sm:ring-4 ring-yellow-400/50"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className = "mx-auto flex h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-3xl sm:text-4xl md:text-5xl font-bold text-white shadow-2xl ring-2 sm:ring-4 ring-yellow-400/50";
                    fallback.textContent = topThree[0].username.charAt(0).toUpperCase();
                    e.target.parentNode.insertBefore(fallback, e.target);
                  }}
                />
              ) : (
                <div className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-3xl sm:text-4xl md:text-5xl font-bold text-white shadow-2xl ring-2 sm:ring-4 ring-yellow-400/50">
                  {topThree[0].username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="mb-2 sm:mb-3 text-center text-lg sm:text-xl md:text-2xl font-bold text-zinc-100 break-words px-2">{topThree[0].username}</h3>
            <div className="mb-2 sm:mb-3 text-center">
              <span className="rounded-full bg-yellow-400/20 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold text-yellow-400">
                Level {topThree[0].level}
              </span>
            </div>
            <p className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 break-words">{topThree[0].score.toLocaleString()} pts</p>
            <p className="text-center text-xs sm:text-sm text-zinc-500">{topThree[0].quizzesTaken} quizzes</p>
          </div>
        </div>

        {/* 3rd Place - Right */}
        <div className="order-3 transform hover:scale-105 transition-transform">
          <div className="mb-3 sm:mb-4 text-center">
            <div className="inline-block rounded-full bg-orange-600 px-4 sm:px-6 py-1.5 sm:py-2 text-lg sm:text-xl md:text-2xl font-bold text-white shadow-lg">
              3rd
            </div>
          </div>
          <div className="rounded-2xl border-2 border-orange-600 bg-gradient-to-br from-orange-600/20 to-orange-700/10 p-4 sm:p-6 shadow-xl">
            <div className="mb-3 sm:mb-4 text-center">
              {topThree[2].profilePicture ? (
                <img
                  src={topThree[2].profilePicture}
                  alt={topThree[2].username}
                  className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full object-cover border-2 border-orange-600 shadow-lg"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className = "mx-auto flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-lg";
                    fallback.textContent = topThree[2].username.charAt(0).toUpperCase();
                    e.target.parentNode.insertBefore(fallback, e.target);
                  }}
                />
              ) : (
                <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-orange-700 text-2xl sm:text-3xl md:text-4xl font-bold text-white shadow-lg">
                  {topThree[2].username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="mb-2 text-center text-base sm:text-lg md:text-xl font-bold text-zinc-100 break-words px-2">{topThree[2].username}</h3>
            <div className="mb-2 text-center">
              <span className="rounded-full bg-orange-600/20 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-orange-600">
                Level {topThree[2].level}
              </span>
            </div>
            <p className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 break-words">{topThree[2].score.toLocaleString()} pts</p>
            <p className="text-center text-xs sm:text-sm text-zinc-500">{topThree[2].quizzesTaken} quizzes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

