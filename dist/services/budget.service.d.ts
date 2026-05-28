import { BaseService } from '../utils/base.service';
import type { BudgetRequest, BudgetResponse, BudgetStats } from '../types/budget';
export declare class BudgetService extends BaseService {
    getBudget(userId: number, year: number, month: number): Promise<BudgetResponse | null>;
    setBudget(userId: number, data: BudgetRequest): Promise<BudgetResponse>;
    updateSpent(userId: number, year: number, month: number, amount: number, isExpense: boolean): Promise<void>;
    deleteBudget(userId: number, year: number, month: number): Promise<boolean>;
    getBudgetStats(userId: number): Promise<BudgetStats>;
    getRecentBudgets(userId: number, months?: number): Promise<BudgetResponse[]>;
}
export declare const budgetService: BudgetService;
//# sourceMappingURL=budget.service.d.ts.map