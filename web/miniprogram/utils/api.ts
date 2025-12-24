import fly from './request';

/**
 * API 调用封装
 * 所有 API 调用都在这里定义
 * 使用 Fly.js 发起请求
 */

// ==================== 类型定义 ====================

export interface UserInfo {
  id: number;
  openid: string;
  nickname?: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface CreateScheduleDto {
  title: string;
  description?: string;
  date: string;  // YYYY-MM-DD
  startTime?: string;  // HH:mm
  endTime?: string;  // HH:mm
  location?: string;
  tags?: string[];
  reminder?: boolean;
  reminderTime?: string;  // HH:mm
}

export interface Schedule {
  id: number;
  userId: number;
  title: string;
  description?: string;
  date: string;  // YYYY-MM-DD
  startTime?: string;  // HH:mm
  endTime?: string;  // HH:mm
  location?: string;
  tags?: string[];
  reminder?: boolean;
  reminderTime?: string;  // HH:mm
  createdAt: string;
  updatedAt: string;
}

// ==================== 认证相关 ====================

/**
 * 微信登录
 * @param code - 微信登录 code
 */
export function wechatLogin(code: string): Promise<LoginResponse> {
  return fly.post<LoginResponse>('/auth/wechat/login', { code });
}

/**
 * 刷新 Token
 * @param refreshToken - 刷新 Token
 */
export function refreshToken(refreshToken: string): Promise<LoginResponse> {
  return fly.post<LoginResponse>('/auth/refresh', { refreshToken });
}

/**
 * 获取当前用户信息
 */
export function getProfile(): Promise<UserInfo> {
  return fly.get<UserInfo>('/auth/profile');
}

// ==================== 日程相关 ====================

/**
 * 创建日程
 * @param data - 日程数据
 */
export function createSchedule(data: CreateScheduleDto): Promise<Schedule> {
  return fly.post<Schedule>('/schedule', data);
}

/**
 * 查询日程列表
 * @param params - 查询参数
 */
export function getScheduleList(params: Record<string, any> = {}): Promise<Schedule[]> {
  return fly.get<Schedule[]>('/schedule', params);
}

/**
 * 查询日程详情
 * @param id - 日程 ID
 */
export function getScheduleDetail(id: number): Promise<Schedule> {
  return fly.get<Schedule>(`/schedule/${id}`);
}

/**
 * 更新日程
 * @param id - 日程 ID
 * @param data - 更新数据
 */
export function updateSchedule(id: number, data: Partial<CreateScheduleDto>): Promise<Schedule> {
  return fly.patch<Schedule>(`/schedule/${id}`, data);
}

/**
 * 删除日程
 * @param id - 日程 ID
 */
export function deleteSchedule(id: number): Promise<void> {
  return fly.delete(`/schedule/${id}`);
}

/**
 * 查询指定日期的日程
 * @param date - 日期（YYYY-MM-DD）
 */
export function getScheduleByDate(date: string): Promise<Schedule[]> {
  return fly.get<Schedule[]>(`/schedule/date/${date}`);
}

/**
 * 查询日期范围的日程
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 */
export function getScheduleByDateRange(startDate: string, endDate: string): Promise<Schedule[]> {
  return fly.get<Schedule[]>('/schedule/range', { startDate, endDate });
}
