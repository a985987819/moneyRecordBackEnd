export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoalRequest {
  name: string;
  targetAmount: number;
  deadline?: string;
  icon: string;
  color: string;
}

export interface SavingsGoalResponse {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepositRequest {
  amount: number;
  remark?: string;
}

export interface WithdrawRequest {
  amount: number;
  remark?: string;
}

export interface SavingsSummary {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTarget: number;
  totalSaved: number;
}
