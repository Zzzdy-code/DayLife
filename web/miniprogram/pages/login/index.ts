import * as auth from '../../utils/auth';

interface ILoginPageData {
  loading: boolean;
}

Page<ILoginPageData>({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 如果已登录，直接跳转首页
    if (auth.isLoggedIn()) {
      wx.switchTab({
        url: '/pages/index/index',
      });
    }
  },

  /**
   * 微信登录
   */
  async handleLogin() {
    // 防止重复点击
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true });

    try {
      // 调用登录
      await auth.login();
      
      // 登录成功，跳转首页
      wx.switchTab({
        url: '/pages/index/index',
      });
    } catch (error: any) {
      // 登录失败
      wx.showToast({
        title: error.message || '登录失败，请重试',
        icon: 'none',
        duration: 2000,
      });
    } finally {
      this.setData({ loading: false });
    }
  },
});
