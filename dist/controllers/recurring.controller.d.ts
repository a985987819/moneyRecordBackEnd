import type { Context } from 'hono';
export declare class RecurringController {
    getAllRecurring(c: Context): Promise<(Response & import("hono").TypedResponse<{
        records: {
            id: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount: number;
            remark: string;
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            startDate: string;
            endDate?: string | undefined;
            nextExecuteDate: string;
            account: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createRecurring(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        record: {
            id: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount: number;
            remark: string;
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            startDate: string;
            endDate?: string | undefined;
            nextExecuteDate: string;
            account: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateRecurring(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        record: {
            id: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount: number;
            remark: string;
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            startDate: string;
            endDate?: string | undefined;
            nextExecuteDate: string;
            account: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteRecurring(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    toggleRecurring(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        record: {
            id: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount: number;
            remark: string;
            frequency: "daily" | "weekly" | "monthly" | "yearly";
            startDate: string;
            endDate?: string | undefined;
            nextExecuteDate: string;
            account: string;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getSummary(c: Context): Promise<(Response & import("hono").TypedResponse<{
        summary: {
            totalActive: number;
            totalInactive: number;
            monthlyTotal: number;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const recurringController: RecurringController;
//# sourceMappingURL=recurring.controller.d.ts.map