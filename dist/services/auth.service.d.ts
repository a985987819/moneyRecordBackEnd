import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
export declare class AuthService {
    register(data: RegisterRequest): Promise<AuthResponse>;
    login(data: LoginRequest): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    logout(refreshToken: string): Promise<void>;
    logoutAll(userId: number): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map