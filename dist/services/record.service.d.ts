import type { BatchImportResult, BillFilterParams, BillListResponse, DeduplicatePreviewResult, DeduplicateResult, ImportRecordRequest, MonthlyStats, PaginatedRecordsResponse, RecordItem, RecordQueryParams, RecordRequest, RecurringRecordRequest, RecurringRecordResult, ReportData } from '../types/record';
import { BaseService } from '../utils/base.service';
export declare class RecordService extends BaseService {
    getMonthlyStats(userId: number, month?: string): Promise<MonthlyStats>;
    getRecentRecords(userId: number): Promise<RecordItem[]>;
    getRecords(userId: number, params?: RecordQueryParams): Promise<RecordItem[]>;
    getRecordsByDatePaginated(userId: number, cursor?: string, limit?: number): Promise<PaginatedRecordsResponse>;
    getReportData(userId: number, year?: number, month?: number): Promise<ReportData>;
    getBillsWithFilter(userId: number, params: BillFilterParams): Promise<BillListResponse>;
    private generateRecurringDates;
    createRecurringRecords(userId: number, data: RecurringRecordRequest): Promise<RecurringRecordResult>;
    createRecord(userId: number, data: RecordRequest): Promise<RecordItem>;
    batchImportRecords(userId: number, records: ImportRecordRequest[]): Promise<BatchImportResult>;
    deleteImportRecords(userId: number): Promise<{
        deletedCount: number;
    }>;
    updateRecord(userId: number, id: string, data: Partial<RecordRequest>): Promise<RecordItem | null>;
    deleteRecord(userId: number, id: string): Promise<boolean>;
    getRecordById(userId: number, id: string): Promise<RecordItem | null>;
    findDuplicateRecords(userId: number): Promise<DeduplicatePreviewResult>;
    deduplicateRecords(userId: number): Promise<DeduplicateResult>;
}
export declare const recordService: RecordService;
//# sourceMappingURL=record.service.d.ts.map