import type { Context } from 'hono';
export declare class SavingsController {
    getAllGoals(c: Context): Promise<(Response & import("hono").TypedResponse<{
        goals: {
            id: string;
            name: string;
            targetAmount: number;
            currentAmount: number;
            deadline?: string | undefined;
            icon: string;
            color: string;
            status: "active" | "completed" | "cancelled";
            progress: number;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createGoal(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        goal: {
            id: string;
            name: string;
            targetAmount: number;
            currentAmount: number;
            deadline?: string | undefined;
            icon: string;
            color: string;
            status: "active" | "completed" | "cancelled";
            progress: number;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateGoal(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        goal: {
            id: string;
            name: string;
            targetAmount: number;
            currentAmount: number;
            deadline?: string | undefined;
            icon: string;
            color: string;
            status: "active" | "completed" | "cancelled";
            progress: number;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteGoal(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deposit(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        goal: {
            id: string;
            name: string;
            targetAmount: number;
            currentAmount: number;
            deadline?: string | undefined;
            icon: string;
            color: string;
            status: "active" | "completed" | "cancelled";
            progress: number;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    withdraw(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        goal: {
            id: string;
            name: string;
            targetAmount: number;
            currentAmount: number;
            deadline?: string | undefined;
            icon: string;
            color: string;
            status: "active" | "completed" | "cancelled";
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
            totalGoals: number;
            activeGoals: number;
            completedGoals: number;
            totalTarget: number;
            totalSaved: number;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const savingsController: SavingsController;
//# sourceMappingURL=savings.controller.d.ts.map