import type { Goal } from "./types";

/**
 * Check if a specific position completing creates a new bingo
 * Returns the type of bingo: 'row', 'column', 'diagonal', or null
 */
export function checkForNewBingo(
  goals: Goal[],
  completedPosition: number
): "row" | "column" | "diagonal" | null {
  // Create a map of position -> completed status
  const completedMap = new Map<number, boolean>();
  goals.forEach((goal) => {
    completedMap.set(goal.position, goal.completed);
  });

  const row = Math.floor(completedPosition / 5);
  const col = completedPosition % 5;

  // Check row
  let rowComplete = true;
  for (let c = 0; c < 5; c++) {
    const pos = row * 5 + c;
    if (!completedMap.get(pos)) {
      rowComplete = false;
      break;
    }
  }

  // Check column
  let colComplete = true;
  for (let r = 0; r < 5; r++) {
    const pos = r * 5 + col;
    if (!completedMap.get(pos)) {
      colComplete = false;
      break;
    }
  }

  // Check diagonal (top-left to bottom-right)
  let diag1Complete = false;
  if (row === col) {
    diag1Complete = true;
    for (let i = 0; i < 5; i++) {
      const pos = i * 5 + i;
      if (!completedMap.get(pos)) {
        diag1Complete = false;
        break;
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  let diag2Complete = false;
  if (row + col === 4) {
    diag2Complete = true;
    for (let i = 0; i < 5; i++) {
      const pos = i * 5 + (4 - i);
      if (!completedMap.get(pos)) {
        diag2Complete = false;
        break;
      }
    }
  }

  // Return the first bingo type found
  if (rowComplete) return "row";
  if (colComplete) return "column";
  if (diag1Complete || diag2Complete) return "diagonal";

  return null;
}

/**
 * Check if the entire board is completed
 */
export function isBoardComplete(goals: Goal[]): boolean {
  // A board is complete if all 25 positions have completed goals
  if (goals.length !== 25) return false;

  return goals.every((goal) => goal.completed);
}

/**
 * Get all completed bingos on the board
 * Returns an array of bingo types
 */
export function getAllBingos(
  goals: Goal[]
): Array<{ type: "row" | "column" | "diagonal"; index: number }> {
  const bingos: Array<{ type: "row" | "column" | "diagonal"; index: number }> =
    [];

  // Create a map of position -> completed status
  const completedMap = new Map<number, boolean>();
  goals.forEach((goal) => {
    completedMap.set(goal.position, goal.completed);
  });

  // Check all rows
  for (let row = 0; row < 5; row++) {
    let rowComplete = true;
    for (let col = 0; col < 5; col++) {
      const pos = row * 5 + col;
      if (!completedMap.get(pos)) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) {
      bingos.push({ type: "row", index: row });
    }
  }

  // Check all columns
  for (let col = 0; col < 5; col++) {
    let colComplete = true;
    for (let row = 0; row < 5; row++) {
      const pos = row * 5 + col;
      if (!completedMap.get(pos)) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) {
      bingos.push({ type: "column", index: col });
    }
  }

  // Check diagonal (top-left to bottom-right)
  let diag1Complete = true;
  for (let i = 0; i < 5; i++) {
    const pos = i * 5 + i;
    if (!completedMap.get(pos)) {
      diag1Complete = false;
      break;
    }
  }
  if (diag1Complete) {
    bingos.push({ type: "diagonal", index: 0 });
  }

  // Check diagonal (top-right to bottom-left)
  let diag2Complete = true;
  for (let i = 0; i < 5; i++) {
    const pos = i * 5 + (4 - i);
    if (!completedMap.get(pos)) {
      diag2Complete = false;
      break;
    }
  }
  if (diag2Complete) {
    bingos.push({ type: "diagonal", index: 1 });
  }

  return bingos;
}
