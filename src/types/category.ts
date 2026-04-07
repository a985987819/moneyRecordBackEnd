/**
 * 分类模块类型定义
 */

/**
 * 分类类型
 */
export type CategoryType = 'expense' | 'income' | 'transfer' | 'debt' | 'reimbursement';

/**
 * 分类项
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 创建/更新分类请求
 */
export interface CategoryRequest {
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
}

/**
 * 分类响应（给前端）
 */
export interface CategoryResponse {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 分类统计
 */
export interface CategoryStats {
  category: string;
  categoryIcon: string;
  type: 'expense' | 'income';
  amount: number;
  percentage: number;
  count: number;
}

/**
 * 默认分类配置
 */
export interface DefaultCategory {
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
}
