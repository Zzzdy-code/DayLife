import { observable, action } from 'mobx-miniprogram';

interface UserInfo {
  id: number;
  openid: string;
  nickname?: string;
  avatarUrl?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

// 用户 Store
const userStore = observable({
  // 状态
  userInfo: null as UserInfo | null,
  token: '',
  isLoggedIn: false,

  // Actions
  setUserInfo: action(function (userInfo: UserInfo | null) {
    this.userInfo = userInfo;
    if (userInfo) {
      wx.setStorageSync('userInfo', userInfo);
    } else {
      wx.removeStorageSync('userInfo');
    }
  }),

  setToken: action(function (token: string) {
    this.token = token;
    this.isLoggedIn = !!token;
    // 同步到本地存储
    if (token) {
      wx.setStorageSync('token', token);
    } else {
      wx.removeStorageSync('token');
    }
  }),

  login: action(function (userInfo: UserInfo, token: string) {
    this.setUserInfo(userInfo);
    this.setToken(token);
  }),

  logout: action(function () {
    this.userInfo = null;
    this.setToken('');
    wx.removeStorageSync('refreshToken');
  }),

  // 初始化：从本地存储恢复
  init: action(function () {
    const token = wx.getStorageSync('token') || '';
    const userInfo = wx.getStorageSync('userInfo') || null;
    if (token) {
      this.setToken(token);
      this.setUserInfo(userInfo);
    }
  }),
});

export default userStore;
