export interface RecordItem {
  id: string;
  type: 'expense' | 'income';
  category: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string;
  account: string;
}

export interface MonthlyStats {
  totalExpense: number;
  totalIncome: number;
  budget: number;
}

export interface RecordRequest {
  type: 'expense' | 'income';
  category: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string;
  account: string;
}

export interface RecordQueryParams {
  startDate?: string;
  endDate?: string;
  type?: string;
}
