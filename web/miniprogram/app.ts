import userStore from './stores/userStore';

App({
  /**
   * 小程序初始化
   */
  onLaunch() {
    // 初始化 Store（从本地存储恢复）
    userStore.init();
    
    // 检查登录状态
    this.checkLogin();
  },

  /**
   * 检查登录状态
   */
  checkLogin() {
    // 如果未登录，跳转登录页
    if (!userStore.isLoggedIn) {
      wx.reLaunch({
        url: '/pages/login/index',
      });
    }
  },
});
