import type { ReminderRequest, ReminderResponse } from '../types/reminder';
import { BaseService } from '../utils/base.service';
export declare class ReminderService extends BaseService {
    private mapToResponse;
    getAllReminders(userId: number): Promise<ReminderResponse[]>;
    createReminder(userId: number, data: ReminderRequest): Promise<ReminderResponse>;
    updateReminder(userId: number, id: string, data: Partial<ReminderRequest>): Promise<ReminderResponse | null>;
    deleteReminder(userId: number, id: string): Promise<boolean>;
    toggleReminder(userId: number, id: string): Promise<ReminderResponse | null>;
}
export declare const reminderService: ReminderService;
//# sourceMappingURL=reminder.service.d.ts.map