/**
 * 共享的 BaseService 基类
 * 提供通用的数据库行映射和常量，减少子类重复代码
 */

// PostgreSQL 日期时间格式化常量
export const POSTGRES_DATETIME_FORMAT = "YYYY-MM-DD HH24:MI:SS";
export const POSTGRES_DATE_FORMAT = "YYYY-MM-DD";

// SQL 片段常量
export const SQL_DATETIME_AS_TEXT = `TO_CHAR(created_at, '${POSTGRES_DATETIME_FORMAT}') as created_at`;
export const SQL_DATETIME_UPDATED_AS_TEXT = `TO_CHAR(updated_at, '${POSTGRES_DATETIME_FORMAT}') as updated_at`;
export const SQL_DATE_AS_TEXT = `TO_CHAR(date, '${POSTGRES_DATE_FORMAT}') as date`;

/**
 * 从数据库行安全地提取浮点数
 */
export function safeRowFloat(
  row: Record<string, any>,
  key: string,
  defaultValue: number = 0
): number {
  const value = parseFloat(row[key]);
  return isNaN(value) ? defaultValue : value;
}

/**
 * 从数据库行安全地提取整数
 */
export function safeRowInt(
  row: Record<string, any>,
  key: string,
  defaultValue: number = 0
): number {
  const value = parseInt(row[key], 10);
  return isNaN(value) ? defaultValue : value;
}

/**
 * 通用的数据库行映射器
 * 将 snake_case 的数据库字段映射到 camelCase 的响应对象
 */
export function mapRow<T extends Record<string, any>>(
  row: Record<string, any>,
  mapping: Record<keyof T, string | ((row: Record<string, any>) => any)>
): T {
  const result = {} as T;
  for (const [key, value] of Object.entries(mapping) as [keyof T, string | ((r: any) => any)][]) {
    result[key] = typeof value === 'string' ? row[value] : value(row);
  }
  return result;
}

/**
 * BaseService 基类
 * 提供通用的映射工具，供所有 Service 继承使用
 */
export abstract class BaseService {
  /**
   * 将数据库行映射为响应对象（使用字段映射）
   * @param row 数据库行
   * @param mapping 字段映射表：camelCase -> snake_case 或转换函数
   * @returns 映射后的对象
   */
  protected mapRowToResponse<T>(row: Record<string, any>, mapping: Record<keyof T, string | ((row: Record<string, any>) => any)>): T {
    return mapRow(row, mapping);
  }

  /**
   * 安全获取浮点数值
   */
  protected getFloat(row: Record<string, any>, key: string, defaultValue: number = 0): number {
    return safeRowFloat(row, key, defaultValue);
  }

  /**
   * 安全获取整数值
   */
  protected getInt(row: Record<string, any>, key: string, defaultValue: number = 0): number {
    return safeRowInt(row, key, defaultValue);
  }

  /**
   * 计算百分比（避免除零错误）
   */
  protected calculatePercentage(value: number, total: number): number {
    if (total === 0 || isNaN(total)) return 0;
    const percentage = (value / total) * 100;
    return Math.min(100, Math.max(0, percentage));
  }
}

/**
 * 独立的安全整数解析函数（用于控制器等非Service类）
 * @param value 输入值
 * @param defaultValue 默认值
 * @returns 解析后的整数
 */
export function safeParseInt(value: string | undefined | null, defaultValue: number = 0): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 独立的安全浮点数解析函数（用于控制器等非Service类）
 * @param value 输入值
 * @param defaultValue 默认值
 * @returns 解析后的浮点数
 */
export function safeParseFloat(value: string | number | undefined | null, defaultValue: number = 0): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  const parsed = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(parsed) ? defaultValue : parsed;
}
