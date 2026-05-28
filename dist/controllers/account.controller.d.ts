import type { AuthContext } from '../middleware/auth.middleware';
export declare class AccountController {
    getAllAccounts(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        accounts: {
            id: string;
            name: string;
            type: "cash" | "bank" | "alipay" | "wechat" | "credit" | "other";
            icon: string;
            balance: number;
            initialBalance: number;
            isDefault: boolean;
            color?: string | undefined;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createAccount(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        account: {
            id: string;
            name: string;
            type: "cash" | "bank" | "alipay" | "wechat" | "credit" | "other";
            icon: string;
            balance: number;
            initialBalance: number;
            isDefault: boolean;
            color?: string | undefined;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateAccount(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        account: {
            id: string;
            name: string;
            type: "cash" | "bank" | "alipay" | "wechat" | "credit" | "other";
            icon: string;
            balance: number;
            initialBalance: number;
            isDefault: boolean;
            color?: string | undefined;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteAccount(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    adjustBalance(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        account: {
            id: string;
            name: string;
            type: "cash" | "bank" | "alipay" | "wechat" | "credit" | "other";
            icon: string;
            balance: number;
            initialBalance: number;
            isDefault: boolean;
            color?: string | undefined;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getSummary(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        summary: {
            totalAssets: number;
            totalLiabilities: number;
            netWorth: number;
            byType: {
                [x: string]: number;
            };
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const accountController: AccountController;
//# sourceMappingURL=account.controller.d.ts.map