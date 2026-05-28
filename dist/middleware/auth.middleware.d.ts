import type { Context, Next } from 'hono';
export type AuthVariables = {
    user: {
        userId: number;
        username: string;
    };
};
export type AuthContext = Context<{
    Variables: AuthVariables;
}>;
export declare function authMiddleware(c: Context, next: Next): Promise<Response | void>;
//# sourceMappingURL=auth.middleware.d.ts.map