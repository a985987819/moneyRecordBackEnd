import type { Context } from 'hono';
export declare class DebtController {
    getAllDebts(c: Context): Promise<(Response & import("hono").TypedResponse<{
        debts: {
            id: string;
            type: "lend" | "borrow";
            personName: string;
            amount: number;
            repaidAmount: number;
            remainingAmount: number;
            date: string;
            expectedRepayDate?: string | undefined;
            remark?: string | undefined;
            status: "pending" | "partial" | "repaid";
            progress: number;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createDebt(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        debt: {
            id: string;
            type: "lend" | "borrow";
            personName: string;
            amount: number;
            repaidAmount: number;
            remainingAmount: number;
            date: string;
            expectedRepayDate?: string | undefined;
            remark?: string | undefined;
            status: "pending" | "partial" | "repaid";
            progress: number;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateDebt(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        debt: {
            id: string;
            type: "lend" | "borrow";
            personName: string;
            amount: number;
            repaidAmount: number;
            remainingAmount: number;
            date: string;
            expectedRepayDate?: string | undefined;
            remark?: string | undefined;
            status: "pending" | "partial" | "repaid";
            progress: number;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteDebt(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    repay(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        debt: {
            id: string;
            type: "lend" | "borrow";
            personName: string;
            amount: number;
            repaidAmount: number;
            remainingAmount: number;
            date: string;
            expectedRepayDate?: string | undefined;
            remark?: string | undefined;
            status: "pending" | "partial" | "repaid";
            progress: number;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getSummary(c: Context): Promise<(Response & import("hono").TypedResponse<{
        summary: {
            totalLend: number;
            totalBorrow: number;
            netLend: number;
            pendingLend: number;
            pendingBorrow: number;
            repaidLend: number;
            repaidBorrow: number;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const debtController: DebtController;
//# sourceMappingURL=debt.controller.d.ts.map