export interface TokenPayload {
    userId: number;
    username: string;
    type: 'access' | 'refresh';
}
export declare function generateAccessToken(payload: Omit<TokenPayload, 'type'>): string;
export declare function generateRefreshToken(): string;
export declare function createRefreshToken(userId: number): Promise<string>;
export declare function verifyAccessToken(token: string): TokenPayload;
export declare function verifyRefreshToken(token: string): Promise<{
    id: any;
    token: any;
    userId: any;
    expiresAt: any;
    createdAt: any;
    user: {
        id: any;
        username: any;
        createdAt: any;
    };
} | null>;
export declare function revokeRefreshToken(token: string): Promise<void>;
export declare function revokeAllUserRefreshTokens(userId: number): Promise<void>;
//# sourceMappingURL=token.d.ts.map