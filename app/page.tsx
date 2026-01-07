import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  // If logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-background">
      <div className="text-center text-foreground max-w-2xl px-4">
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🎯</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">
          Bingoooal
        </h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8">
          Track your yearly goals in a fun bingo format
        </p>
        <Button asChild size="lg">
          <Link href="/login">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
