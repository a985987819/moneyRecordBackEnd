/**
 * 输入验证和类型安全工具
 */

/**
 * 安全解析整数
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
 * 安全解析浮点数
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

/**
 * 安全获取数组第一个元素
 * @param array 数组
 * @returns 第一个元素或null
 */
export function safeFirst<T>(array: T[]): T | null {
  if (!array || array.length === 0) {
    return null;
  }
  return array[0];
}

/**
 * 验证金额
 * @param amount 金额
 * @param min 最小值（默认0）
 * @param max 最大值（默认99999999.99）
 * @returns 验证后的金额
 */
export function validateAmount(amount: number, min: number = 0, max: number = 99999999.99): number {
  if (isNaN(amount)) {
    throw new Error('金额必须是有效的数字');
  }
  if (amount < min) {
    throw new Error(`金额不能小于${min}`);
  }
  if (amount > max) {
    throw new Error(`金额不能大于${max}`);
  }
  // 保留2位小数
  return Math.round(amount * 100) / 100;
}

/**
 * 验证日期范围
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 验证后的日期对象
 */
export function validateDateRange(startDate: Date, endDate: Date): { startDate: Date; endDate: Date } {
  if (isNaN(startDate.getTime())) {
    throw new Error('开始日期无效');
  }
  if (isNaN(endDate.getTime())) {
    throw new Error('结束日期无效');
  }
  if (startDate > endDate) {
    throw new Error('开始日期不能大于结束日期');
  }
  // 限制日期范围不超过10年
  const maxRange = 10 * 365 * 24 * 60 * 60 * 1000;
  if (endDate.getTime() - startDate.getTime() > maxRange) {
    throw new Error('日期范围不能超过10年');
  }
  return { startDate, endDate };
}

/**
 * 验证字符串长度
 * @param value 字符串
 * @param fieldName 字段名
 * @param min 最小长度
 * @param max 最大长度
 * @returns 验证后的字符串
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  min: number = 0,
  max: number = 255
): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName}必须是字符串`);
  }
  if (value.length < min) {
    throw new Error(`${fieldName}长度不能小于${min}`);
  }
  if (value.length > max) {
    throw new Error(`${fieldName}长度不能大于${max}`);
  }
  return value;
}

/**
 * 验证必填字段
 * @param value 值
 * @param fieldName 字段名
 * @returns 验证后的值
 */
export function validateRequired<T>(value: T, fieldName: string): T {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName}不能为空`);
  }
  return value;
}

/**
 * 验证枚举值
 * @param value 值
 * @param allowedValues 允许的值
 * @param fieldName 字段名
 * @returns 验证后的值
 */
export function validateEnum<T>(value: T, allowedValues: T[], fieldName: string): T {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName}必须是以下值之一: ${allowedValues.join(', ')}`);
  }
  return value;
}

/**
 * 安全计算百分比
 * @param value 当前值
 * @param total 总值
 * @returns 百分比（0-100）
 */
export function safePercentage(value: number, total: number): number {
  if (total === 0 || total === null || total === undefined || isNaN(total)) {
    return 0;
  }
  const percentage = (value / total) * 100;
  return Math.min(100, Math.max(0, percentage));
}

/**
 * 验证分页参数
 * @param limit 每页数量
 * @param maxLimit 最大每页数量
 * @returns 验证后的limit
 */
export function validateLimit(limit: number, maxLimit: number = 100): number {
  if (isNaN(limit) || limit < 1) {
    return 10;
  }
  return Math.min(limit, maxLimit);
}
