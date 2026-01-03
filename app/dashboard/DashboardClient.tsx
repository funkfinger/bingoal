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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    include_free_space: true,
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
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

  const handleEditBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoard) return;

    setIsEditing(true);

    try {
      const response = await fetch("/api/boards/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: selectedBoard.id,
          title: editFormData.title,
          year: editFormData.year,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowEditModal(false);
        router.refresh();
      } else {
        alert(data.error || "Failed to update board");
      }
    } catch (error) {
      console.error("Error updating board:", error);
      alert("An error occurred while updating the board");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/boards/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_id: selectedBoard.id }),
      });

      const data = await response.json();

      if (data.success) {
        setShowDeleteConfirm(false);
        router.refresh();
      } else {
        alert(data.error || "Failed to delete board");
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("An error occurred while deleting the board");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setEditFormData({
      title: board.title,
      year: board.year,
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (board: Board, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setShowDeleteConfirm(true);
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
                <div key={board.id} className={styles.boardCard}>
                  <div
                    className={styles.boardCardContent}
                    onClick={() => router.push(`/board/${board.id}`)}
                  >
                    <h3>{board.title}</h3>
                    <div className={styles.year}>{board.year}</div>
                    <div className={styles.stats}>
                      {board.locked ? "🔒 Locked" : "✏️ Editable"}
                    </div>
                  </div>
                  <div className={styles.boardCardActions}>
                    <button
                      onClick={(e) => openEditModal(board, e)}
                      className={styles.boardEditBtn}
                      title="Edit board"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => openDeleteConfirm(board, e)}
                      className={styles.boardDeleteBtn}
                      title="Delete board"
                    >
                      🗑️
                    </button>
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

      {/* Edit Board Modal */}
      {showEditModal && selectedBoard && (
        <div className={styles.modal} onClick={() => setShowEditModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Edit Board</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditBoard}>
              <div className={styles.formGroup}>
                <label htmlFor="edit-title">Board Title</label>
                <input
                  type="text"
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  placeholder="e.g., 2025 Goals"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-year">Year</label>
                <input
                  type="number"
                  id="edit-year"
                  value={editFormData.year}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      year: parseInt(e.target.value),
                    })
                  }
                  min="1900"
                  max="2100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isEditing}
                className={styles.submitBtn}
              >
                {isEditing ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBoard && (
        <div
          className={styles.modal}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Delete Board?</h2>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <p className={styles.confirmText}>
              Are you sure you want to delete "{selectedBoard.title}"? This
              action cannot be undone and will permanently delete all goals on
              this board.
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelBtn}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBoard}
                className={styles.confirmDeleteBtn}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Board"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
