/**
 * 通用类型定义
 * 包含项目中使用的共享类型和工具类型
 */

/**
 * 分页响应结构
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * API 标准响应结构
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

/**
 * API 错误结构
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

/**
 * 时间范围
 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * 金额范围
 */
export interface AmountRange {
  min?: number;
  max?: number;
}

/**
 * 排序参数
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: SortParams;
}

/**
 * 收支类型
 */
export type RecordType = 'expense' | 'income';

/**
 * 账户类型
 */
export type AccountType = 'cash' | 'bank' | 'credit' | 'alipay' | 'wechat' | 'investment' | 'other';

/**
 * 借贷类型
 */
export type DebtType = 'lend' | 'borrow';

/**
 * 目标状态
 */
export type GoalStatus = 'active' | 'completed' | 'cancelled';

/**
 * 债务状态
 */
export type DebtStatus = 'pending' | 'partial' | 'repaid';

/**
 * 重复频率
 */
export type RecurringFrequency = 'daily' | 'workday' | 'weekly' | 'monthly' | 'yearly';

/**
 * 提醒类型
 */
export type ReminderType = 'daily' | 'weekly' | 'monthly';

/**
 * 非空类型工具
 * 从类型 T 中移除 null 和 undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * 必填类型工具
 * 将类型 T 的所有属性变为必填
 */
export type Required<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * 可选类型工具
 * 将类型 T 的所有属性变为可选
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * 提取Promise返回值类型
 */
export type Awaited<T> = T extends Promise<infer R> ? R : T;
