import Button from "../component/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-2xl w-full text-center animate-in">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-500 mb-2">404</h1>
          <div className="h-1 w-24 bg-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h2 className="text-4xl font-bold text-zinc-100 mb-4">Page Not Found</h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
          <Button href="/quizzes" variant="outline" size="lg">
            Browse Quizzes
          </Button>
        </div>

        {/* Decorative Element */}
        <div className="mt-16 flex justify-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

