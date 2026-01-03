import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Board } from "@/lib/types";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user's boards
  const { data: boards, error: boardsError } = await supabase
    .from("boards")
    .select("*")
    .eq("user_id", session.user.id)
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });

  if (boardsError) {
    console.error("Error fetching boards:", boardsError);
  }

  const userBoards: Board[] = boards || [];

  return <DashboardClient user={session.user} boards={userBoards} />;
}
