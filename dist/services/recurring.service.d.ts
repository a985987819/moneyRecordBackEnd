import type { RecurringRecordRequest, RecurringRecordResponse, RecurringSummary } from '../types/recurring';
import { BaseService } from '../utils/base.service';
export declare class RecurringService extends BaseService {
    private mapToResponse;
    private calculateNextDate;
    getAllRecurring(userId: number): Promise<RecurringRecordResponse[]>;
    createRecurring(userId: number, data: RecurringRecordRequest): Promise<RecurringRecordResponse>;
    updateRecurring(userId: number, id: string, data: Partial<RecurringRecordRequest>): Promise<RecurringRecordResponse | null>;
    deleteRecurring(userId: number, id: string): Promise<boolean>;
    toggleRecurring(userId: number, id: string): Promise<RecurringRecordResponse | null>;
    getSummary(userId: number): Promise<RecurringSummary>;
}
export declare const recurringService: RecurringService;
//# sourceMappingURL=recurring.service.d.ts.map