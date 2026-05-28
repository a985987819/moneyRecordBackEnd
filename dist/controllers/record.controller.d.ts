import type { Context } from 'hono';
export declare class RecordController {
    getMonthlyStats(c: Context): Promise<(Response & import("hono").TypedResponse<{
        totalExpense: number;
        totalIncome: number;
        budget: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getRecentRecords(c: Context): Promise<(Response & import("hono").TypedResponse<{
        id: string;
        type: "expense" | "income";
        category: string;
        subCategory?: string | undefined;
        categoryIcon: string;
        amount: number;
        remark: string;
        date: string;
        account: string;
        isImport?: boolean | undefined;
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getRecords(c: Context): Promise<(Response & import("hono").TypedResponse<{
        id: string;
        type: "expense" | "income";
        category: string;
        subCategory?: string | undefined;
        categoryIcon: string;
        amount: number;
        remark: string;
        date: string;
        account: string;
        isImport?: boolean | undefined;
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getRecordsByDate(c: Context): Promise<(Response & import("hono").TypedResponse<{
        data: {
            date: string;
            records: {
                id: string;
                type: "expense" | "income";
                category: string;
                subCategory?: string | undefined;
                categoryIcon: string;
                amount: number;
                remark: string;
                date: string;
                account: string;
                isImport?: boolean | undefined;
            }[];
        }[];
        hasMore: boolean;
        nextCursor?: string | undefined;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getReport(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalExpense: number;
            totalIncome: number;
            balance: number;
        };
        dailyStats: {
            date: string;
            expense: number;
            income: number;
        }[];
        categoryStats: {
            expense: {
                category: string;
                categoryIcon: string;
                type: "expense" | "income";
                amount: number;
                percentage: number;
                count: number;
            }[];
            income: {
                category: string;
                categoryIcon: string;
                type: "expense" | "income";
                amount: number;
                percentage: number;
                count: number;
            }[];
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getBills(c: Context): Promise<(Response & import("hono").TypedResponse<{
        summary: {
            totalExpense: number;
            totalIncome: number;
            count: number;
        };
        records: {
            id: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon: string;
            amount: number;
            remark: string;
            date: string;
            account: string;
            isImport?: boolean | undefined;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    batchImport(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        success: number;
        failed: number;
        errors?: string[] | undefined;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteImportRecords(c: Context): Promise<(Response & import("hono").TypedResponse<{
        deletedCount: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createRecord(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        type: "expense" | "income";
        category: string;
        subCategory?: string | undefined;
        categoryIcon: string;
        amount: number;
        remark: string;
        date: string;
        account: string;
        isImport?: boolean | undefined;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateRecord(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        type: "expense" | "income";
        category: string;
        subCategory?: string | undefined;
        categoryIcon: string;
        amount: number;
        remark: string;
        date: string;
        account: string;
        isImport?: boolean | undefined;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteRecord(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createRecurringRecords(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        success: number;
        failed: number;
        generatedDates: string[];
        errors?: string[] | undefined;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    previewDuplicates(c: Context): Promise<(Response & import("hono").TypedResponse<{
        scannedCount: number;
        duplicateGroups: {
            key: string;
            count: number;
            records: {
                id: string;
                type: "expense" | "income";
                category: string;
                amount: number;
                date: string;
                remark: string;
            }[];
            keepId: string;
        }[];
        totalDuplicates: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deduplicateRecords(c: Context): Promise<(Response & import("hono").TypedResponse<{
        scannedCount: number;
        duplicateGroups: {
            key: string;
            count: number;
            records: {
                id: string;
                type: "expense" | "income";
                category: string;
                amount: number;
                date: string;
                remark: string;
            }[];
            keepId: string;
        }[];
        totalDuplicates: number;
        deletedCount: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const recordController: RecordController;
//# sourceMappingURL=record.controller.d.ts.map