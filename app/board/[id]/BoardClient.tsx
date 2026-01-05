"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Board, Goal } from "@/lib/types";
import styles from "./board.module.css";
import {
  celebrateGoalCompletion,
  celebrateBingo,
  celebrateBoardCompletion,
} from "@/lib/confetti";
import exampleGoals from "@/data/example-goals.json";

interface BoardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  board: Board;
  initialGoals: Goal[];
}

export default function BoardClient({
  user,
  board,
  initialGoals,
}: BoardClientProps) {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [currentBoard, setCurrentBoard] = useState<Board>(board);

  // Board edit/delete modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: board.title,
    year: board.year,
  });

  // Goal management modals
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showGoalDeleteConfirm, setShowGoalDeleteConfirm] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalSaving, setIsGoalSaving] = useState(false);
  const [isGoalDeleting, setIsGoalDeleting] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [goalFormData, setGoalFormData] = useState({
    text: "",
    is_free_space: false,
  });

  // Create a map of position to goal for easy lookup
  const goalMap = new Map<number, Goal>();
  goals.forEach((goal) => {
    goalMap.set(goal.position, goal);
  });

  // Calculate progress
  const completedCount = goals.filter((g) => g.completed).length;
  const totalGoals = 25;
  const progress = Math.round((completedCount / totalGoals) * 100);

  const handleCellClick = (position: number) => {
    const goal = goalMap.get(position);
    if (goal) {
      // If board is locked, show details modal (unless it's a free space - do nothing)
      if (currentBoard.locked) {
        if (goal.is_free_space) {
          // Do nothing for free space goals
          return;
        } else {
          // Show details modal for regular goals
          openGoalDetailsModal(goal);
        }
      } else {
        // If board is unlocked, open edit modal
        openGoalEditModal(goal);
      }
    } else {
      // Open create goal modal for empty cell (only if unlocked)
      if (!currentBoard.locked) {
        openGoalCreateModal(position);
      }
    }
  };

  const openGoalDetailsModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setShowDetailsModal(true);
  };

  const openGoalCreateModal = (position: number) => {
    setSelectedPosition(position);
    setSelectedGoal(null);
    // Get a random example goal as placeholder
    const randomGoal =
      exampleGoals[Math.floor(Math.random() * exampleGoals.length)];
    setGoalFormData({
      text: randomGoal,
      is_free_space: false,
    });
    setShowGoalModal(true);
  };

  const openGoalEditModal = (goal: Goal) => {
    setSelectedGoal(goal);
    setSelectedPosition(goal.position);
    setGoalFormData({
      text: goal.text,
      is_free_space: goal.is_free_space,
    });
    setShowGoalModal(true);
  };

  const getRandomGoal = () => {
    const randomGoal =
      exampleGoals[Math.floor(Math.random() * exampleGoals.length)];
    setGoalFormData({ ...goalFormData, text: randomGoal });
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPosition === null) return;

    setIsGoalSaving(true);

    try {
      if (selectedGoal) {
        // Update existing goal
        const response = await fetch("/api/goals/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal_id: selectedGoal.id,
            text: goalFormData.text,
            is_free_space: goalFormData.is_free_space,
          }),
        });

        const data = await response.json();

        if (data.success && data.goal) {
          setGoals((prev) =>
            prev.map((g) => (g.id === data.goal.id ? data.goal : g))
          );
          setShowGoalModal(false);
        } else {
          alert(data.error || "Failed to update goal");
        }
      } else {
        // Create new goal
        const response = await fetch("/api/goals/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            board_id: currentBoard.id,
            position: selectedPosition,
            text: goalFormData.text,
            is_free_space: goalFormData.is_free_space,
          }),
        });

        const data = await response.json();

        if (data.success && data.goal) {
          setGoals((prev) => [...prev, data.goal]);
          setShowGoalModal(false);
        } else {
          alert(data.error || "Failed to create goal");
        }
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("An error occurred while saving the goal");
    } finally {
      setIsGoalSaving(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;

    setIsGoalDeleting(true);

    try {
      const response = await fetch("/api/goals/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal_id: selectedGoal.id }),
      });

      const data = await response.json();

      if (data.success) {
        setGoals((prev) => prev.filter((g) => g.id !== selectedGoal.id));
        setShowGoalDeleteConfirm(false);
        setShowGoalModal(false);
      } else {
        alert(data.error || "Failed to delete goal");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("An error occurred while deleting the goal");
    } finally {
      setIsGoalDeleting(false);
    }
  };

  const handleToggleCompletion = async (goal: Goal) => {
    // Prevent toggling completion of free space goals
    if (goal.is_free_space) {
      return;
    }

    const newCompletedStatus = !goal.completed;

    try {
      const response = await fetch("/api/goals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: goal.id,
          completed: newCompletedStatus,
        }),
      });

      const data = await response.json();

      if (data.success && data.goal) {
        setGoals((prev) =>
          prev.map((g) => (g.id === data.goal.id ? data.goal : g))
        );

        // Trigger confetti animations
        if (newCompletedStatus) {
          celebrateGoalCompletion();

          if (data.bingoType) {
            setTimeout(() => celebrateBingo(), 500);
          }

          if (data.boardComplete) {
            setTimeout(() => celebrateBoardCompletion(), 1000);
          }
        }
      } else {
        alert(data.error || "Failed to update goal");
      }
    } catch (error) {
      console.error("Error toggling goal completion:", error);
      alert("An error occurred while updating the goal");
    }
  };

  const handleLockBoard = async () => {
    setIsLocking(true);

    try {
      const response = await fetch("/api/boards/toggle-lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: currentBoard.id,
          locked: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentBoard({ ...currentBoard, locked: true });
        setShowLockConfirm(false);
        router.refresh();
      } else {
        alert(data.error || "Failed to lock board");
      }
    } catch (error) {
      console.error("Error locking board:", error);
      alert("An error occurred while locking the board");
    } finally {
      setIsLocking(false);
    }
  };

  const handleEditBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const response = await fetch("/api/boards/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: currentBoard.id,
          title: editFormData.title,
          year: editFormData.year,
        }),
      });

      const data = await response.json();

      if (data.success && data.board) {
        setCurrentBoard(data.board);
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
    setIsDeleting(true);

    try {
      const response = await fetch("/api/boards/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_id: currentBoard.id }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert(data.error || "Failed to delete board");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      alert("An error occurred while deleting the board");
      setIsDeleting(false);
    }
  };

  const openEditModal = () => {
    setEditFormData({
      title: currentBoard.title,
      year: currentBoard.year,
    });
    setShowEditModal(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => router.push("/dashboard")}>
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
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.backButtonTop}>
          <button
            onClick={() => router.push("/dashboard")}
            className={styles.backBtn}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className={styles.boardHeader}>
          <div>
            <h1>{currentBoard.title}</h1>
            <p className={styles.year}>{currentBoard.year}</p>
          </div>
          <div className={styles.headerActions}>
            {currentBoard.locked ? (
              <span className={styles.lockedBadge}>🔒 Locked</span>
            ) : (
              <button
                onClick={() => setShowLockConfirm(true)}
                className={styles.lockBtn}
                disabled={goals.length < 25}
                title={
                  goals.length < 25
                    ? `Add ${25 - goals.length} more goal(s) to lock`
                    : "Lock board to start tracking progress"
                }
              >
                🔒 Lock Board
              </button>
            )}
            <button onClick={openEditModal} className={styles.editBtn}>
              ✏️ Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className={styles.deleteBtn}
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {completedCount} of {totalGoals} goals completed ({progress}%)
          </p>
        </div>

        <div className={styles.bingoGrid}>
          {Array.from({ length: 25 }, (_, i) => {
            const goal = goalMap.get(i);
            return (
              <div
                key={i}
                className={`${styles.cell} ${
                  goal ? styles.filled : styles.empty
                } ${goal?.completed ? styles.completed : ""} ${
                  goal?.is_free_space ? styles.freeSpace : ""
                }`}
                onClick={() => handleCellClick(i)}
              >
                {goal ? (
                  <div className={styles.goalContent}>
                    <span className={styles.goalText}>
                      {goal.is_free_space ? "Free Space" : goal.text}
                    </span>
                  </div>
                ) : (
                  <span className={styles.addIcon}>+</span>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => router.push("/dashboard")}
            className={styles.backBtn}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Goal Create/Edit Modal */}
      {showGoalModal && (
        <div className={styles.modal} onClick={() => setShowGoalModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>{selectedGoal ? "Edit Goal" : "Add Goal"}</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSaveGoal}>
              <div className={styles.formGroup}>
                <label htmlFor="goal-text">Goal Description</label>
                <textarea
                  id="goal-text"
                  value={goalFormData.text}
                  onChange={(e) =>
                    setGoalFormData({ ...goalFormData, text: e.target.value })
                  }
                  placeholder="Enter your goal..."
                  maxLength={200}
                  rows={4}
                  required
                  className={styles.textarea}
                />
                <div className={styles.charCount}>
                  {goalFormData.text.length}/200 characters
                </div>
              </div>
              {!selectedGoal && goalFormData.text.length === 0 && (
                <button
                  type="button"
                  onClick={getRandomGoal}
                  className={styles.inspireBtn}
                >
                  ✨ Inspire Me
                </button>
              )}
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={goalFormData.is_free_space}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setGoalFormData({
                        ...goalFormData,
                        is_free_space: isChecked,
                        // Automatically set text to "Free Space" when checking the box
                        text: isChecked ? "Free Space" : goalFormData.text,
                      });
                    }}
                  />
                  <span>Mark as free space (auto-completed)</span>
                </label>
              </div>
              <div className={styles.modalActions}>
                {selectedGoal && !selectedGoal.is_free_space && (
                  <button
                    type="button"
                    onClick={() => setShowGoalDeleteConfirm(true)}
                    className={styles.deleteGoalBtn}
                  >
                    Delete Goal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isGoalSaving}
                  className={styles.submitBtn}
                >
                  {isGoalSaving
                    ? "Saving..."
                    : selectedGoal
                    ? "Save Changes"
                    : "Add Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goal Delete Confirmation */}
      {showGoalDeleteConfirm && selectedGoal && (
        <div
          className={styles.modal}
          onClick={() => setShowGoalDeleteConfirm(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Delete Goal?</h2>
              <button
                onClick={() => setShowGoalDeleteConfirm(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <p className={styles.confirmText}>
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setShowGoalDeleteConfirm(false)}
                className={styles.cancelBtn}
                disabled={isGoalDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGoal}
                className={styles.confirmDeleteBtn}
                disabled={isGoalDeleting}
              >
                {isGoalDeleting ? "Deleting..." : "Delete Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Board Confirmation */}
      {showLockConfirm && (
        <div className={styles.modal} onClick={() => setShowLockConfirm(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Lock Board?</h2>
              <button
                onClick={() => setShowLockConfirm(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <p className={styles.confirmText}>
              Once locked, you can only mark goals as complete. You won't be
              able to add, edit, or delete goals. This action cannot be undone.
              Are you ready to start tracking your progress?
            </p>
            <div className={styles.confirmActions}>
              <button
                onClick={() => setShowLockConfirm(false)}
                className={styles.cancelBtn}
                disabled={isLocking}
              >
                Cancel
              </button>
              <button
                onClick={handleLockBoard}
                className={styles.confirmBtn}
                disabled={isLocking}
              >
                {isLocking ? "Locking..." : "Lock Board"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Board Modal */}
      {showEditModal && (
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
      {showDeleteConfirm && (
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
              Are you sure you want to delete "{currentBoard.title}"? This
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

      {/* Goal Details Modal */}
      {showDetailsModal && selectedGoal && (
        <div
          className={styles.modal}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Goal Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className={styles.closeBtn}
              >
                ×
              </button>
            </div>
            <div className={styles.goalDetailsContent}>
              <div className={styles.detailsSection}>
                <label className={styles.detailsLabel}>Goal:</label>
                <div className={styles.detailsText}>
                  {selectedGoal.is_free_space
                    ? "Free Space"
                    : selectedGoal.text}
                </div>
              </div>
              <div className={styles.detailsSection}>
                <label className={styles.detailsLabel}>Status:</label>
                <div className={styles.detailsText}>
                  {selectedGoal.completed ? (
                    <span className={styles.completedBadge}>✓ Completed</span>
                  ) : (
                    <span className={styles.incompleteBadge}>
                      Not Completed
                    </span>
                  )}
                </div>
              </div>
              {selectedGoal.is_free_space && (
                <div className={styles.detailsSection}>
                  <p className={styles.freeSpaceNote}>
                    🎁 This is a free space - it's automatically completed and
                    cannot be changed.
                  </p>
                </div>
              )}
              {selectedGoal.completed_at && (
                <div className={styles.detailsSection}>
                  <label className={styles.detailsLabel}>Completed on:</label>
                  <p className={styles.detailsText}>
                    {new Date(selectedGoal.completed_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.modalActions}>
              {!selectedGoal.is_free_space && (
                <button
                  onClick={async () => {
                    await handleToggleCompletion(selectedGoal);
                    setShowDetailsModal(false);
                  }}
                  className={
                    selectedGoal.completed
                      ? styles.markIncompleteBtn
                      : styles.markCompleteBtn
                  }
                >
                  {selectedGoal.completed
                    ? "Mark as Incomplete"
                    : "Mark as Complete"}
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className={styles.cancelBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
