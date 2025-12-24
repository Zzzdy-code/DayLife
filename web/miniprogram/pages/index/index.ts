import * as api from '../../utils/api';
import { createStoreBindings } from 'mobx-miniprogram-bindings';
import userStore from '../../stores/userStore';
import { getToday } from '../../utils/util';
import { Schedule } from '../../utils/api';

interface IIndexPageData {
  currentDate: string;
  schedules: Schedule[];
  loading: boolean;
  isLoggedIn: boolean;
  userInfo: any;
}

Page<IIndexPageData>({
  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',  // 当前日期（YYYY-MM-DD）
    schedules: [],     // 日程列表
    loading: false,
    isLoggedIn: false,
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 绑定 Store
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ['isLoggedIn', 'userInfo'],
    });

    // 检查登录
    if (!this.data.isLoggedIn) {
      wx.reLaunch({
        url: '/pages/login/index',
      });
      return;
    }

    // 初始化日期（使用 dayjs）
    this.setData({
      currentDate: getToday(),
    });

    // 加载日程
    this.loadSchedules();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 解绑 Store
    this.storeBindings.destroyStoreBindings();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示时刷新数据
    this.loadSchedules();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadSchedules().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载日程列表
   */
  async loadSchedules(): Promise<void> {
    if (this.data.loading) {
      return;
    }

    this.setData({ loading: true });

    try {
      const schedules = await api.getScheduleByDate(this.data.currentDate);
      this.setData({
        schedules: schedules || [],
      });
    } catch (error) {
      console.error('加载日程失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 点击日程卡片
   */
  handleScheduleTap(e: any) {
    const { schedule } = e.detail;
    wx.navigateTo({
      url: `/pages/schedule/detail?id=${schedule.id}`,
    });
  },

  /**
   * 添加日程
   */
  handleAddSchedule() {
    wx.navigateTo({
      url: '/pages/schedule/detail',
    });
  },
});
