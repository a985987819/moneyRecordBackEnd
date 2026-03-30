export type CategoryType = 'expense' | 'income' | 'transfer' | 'debt' | 'reimbursement';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
}

export interface CategoryRequest {
  name: string;
  icon: string;
  type: CategoryType;
  color?: string;
}
