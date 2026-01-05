import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="text-center text-white max-w-2xl px-4">
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🎯</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
          Bingoooal
        </h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">
          Track your yearly goals in a fun bingo format
        </p>
        <Link
          href="/login"
          className="inline-block bg-white text-purple-700 px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105 text-sm sm:text-base"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
