// Database types for Bingoal

export interface Board {
  id: string;
  user_id: string;
  title: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  board_id: string;
  position: number; // 0-24 for 5x5 grid
  text: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// API request/response types
export interface CreateBoardRequest {
  title: string;
  year: number;
}

export interface CreateBoardResponse {
  success: boolean;
  board?: Board;
  error?: string;
}

export interface CreateGoalRequest {
  board_id: string;
  position: number;
  text: string;
}

export interface UpdateGoalRequest {
  text?: string;
  completed?: boolean;
}

