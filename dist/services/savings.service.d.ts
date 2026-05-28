import type { DepositRequest, SavingsGoalRequest, SavingsGoalResponse, SavingsSummary, WithdrawRequest } from '../types/savings';
import { BaseService } from '../utils/base.service';
export declare class SavingsService extends BaseService {
    private mapToResponse;
    getAllGoals(userId: number): Promise<SavingsGoalResponse[]>;
    createGoal(userId: number, data: SavingsGoalRequest): Promise<SavingsGoalResponse>;
    updateGoal(userId: number, goalId: string, data: Partial<SavingsGoalRequest>): Promise<SavingsGoalResponse | null>;
    deleteGoal(userId: number, goalId: string): Promise<boolean>;
    deposit(userId: number, goalId: string, data: DepositRequest): Promise<SavingsGoalResponse | null>;
    withdraw(userId: number, goalId: string, data: WithdrawRequest): Promise<SavingsGoalResponse | null>;
    getSummary(userId: number): Promise<SavingsSummary>;
}
export declare const savingsService: SavingsService;
//# sourceMappingURL=savings.service.d.ts.map