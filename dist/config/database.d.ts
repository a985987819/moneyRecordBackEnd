import { PoolClient } from 'pg';
export declare const db: {
    query: (text: string, params?: any[]) => Promise<import("pg").QueryResult<any>>;
    getClient: () => Promise<PoolClient>;
};
export declare const initDatabase: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map