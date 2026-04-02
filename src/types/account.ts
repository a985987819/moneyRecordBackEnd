export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'alipay' | 'wechat' | 'credit' | 'other';
  icon: string;
  balance: number;
  initialBalance: number;
  isDefault: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRequest {
  name: string;
  type: 'cash' | 'bank' | 'alipay' | 'wechat' | 'credit' | 'other';
  icon: string;
  initialBalance: number;
  isDefault?: boolean;
  color?: string;
}

export interface AccountResponse {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'alipay' | 'wechat' | 'credit' | 'other';
  icon: string;
  balance: number;
  initialBalance: number;
  isDefault: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustBalanceRequest {
  newBalance: number;
  remark?: string;
}

export interface AccountSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  byType: Record<string, number>;
}
