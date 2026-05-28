import type { Context } from 'hono';
export declare class CategoryController {
    getExpenseCategories(c: Context): Promise<(Response & import("hono").TypedResponse<{
        id: string;
        name: string;
        icon: string;
        type: import("../types/category").CategoryType;
        color?: string | undefined;
        createdAt: string;
        updatedAt: string;
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getIncomeCategories(c: Context): Promise<(Response & import("hono").TypedResponse<{
        id: string;
        name: string;
        icon: string;
        type: import("../types/category").CategoryType;
        color?: string | undefined;
        createdAt: string;
        updatedAt: string;
    }[], import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getAllCategories(c: Context): Promise<(Response & import("hono").TypedResponse<{
        expense: {
            id: string;
            name: string;
            icon: string;
            type: import("../types/category").CategoryType;
            color?: string | undefined;
            createdAt: string;
            updatedAt: string;
        }[];
        income: {
            id: string;
            name: string;
            icon: string;
            type: import("../types/category").CategoryType;
            color?: string | undefined;
            createdAt: string;
            updatedAt: string;
        }[];
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    createCategory(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        name: string;
        icon: string;
        type: import("../types/category").CategoryType;
        color?: string | undefined;
        createdAt: string;
        updatedAt: string;
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    updateCategory(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        id: string;
        name: string;
        icon: string;
        type: import("../types/category").CategoryType;
        color?: string | undefined;
        createdAt: string;
        updatedAt: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    deleteCategory(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 404, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const categoryController: CategoryController;
//# sourceMappingURL=category.controller.d.ts.map