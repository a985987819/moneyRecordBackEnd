import type { AuthContext } from '../middleware/auth.middleware';
export declare class BudgetController {
    getCurrentBudget(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        budget: null;
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        budget: {
            id: string;
            year: number;
            month: number;
            amount: number;
            spent: number;
            remaining: number;
            percentage: number;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getBudgetByMonth(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        budget: null;
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        budget: {
            id: string;
            year: number;
            month: number;
            amount: number;
            spent: number;
            remaining: number;
            percentage: number;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    setBudget(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        budget: {
            id: string;
            year: number;
            month: number;
            amount: number;
            spent: number;
            remaining: number;
            percentage: number;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteBudget(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getBudgetStats(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        currentMonth: {
            id: string;
            year: number;
            month: number;
            amount: number;
            spent: number;
            remaining: number;
            percentage: number;
        } | null;
        lastMonth: {
            id: string;
            year: number;
            month: number;
            amount: number;
            spent: number;
            remaining: number;
            percentage: number;
        } | null;
        averageSpent: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getRecentBudgets(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        budgets: {
            id: string;
            year: number;
            month: number;
            amount: number;
            spent: number;
            remaining: number;
            percentage: number;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const budgetController: BudgetController;
//# sourceMappingURL=budget.controller.d.ts.map