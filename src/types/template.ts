export interface RecordTemplate {
  id: string;
  name: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon?: string;
  amount?: number;
  remark?: string;
  account: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateRequest {
  name: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon?: string;
  amount?: number;
  remark?: string;
  account: string;
}

export interface TemplateResponse {
  id: string;
  name: string;
  type: 'expense' | 'income';
  category: string;
  subCategory?: string;
  categoryIcon?: string;
  amount?: number;
  remark?: string;
  account: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseTemplateRequest {
  date?: string;
  amount?: number;
  remark?: string;
}
