"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Board } from "@/lib/types";
import styles from "./dashboard.module.css";

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  boards: Board[];
}

export default function DashboardClient({
  user,
  boards,
}: DashboardClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    include_free_space: true,
  });

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("/api/boards/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.board) {
        router.push(`/board/${data.board.id}`);
        router.refresh();
      } else {
        alert(data.error || "Failed to create board");
      }
    } catch (error) {
      console.error("Error creating board:", error);
      alert("An error occurred while creating the board");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>🎯</span>
          <span>Bingoooal</span>
        </div>
        <div className={styles.userInfo}>
          {user.image && (
            <img
              src={user.image}
              alt={user.name || ""}
              className={styles.userAvatar}
            />
          )}
          <span className={styles.userName}>{user.name || user.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.welcome}>
          <h1>Welcome back, {user.name?.split(" ")[0] || "there"}!</h1>
          <p>Track your yearly goals with bingo boards</p>
        </div>

        <div className={styles.boardsSection}>
          <div className={styles.sectionHeader}>
            <h2>Your Boards</h2>
            <button
              onClick={() => setShowModal(true)}
              className={styles.createBtn}
            >
              + Create New Board
            </button>
          </div>

          {boards.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p>
                No boards yet. Create your first bingo board to get started!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={styles.createBoardBtn}
              >
                Create Your First Board
              </button>
            </div>
          ) : (
            <div className={styles.boardsGrid}>
              {boards.map((board) => (
                <div
                  key={board.id}
                  className={styles.boardCard}
                  onClick={() => router.push(`/board/${board.id}`)}
                >
                  <h3>{board.title}</h3>
                  <div className={styles.year}>{board.year}</div>
                  <div className={styles.stats}>
                    {board.locked ? "🔒 Locked" : "✏️ Editable"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Create New Board</h2>
              <button
                onClick={() => setShowModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateBoard}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Board Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., 2025 Goals"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  min="2020"
                  max="2100"
                  required
                />
              </div>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.include_free_space}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        include_free_space: e.target.checked,
                      })
                    }
                  />
                  <span>Include free space in center</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className={styles.submitBtn}
              >
                {isCreating ? "Creating..." : "Create Board"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
