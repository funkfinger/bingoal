// Database types for Bingoooal

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
  is_free_space: boolean; // Free space goals are auto-completed and cannot be edited/deleted
  created_at: string;
  updated_at: string;
}

// API request/response types
export interface CreateBoardRequest {
  title: string;
  year: number;
  include_free_space?: boolean;
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
  is_free_space?: boolean;
}

export interface UpdateGoalRequest {
  text?: string;
  completed?: boolean;
  is_free_space?: boolean;
}
