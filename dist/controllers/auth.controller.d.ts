import type { Context } from 'hono';
import type { AuthContext } from '../middleware/auth.middleware';
export declare class AuthController {
    register(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        user: {
            id: number;
            username: string;
            createdAt: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            tokenType: string;
        };
    }, 201, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 409, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    login(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        user: {
            id: number;
            username: string;
            createdAt: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            tokenType: string;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">)>;
    refreshToken(c: Context): Promise<(Response & import("hono").TypedResponse<{
        user: {
            id: number;
            username: string;
            createdAt: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
            tokenType: string;
        };
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 401, "json">)>;
    logout(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    logoutAll(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        message: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
    getProfile(c: AuthContext): Promise<(Response & import("hono").TypedResponse<{
        userId: number;
        username: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map