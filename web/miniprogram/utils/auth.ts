import * as api from './api';
import userStore from '../stores/userStore';
import { LoginResponse } from './api';

/**
 * 认证工具
 * 处理登录、Token 管理（使用 MobX Store）
 */

/**
 * 微信登录
 * @returns 登录结果
 */
export function login(): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    // 1. 调用 wx.login() 获取 code
    wx.login({
      success: async (res) => {
        if (res.code) {
          try {
            // 2. 调用后端登录接口
            const result = await api.wechatLogin(res.code);
            
            // 3. 使用 MobX Store 存储 Token 和用户信息
            userStore.login(result.user, result.accessToken);
            wx.setStorageSync('refreshToken', result.refreshToken);
            
            // 4. 登录成功
            resolve(result);
          } catch (error) {
            // 登录失败
            console.error('登录失败:', error);
            reject(error);
          }
        } else {
          reject(new Error('获取 code 失败'));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}

/**
 * 检查登录状态
 * @returns 是否已登录
 */
export function isLoggedIn(): boolean {
  return userStore.isLoggedIn;
}

/**
 * 退出登录
 */
export function logout(): void {
  userStore.logout();
  wx.removeStorageSync('refreshToken');
  wx.reLaunch({
    url: '/pages/login/index',
  });
}

/**
 * 获取 Token
 * @returns Token
 */
export function getToken(): string {
  return userStore.token;
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
  return userStore.userInfo;
}
