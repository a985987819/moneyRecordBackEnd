import { BaseService } from '../utils/base.service';
import type { CategoryRequest, CategoryResponse } from '../types/category';
/**
 * 分类服务
 * 处理用户收支分类的CRUD操作
 */
export declare class CategoryService extends BaseService {
    /**
     * 获取支出分类列表
     * @param userId 用户ID
     * @returns 支出分类数组
     */
    getExpenseCategories(userId: number): Promise<CategoryResponse[]>;
    /**
     * 获取收入分类列表
     * @param userId 用户ID
     * @returns 收入分类数组
     */
    getIncomeCategories(userId: number): Promise<CategoryResponse[]>;
    /**
     * 获取所有分类（按类型分组）
     * @param userId 用户ID
     * @returns 支出和收入分类的分组对象
     */
    getAllCategories(userId: number): Promise<{
        expense: CategoryResponse[];
        income: CategoryResponse[];
    }>;
    /**
     * 创建分类
     * @param userId 用户ID
     * @param data 分类数据
     * @returns 创建的分类
     */
    createCategory(userId: number, data: CategoryRequest): Promise<CategoryResponse>;
    /**
     * 更新分类
     * @param userId 用户ID
     * @param id 分类ID
     * @param data 更新的数据
     * @returns 更新后的分类，不存在返回null
     */
    updateCategory(userId: number, id: string, data: Partial<CategoryRequest>): Promise<CategoryResponse | null>;
    /**
     * 删除分类
     * @param userId 用户ID
     * @param id 分类ID
     * @returns 是否删除成功
     */
    deleteCategory(userId: number, id: string): Promise<boolean>;
    /**
     * 初始化默认分类
     * @param userId 用户ID
     */
    initDefaultCategories(userId: number): Promise<void>;
    /**
     * 将数据库行映射为响应对象
     * @param row 数据库行
     * @returns 分类响应对象
     */
    private mapToResponse;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=category.service.d.ts.map