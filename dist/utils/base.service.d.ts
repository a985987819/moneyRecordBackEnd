/**
 * 共享的 BaseService 基类
 * 提供通用的数据库行映射和常量，减少子类重复代码
 */
export declare const POSTGRES_DATETIME_FORMAT = "YYYY-MM-DD HH24:MI:SS";
export declare const POSTGRES_DATE_FORMAT = "YYYY-MM-DD";
export declare const SQL_DATETIME_AS_TEXT = "TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at";
export declare const SQL_DATETIME_UPDATED_AS_TEXT = "TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at";
export declare const SQL_DATE_AS_TEXT = "TO_CHAR(date, 'YYYY-MM-DD') as date";
/**
 * 从数据库行安全地提取浮点数
 */
export declare function safeRowFloat(row: Record<string, any>, key: string, defaultValue?: number): number;
/**
 * 从数据库行安全地提取整数
 */
export declare function safeRowInt(row: Record<string, any>, key: string, defaultValue?: number): number;
/**
 * 通用的数据库行映射器
 * 将 snake_case 的数据库字段映射到 camelCase 的响应对象
 */
export declare function mapRow<T extends Record<string, any>>(row: Record<string, any>, mapping: Record<keyof T, string | ((row: Record<string, any>) => any)>): T;
/**
 * BaseService 基类
 * 提供通用的映射工具，供所有 Service 继承使用
 */
export declare abstract class BaseService {
    /**
     * 将数据库行映射为响应对象（使用字段映射）
     * @param row 数据库行
     * @param mapping 字段映射表：camelCase -> snake_case 或转换函数
     * @returns 映射后的对象
     */
    protected mapRowToResponse<T>(row: Record<string, any>, mapping: Record<keyof T, string | ((row: Record<string, any>) => any)>): T;
    /**
     * 安全获取浮点数值
     */
    protected getFloat(row: Record<string, any>, key: string, defaultValue?: number): number;
    /**
     * 安全获取整数值
     */
    protected getInt(row: Record<string, any>, key: string, defaultValue?: number): number;
    /**
     * 计算百分比（避免除零错误）
     */
    protected calculatePercentage(value: number, total: number): number;
}
/**
 * 独立的安全整数解析函数（用于控制器等非Service类）
 * @param value 输入值
 * @param defaultValue 默认值
 * @returns 解析后的整数
 */
export declare function safeParseInt(value: string | undefined | null, defaultValue?: number): number;
/**
 * 独立的安全浮点数解析函数（用于控制器等非Service类）
 * @param value 输入值
 * @param defaultValue 默认值
 * @returns 解析后的浮点数
 */
export declare function safeParseFloat(value: string | number | undefined | null, defaultValue?: number): number;
//# sourceMappingURL=base.service.d.ts.map