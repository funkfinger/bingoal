"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Board, Goal } from "@/lib/types";
import gridStyles from "./board-grid.module.css";
import {
  celebrateGoalCompletion,
  celebrateBingo,
  celebrateBoardCompletion,
} from "@/lib/confetti";
import exampleGoals from "@/data/example-goals.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface BoardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  board: Board;
  initialGoals: Goal[];
  isSharedView?: boolean;
}

export default function BoardClient({
  user,
  board,
  initialGoals,
  isSharedView = false,
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

  // Share modal
  const [showShareModal, setShowShareModal] = useState(false);
  const [isTogglingShare, setIsTogglingShare] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");

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
    // In shared view, only show details modal
    if (isSharedView) {
      const goal = goalMap.get(position);
      if (goal && !goal.is_free_space) {
        openGoalDetailsModal(goal);
      }
      return;
    }

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

  const handleToggleShare = async () => {
    setIsTogglingShare(true);

    try {
      const response = await fetch("/api/boards/toggle-share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: currentBoard.id,
          is_public: !currentBoard.is_public,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentBoard({ ...currentBoard, is_public: data.is_public });
        if (data.share_url) {
          setShareUrl(data.share_url);
        }
        router.refresh();
      } else {
        alert(data.error || "Failed to toggle share status");
      }
    } catch (error) {
      console.error("Error toggling share:", error);
      alert("An error occurred while toggling share status");
    } finally {
      setIsTogglingShare(false);
    }
  };

  const openShareModal = () => {
    // Generate share URL if board is already public
    if (currentBoard.is_public && currentBoard.share_token) {
      const baseUrl = window.location.origin;
      setShareUrl(
        `${baseUrl}/board/${currentBoard.id}?share=${currentBoard.share_token}`
      );
    }
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-purple to-accent-indigo">
      <header className="bg-white bg-opacity-95 px-6 py-4 flex justify-between items-center shadow-soft">
        <div
          className="flex items-center gap-3 text-2xl font-bold text-accent-purple cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => router.push("/dashboard")}
        >
          <span>🎯</span>
          <span>Bingoooal</span>
        </div>
        <div className="flex items-center gap-3">
          {user?.image && (
            <img
              src={user.image}
              alt={user.name || ""}
              className="w-9 h-9 rounded-full"
            />
          )}
          <span className="text-sm text-gray-800 hidden md:inline">
            {isSharedView
              ? "Viewing Shared Board"
              : user?.name || user?.email || "User"}
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {!isSharedView && (
          <div className="mb-5">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              ← Back to Dashboard
            </Button>
          </div>
        )}

        {isSharedView && (
          <div className="bg-secondary-100 border-2 border-secondary-300 text-secondary-800 px-6 py-4 rounded-lg mb-6 text-center font-medium">
            👁️ You are viewing a shared board in read-only mode
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h1 className="text-gray-800 m-0 mb-2 text-3xl font-bold">
                {currentBoard.title}
              </h1>
              <p className="text-gray-600 m-0 text-base">{currentBoard.year}</p>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              {isSharedView ? (
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  👁️ Read-Only
                </Badge>
              ) : (
                <>
                  {currentBoard.locked ? (
                    <Badge className="px-4 py-2 text-sm bg-success-light bg-opacity-10 text-success-dark border-2 border-success-light">
                      🔒 Locked
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => setShowLockConfirm(true)}
                      className="bg-success-light hover:bg-success"
                      disabled={goals.length < 25}
                      title={
                        goals.length < 25
                          ? `Add ${25 - goals.length} more goal(s) to lock`
                          : "Lock board to start tracking progress"
                      }
                    >
                      🔒 Lock Board
                    </Button>
                  )}
                  <Button onClick={openShareModal} variant="secondary">
                    🔗 Share
                  </Button>
                  <Button onClick={openEditModal}>✏️ Edit</Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                  >
                    🗑️ Delete
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Progress value={progress} className="mb-3" />
            <p className="text-gray-700 text-center font-medium">
              {completedCount} of {totalGoals} goals completed ({progress}%)
            </p>
          </CardContent>
        </Card>

        <div className={gridStyles.bingoGrid}>
          {Array.from({ length: 25 }, (_, i) => {
            const goal = goalMap.get(i);
            return (
              <div
                key={i}
                className={`${gridStyles.cell} ${
                  goal ? gridStyles.filled : gridStyles.empty
                } ${goal?.completed ? gridStyles.completed : ""} ${
                  goal?.is_free_space ? gridStyles.freeSpace : ""
                }`}
                onClick={() => handleCellClick(i)}
              >
                {goal ? (
                  <div className={gridStyles.goalContent}>
                    <span className={gridStyles.goalText}>
                      {goal.is_free_space ? "Free Space" : goal.text}
                    </span>
                  </div>
                ) : (
                  <span className={gridStyles.addIcon}>+</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            size="lg"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Goal Create/Edit Modal */}
      <Dialog open={showGoalModal} onOpenChange={setShowGoalModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedGoal ? "Edit Goal" : "Add Goal"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveGoal}>
            <div className="mb-5">
              <Label htmlFor="goal-text">Goal Description</Label>
              <Textarea
                id="goal-text"
                value={goalFormData.text}
                onChange={(e) =>
                  setGoalFormData({ ...goalFormData, text: e.target.value })
                }
                placeholder="Enter your goal..."
                maxLength={200}
                rows={4}
                required
                className="resize-none mt-2"
              />
              <div className="text-sm text-gray-500 mt-1 text-right">
                {goalFormData.text.length}/200 characters
              </div>
            </div>
            {!selectedGoal && goalFormData.text.length === 0 && (
              <Button
                type="button"
                onClick={getRandomGoal}
                className="w-full mb-4 bg-warning hover:bg-warning-dark"
              >
                ✨ Inspire Me
              </Button>
            )}
            <div className="mb-6 flex items-center space-x-2">
              <Checkbox
                id="free-space"
                checked={goalFormData.is_free_space}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setGoalFormData({
                    ...goalFormData,
                    is_free_space: isChecked,
                    text: isChecked ? "Free Space" : goalFormData.text,
                  });
                }}
              />
              <Label htmlFor="free-space" className="cursor-pointer">
                Mark as free space (auto-completed)
              </Label>
            </div>
            <DialogFooter>
              {selectedGoal && !selectedGoal.is_free_space && (
                <Button
                  type="button"
                  onClick={() => setShowGoalDeleteConfirm(true)}
                  variant="destructive"
                >
                  Delete Goal
                </Button>
              )}
              <Button type="submit" disabled={isGoalSaving}>
                {isGoalSaving
                  ? "Saving..."
                  : selectedGoal
                  ? "Save Changes"
                  : "Add Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Goal Delete Confirmation */}
      <Dialog
        open={showGoalDeleteConfirm && !!selectedGoal}
        onOpenChange={setShowGoalDeleteConfirm}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Delete Goal?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowGoalDeleteConfirm(false)}
              variant="outline"
              disabled={isGoalDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteGoal}
              variant="destructive"
              disabled={isGoalDeleting}
            >
              {isGoalDeleting ? "Deleting..." : "Delete Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lock Board Confirmation */}
      <Dialog open={showLockConfirm} onOpenChange={setShowLockConfirm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Lock Board?</DialogTitle>
            <DialogDescription>
              Once locked, you can only mark goals as complete. You won't be
              able to add, edit, or delete goals. This action cannot be undone.
              Are you ready to start tracking your progress?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowLockConfirm(false)}
              variant="outline"
              disabled={isLocking}
            >
              Cancel
            </Button>
            <Button onClick={handleLockBoard} disabled={isLocking}>
              {isLocking ? "Locking..." : "Lock Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Board Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditBoard}>
            <div className="mb-5">
              <Label htmlFor="edit-title">Board Title</Label>
              <Input
                type="text"
                id="edit-title"
                value={editFormData.title}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, title: e.target.value })
                }
                placeholder="e.g., 2025 Goals"
                required
                className="mt-2"
              />
            </div>
            <div className="mb-5">
              <Label htmlFor="edit-year">Year</Label>
              <Input
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
                className="mt-2"
              />
            </div>
            <Button type="submit" disabled={isEditing} className="w-full">
              {isEditing ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Share Board</DialogTitle>
            <DialogDescription>
              {currentBoard.is_public
                ? "Your board is currently public. Anyone with the link can view it."
                : "Enable sharing to generate a link that others can use to view your board."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-5">
            <div className="mb-6 flex items-center space-x-2">
              <Checkbox
                id="enable-sharing"
                checked={currentBoard.is_public}
                onCheckedChange={handleToggleShare}
                disabled={isTogglingShare}
              />
              <Label htmlFor="enable-sharing" className="cursor-pointer">
                Enable public sharing
              </Label>
            </div>
            {currentBoard.is_public && shareUrl && (
              <div>
                <Label className="mb-2">Share Link:</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 font-mono bg-gray-50"
                  />
                  <Button onClick={copyShareLink} className="whitespace-nowrap">
                    📋 Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Board?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentBoard.title}"? This
              action cannot be undone and will permanently delete all goals on
              this board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteConfirm(false)}
              variant="outline"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBoard}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Details Modal */}
      <Dialog
        open={showDetailsModal && !!selectedGoal}
        onOpenChange={setShowDetailsModal}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Goal Details</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <>
              <div className="py-5 space-y-4">
                <div>
                  <Label className="mb-2">Goal:</Label>
                  <div className="text-base text-gray-800">
                    {selectedGoal.is_free_space
                      ? "Free Space"
                      : selectedGoal.text}
                  </div>
                </div>
                <div>
                  <Label className="mb-2">Status:</Label>
                  <div className="text-base text-gray-800">
                    {selectedGoal.completed ? (
                      <Badge className="bg-success text-white">
                        ✓ Completed
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Completed</Badge>
                    )}
                  </div>
                </div>
                {selectedGoal.is_free_space && (
                  <div>
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">
                      🎁 This is a free space - it's automatically completed and
                      cannot be changed.
                    </p>
                  </div>
                )}
                {selectedGoal.completed_at && (
                  <div>
                    <Label className="mb-2">Completed on:</Label>
                    <p className="text-base text-gray-800">
                      {new Date(selectedGoal.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter className="pt-4 border-t-2 border-gray-100">
                {!selectedGoal.is_free_space && !isSharedView && (
                  <Button
                    onClick={async () => {
                      await handleToggleCompletion(selectedGoal);
                      setShowDetailsModal(false);
                    }}
                    className={
                      selectedGoal.completed
                        ? "bg-warning hover:bg-warning-dark"
                        : "bg-success hover:bg-success-dark"
                    }
                  >
                    {selectedGoal.completed
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </Button>
                )}
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  variant="outline"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
