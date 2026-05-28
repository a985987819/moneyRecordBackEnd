import type { AccountRequest, AccountResponse, AccountSummary, AdjustBalanceRequest } from '../types/account';
import { BaseService } from '../utils/base.service';
export declare class AccountService extends BaseService {
    private mapToResponse;
    getAllAccounts(userId: number): Promise<AccountResponse[]>;
    createAccount(userId: number, data: AccountRequest): Promise<AccountResponse>;
    updateAccount(userId: number, id: string, data: Partial<AccountRequest>): Promise<AccountResponse | null>;
    deleteAccount(userId: number, id: string): Promise<boolean>;
    adjustBalance(userId: number, id: string, data: AdjustBalanceRequest): Promise<AccountResponse | null>;
    getSummary(userId: number): Promise<AccountSummary>;
}
export declare const accountService: AccountService;
//# sourceMappingURL=account.service.d.ts.map