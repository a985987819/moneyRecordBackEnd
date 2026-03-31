export interface RecordItem {
  id: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string;
  account: string;
  isImport?: boolean;
}

export interface MonthlyStats {
  totalExpense: number;
  totalIncome: number;
  budget: number;
}

export interface RecordRequest {
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string;
  account: string;
}

export interface ImportRecordRequest {
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
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

export interface RecordsByDate {
  date: string;
  records: RecordItem[];
}

export interface PaginatedRecordsResponse {
  data: RecordsByDate[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface BatchImportResult {
  success: number;
  failed: number;
  errors?: string[];
}

// 报表统计相关类型
export interface DailyStats {
  date: string;
  expense: number;
  income: number;
}

export interface CategoryStats {
  category: string;
  categoryIcon: string;
  type: 'expense' | 'income';
  amount: number;
  percentage: number;
  count: number;
}

export interface ReportData {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalExpense: number;
    totalIncome: number;
    balance: number;
  };
  dailyStats: DailyStats[];
  categoryStats: {
    expense: CategoryStats[];
    income: CategoryStats[];
  };
}

// 账单筛选参数
export interface BillFilterParams {
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
  type?: 'expense' | 'income';
  categories?: string[];
  minAmount?: number;
  maxAmount?: number;
}

export interface BillListResponse {
  summary: {
    totalExpense: number;
    totalIncome: number;
    count: number;
  };
  records: RecordItem[];
}
