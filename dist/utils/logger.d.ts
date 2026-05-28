declare class Logger {
    private static instance;
    private isDev;
    private constructor();
    static getInstance(): Logger;
    private formatTimestamp;
    private formatLog;
    private log;
    debug(message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, error?: Error, context?: Record<string, any>): void;
    request(method: string, path: string, statusCode: number, duration: number, userId?: number): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map