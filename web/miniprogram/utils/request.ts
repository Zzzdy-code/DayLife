import Fly from 'flyio/dist/npm/wx';
import config from '../config/config';
import userStore from '../stores/useStore';

// 创建 Fly 实例
const fly = new Fly();

// 配置请求基础 URL
fly.config.baseURL = config.baseURL;

// 配置超时时间
fly.config.timeout = config.timeout || 10000;

// 请求拦截器：添加 Token
fly.interceptors.request.use((request) => {
  // 显示 loading（可选）
  if (request.showLoading !== false) {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
  }

  // 从 MobX Store 获取 Token
  const token = userStore.token;

  // 添加 Token 到请求头
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }

  // 设置 Content-Type
  request.headers['Content-Type'] = request.headers['Content-Type'] || 'application/json';

  return request;
});

// 响应拦截器：统一处理响应和错误
fly.interceptors.response.use(
  (response) => {
    // 隐藏 loading
    const showLoading = response.request.showLoading !== false;
    if (showLoading) {
      wx.hideLoading();
    }

    // 返回数据
    return response.data;
  },
  (error) => {
    // 隐藏 loading
    if (error.request?.showLoading !== false) {
      wx.hideLoading();
    }

    // 处理错误
    if (error.status === 401) {
      // Token 过期，使用 MobX Store 退出登录
      userStore.logout();
      wx.reLaunch({
        url: '/pages/login/index',
      });
      return Promise.reject(new Error('登录已过期，请重新登录'));
    }

    // 网络错误
    if (!error.status) {
      wx.showToast({
        title: '网络错误，请检查网络连接',
        icon: 'none',
        duration: 2000,
      });
      return Promise.reject(new Error('网络错误'));
    }

    // 其他错误
    const errorMsg = error.response?.data?.message || '请求失败';
    wx.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 2000,
    });
    return Promise.reject(new Error(errorMsg));
  }
);

// 导出 Fly 实例
export default fly;
