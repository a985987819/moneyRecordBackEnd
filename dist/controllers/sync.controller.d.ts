import type { Context } from 'hono';
export declare class SyncController {
    uploadData(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        syncedAt: string;
        version: number;
        message: string;
        recordCount: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    downloadData(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        data: {
            records: any[];
            categories: any[];
            accounts: any[];
            savingsGoals: any[];
            debts: any[];
            budgets: any[];
            templates: any[];
            recurringRecords: any[];
            lastSyncTime?: string | undefined;
        };
        version: number;
        syncedAt: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getVersions(c: Context): Promise<(Response & import("hono").TypedResponse<{
        versions: {
            id: string;
            version: number;
            createdAt: string;
            recordCount: number;
            size: number;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    restoreVersion(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
        data: {
            records: any[];
            categories: any[];
            accounts: any[];
            savingsGoals: any[];
            debts: any[];
            budgets: any[];
            templates: any[];
            recurringRecords: any[];
            lastSyncTime?: string | undefined;
        };
        version: number;
        syncedAt: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const syncController: SyncController;
//# sourceMappingURL=sync.controller.d.ts.map