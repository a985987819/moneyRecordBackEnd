export interface Debt {
  id: string;
  type: 'lend' | 'borrow';
  personName: string;
  amount: number;
  repaidAmount: number;
  remainingAmount: number;
  date: string;
  expectedRepayDate?: string;
  remark?: string;
  status: 'pending' | 'partial' | 'repaid';
  createdAt: string;
  updatedAt: string;
}

export interface DebtRequest {
  type: 'lend' | 'borrow';
  personName: string;
  amount: number;
  date: string;
  expectedRepayDate?: string;
  remark?: string;
}

export interface DebtResponse {
  id: string;
  type: 'lend' | 'borrow';
  personName: string;
  amount: number;
  repaidAmount: number;
  remainingAmount: number;
  date: string;
  expectedRepayDate?: string;
  remark?: string;
  status: 'pending' | 'partial' | 'repaid';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface RepayRequest {
  amount: number;
  remark?: string;
}

export interface DebtSummary {
  totalLend: number;
  totalBorrow: number;
  netLend: number;
  pendingLend: number;
  pendingBorrow: number;
  repaidLend: number;
  repaidBorrow: number;
}
