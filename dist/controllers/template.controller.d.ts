import type { AuthContext } from '../middleware/auth.middleware';
export declare class TemplateController {
    getAllTemplates(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        templates: {
            id: string;
            name: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount?: number | undefined;
            remark?: string | undefined;
            account: string;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createTemplate(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        template: {
            id: string;
            name: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount?: number | undefined;
            remark?: string | undefined;
            account: string;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateTemplate(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        template: {
            id: string;
            name: string;
            type: "expense" | "income";
            category: string;
            subCategory?: string | undefined;
            categoryIcon?: string | undefined;
            amount?: number | undefined;
            remark?: string | undefined;
            account: string;
            createdAt: string;
            updatedAt: string;
        };
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteTemplate(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    useTemplate(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        record: {
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
        };
        message: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const templateController: TemplateController;
//# sourceMappingURL=template.controller.d.ts.map