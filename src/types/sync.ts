export interface SyncData {
  records: any[];
  categories: any[];
  accounts: any[];
  savingsGoals: any[];
  debts: any[];
  budgets: any[];
  templates: any[];
  recurringRecords: any[];
  lastSyncTime?: string;
}

export interface SyncVersion {
  id: string;
  version: number;
  createdAt: string;
  recordCount: number;
  size: number;
}

export interface SyncUploadResponse {
  version: number;
  message: string;
  recordCount: number;
}

export interface SyncDownloadResponse {
  data: SyncData;
  version: number;
  syncedAt: string;
}
