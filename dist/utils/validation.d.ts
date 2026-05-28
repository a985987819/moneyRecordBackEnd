/**
 * 输入验证和类型安全工具
 * 注意：safeParseInt 和 safeParseFloat 已移至 base.service.ts 中的 BaseService
 */
/**
 * 验证金额
 * @param amount 金额
 * @param min 最小值（默认0）
 * @param max 最大值（默认99999999.99）
 * @returns 验证后的金额（保留2位小数）
 */
export declare function validateAmount(amount: number, min?: number, max?: number): number;
/**
 * 验证日期范围
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 验证后的日期对象
 */
export declare function validateDateRange(startDate: Date, endDate: Date): {
    startDate: Date;
    endDate: Date;
};
/**
 * 验证字符串长度
 * @param value 字符串
 * @param fieldName 字段名
 * @param min 最小长度
 * @param max 最大长度
 * @returns 验证后的字符串
 */
export declare function validateStringLength(value: string, fieldName: string, min?: number, max?: number): string;
/**
 * 验证必填字段
 * @param value 值
 * @param fieldName 字段名
 * @returns 验证后的值
 */
export declare function validateRequired<T>(value: T, fieldName: string): T;
/**
 * 验证枚举值
 * @param value 值
 * @param allowedValues 允许的值
 * @param fieldName 字段名
 * @returns 验证后的值
 */
export declare function validateEnum<T>(value: T, allowedValues: T[], fieldName: string): T;
/**
 * 安全计算百分比（BaseService中已有calculatePercentage方法，此处保留独立版本供非Service类使用）
 * @param value 当前值
 * @param total 总值
 * @returns 百分比（0-100）
 */
export declare function safePercentage(value: number, total: number): number;
//# sourceMappingURL=validation.d.ts.map