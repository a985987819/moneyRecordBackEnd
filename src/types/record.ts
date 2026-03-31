export interface RecordItem {
  id: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string; // 格式: YYYY-MM-DD HH:mm:ss
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
  date: string | number; // 支持字符串(YYYY-MM-DD HH:mm:ss)或时间戳(毫秒)
  account: string;
}

export interface ImportRecordRequest {
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  date: string | number;
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

// 定时记账相关类型
export type RecurringFrequency = 'daily' | 'workday' | 'weekly' | 'monthly';

export interface RecurringRecordRequest {
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  account: string;
  frequency: RecurringFrequency;
  startDate: string;
  durationValue?: number;
  durationUnit?: 'month' | 'year';
}

export interface RecurringRecordResult {
  success: number;
  failed: number;
  generatedDates: string[];
  errors?: string[];
}

export interface GeneratedRecord {
  date: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon: string;
  amount: number;
  remark: string;
  account: string;
}

// 重复数据去重相关类型
export interface DuplicateRecord {
  id: string;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  date: string; // 格式: YYYY-MM-DD HH:mm:ss
  remark: string;
}

export interface DuplicateGroup {
  key: string;
  count: number;
  records: DuplicateRecord[];
  keepId: string;
}

export interface DeduplicateResult {
  scannedCount: number;
  duplicateGroups: DuplicateGroup[];
  totalDuplicates: number;
  deletedCount: number;
}

export interface DeduplicatePreviewResult {
  scannedCount: number;
  duplicateGroups: DuplicateGroup[];
  totalDuplicates: number;
}
