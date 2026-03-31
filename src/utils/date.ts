/**
 * 日期时间工具函数
 */

/**
 * 将输入的日期转换为 YYYY-MM-DD HH:mm:ss 格式
 * 支持时间戳(毫秒)或字符串
 */
export function formatDateTime(dateInput: string | number): string {
  let date: Date;

  if (typeof dateInput === 'number') {
    // 时间戳（毫秒）
    date = new Date(dateInput);
  } else if (typeof dateInput === 'string') {
    // 检查是否已经是目标格式
    const targetPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (targetPattern.test(dateInput)) {
      return dateInput;
    }

    // 检查是否是 YYYY-MM-DD 格式，如果是则添加默认时间 00:00:00
    const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyPattern.test(dateInput)) {
      return `${dateInput} 00:00:00`;
    }

    // 尝试解析字符串为日期
    date = new Date(dateInput);
  } else {
    throw new Error('Invalid date input: must be string or number');
  }

  // 验证日期是否有效
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date input');
  }

  // 格式化为 YYYY-MM-DD HH:mm:ss
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 从完整日期时间中提取日期部分 (YYYY-MM-DD)
 */
export function extractDate(dateTimeStr: string): string {
  return dateTimeStr.split(' ')[0];
}

/**
 * 从完整日期时间中提取时间部分 (HH:mm:ss)
 */
export function extractTime(dateTimeStr: string): string {
  return dateTimeStr.split(' ')[1] || '00:00:00';
}

/**
 * 获取当前时间的 YYYY-MM-DD HH:mm:ss 格式
 */
export function getCurrentDateTime(): string {
  return formatDateTime(Date.now());
}

/**
 * 获取当前日期的 YYYY-MM-DD 格式
 */
export function getCurrentDate(): string {
  return extractDate(getCurrentDateTime());
}
