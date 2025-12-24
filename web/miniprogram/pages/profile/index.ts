import { createStoreBindings } from 'mobx-miniprogram-bindings';
import userStore from '../../stores/userStore';
import * as auth from '../../utils/auth';

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
  },

  onLoad() {
    // 绑定 Store
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['isLoggedIn', 'userInfo'],
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout();
        }
      },
    });
  },
});
