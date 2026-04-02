export interface Budget {
  id: string;
  year: number;
  month: number;
  amount: number;
  spent: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetRequest {
  amount: number;
  year?: number;
  month?: number;
}

export interface BudgetResponse {
  id: string;
  year: number;
  month: number;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number; // 已使用百分比
}

export interface BudgetStats {
  currentMonth: BudgetResponse | null;
  lastMonth: BudgetResponse | null;
  averageSpent: number;
}
