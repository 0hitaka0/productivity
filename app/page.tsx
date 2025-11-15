export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 via-lavender-50 to-sage-50 dark:from-midnight-950 dark:via-midnight-900 dark:to-midnight-800">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-light text-midnight-900 dark:text-cream-50 tracking-tight">
            Clarity
          </h1>

          <p className="text-xl md:text-2xl text-sage-700 dark:text-sage-300 font-light max-w-2xl">
            Your INFJ productivity sanctuary.
            <br />
            <span className="text-lavender-600 dark:text-lavender-400">
              Calm. Intentional. Yours.
            </span>
          </p>

          <div className="pt-8 space-y-4">
            <div className="glass rounded-2xl p-8 shadow-soft-lg max-w-md mx-auto">
              <h2 className="text-2xl font-light text-midnight-800 dark:text-cream-100 mb-4">
                🌙 Building your sanctuary...
              </h2>
              <p className="text-sage-600 dark:text-sage-400 leading-relaxed">
                A space designed for deep work, gentle habits, and meaningful reflection.
                We're setting up your foundation — one intentional piece at a time.
              </p>
            </div>

            <p className="text-sm text-sage-500 dark:text-sage-500 font-light">
              You got this ✨
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
