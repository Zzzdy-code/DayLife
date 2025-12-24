import dayjs from 'dayjs';

/**
 * 日期格式化
 * @param date - 日期
 * @param format - 格式（默认：YYYY-MM-DD）
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * 时间格式化
 * @param time - 时间（HH:mm）
 * @param format - 格式（默认：HH:mm）
 */
export function formatTime(time: string, format: string = 'HH:mm'): string {
  return dayjs(time, 'HH:mm').format(format);
}

/**
 * 获取今天的日期（YYYY-MM-DD）
 */
export function getToday(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * 获取日期范围
 * @param days - 天数（负数表示过去，正数表示未来）
 */
export function getDateRange(days: number): string {
  return dayjs().add(days, 'day').format('YYYY-MM-DD');
}

/**
 * 判断是否为今天
 * @param date - 日期（YYYY-MM-DD）
 */
export function isToday(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * 判断是否为本周
 * @param date - 日期（YYYY-MM-DD）
 */
export function isThisWeek(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'week');
}
