import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  // If logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="text-center text-white max-w-2xl">
        <div className="text-6xl mb-6">🎯</div>
        <h1 className="text-5xl font-bold mb-4">Bingoooal</h1>
        <p className="text-xl mb-8 opacity-90">
          Track your yearly goals in a fun bingo format
        </p>
        <Link
          href="/login"
          className="inline-block bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </main>
  )
}

