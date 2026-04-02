export interface Reminder {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  time: string;
  message?: string;
  isEnabled: boolean;
  daysOfWeek?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ReminderRequest {
  type: 'daily' | 'weekly' | 'monthly';
  time: string;
  message?: string;
  daysOfWeek?: number[];
}

export interface ReminderResponse {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  time: string;
  message?: string;
  isEnabled: boolean;
  daysOfWeek?: number[];
  createdAt: string;
  updatedAt: string;
}
