import type { DebtRequest, DebtResponse, DebtSummary, RepayRequest } from '../types/debt';
import { BaseService } from '../utils/base.service';
export declare class DebtService extends BaseService {
    private mapToResponse;
    getAllDebts(userId: number): Promise<DebtResponse[]>;
    createDebt(userId: number, data: DebtRequest): Promise<DebtResponse>;
    updateDebt(userId: number, id: string, data: Partial<DebtRequest>): Promise<DebtResponse | null>;
    deleteDebt(userId: number, id: string): Promise<boolean>;
    repay(userId: number, id: string, data: RepayRequest): Promise<DebtResponse | null>;
    getSummary(userId: number): Promise<DebtSummary>;
}
export declare const debtService: DebtService;
//# sourceMappingURL=debt.service.d.ts.map