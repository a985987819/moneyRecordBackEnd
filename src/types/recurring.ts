export interface RecurringRecord {
  id: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon?: string;
  amount: number;
  remark: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextExecuteDate: string;
  account: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringRecordRequest {
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon?: string;
  amount: number;
  remark: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  account: string;
}

export interface RecurringRecordResponse {
  id: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon?: string;
  amount: number;
  remark: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextExecuteDate: string;
  account: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringSummary {
  totalActive: number;
  totalInactive: number;
  monthlyTotal: number;
}
