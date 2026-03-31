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
