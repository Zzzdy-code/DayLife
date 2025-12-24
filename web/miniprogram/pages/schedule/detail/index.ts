import * as api from '../../../utils/api';
import { getToday } from '../../../utils/util';
import { Schedule, CreateScheduleDto } from '../../../utils/api';

interface IScheduleDetailPageData {
  id: number | null;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  tags: string[];
  loading: boolean;
}

Page<IScheduleDetailPageData>({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    tags: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    // 如果有 ID，加载日程详情
    if (options.id) {
      this.setData({ id: parseInt(options.id) });
      this.loadScheduleDetail();
    } else {
      // 新建日程，设置默认日期为今天（使用 dayjs）
      this.setData({ date: getToday() });
    }
  },

  /**
   * 加载日程详情
   */
  async loadScheduleDetail() {
    if (!this.data.id) return;
    
    this.setData({ loading: true });

    try {
      const schedule = await api.getScheduleDetail(this.data.id);
      this.setData({
        title: schedule.title || '',
        date: schedule.date || '',
        startTime: schedule.startTime || '',
        endTime: schedule.endTime || '',
        location: schedule.location || '',
        description: schedule.description || '',
        tags: schedule.tags || [],
      });
    } catch (error) {
      console.error('加载日程失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 保存日程
   */
  async handleSave() {
    // 验证必填字段
    if (!this.data.title.trim()) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
      });
      return;
    }

    if (!this.data.date) {
      wx.showToast({
        title: '请选择日期',
        icon: 'none',
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const data: CreateScheduleDto = {
        title: this.data.title,
        date: this.data.date,
        startTime: this.data.startTime || undefined,
        endTime: this.data.endTime || undefined,
        location: this.data.location || undefined,
        description: this.data.description || undefined,
        tags: this.data.tags.length > 0 ? this.data.tags : undefined,
      };

      if (this.data.id) {
        // 更新
        await api.updateSchedule(this.data.id, data);
        wx.showToast({
          title: '保存成功',
          icon: 'success',
        });
      } else {
        // 创建
        await api.createSchedule(data);
        wx.showToast({
          title: '创建成功',
          icon: 'success',
        });
      }

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error: any) {
      console.error('保存失败:', error);
      wx.showToast({
        title: error.message || '保存失败',
        icon: 'none',
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 删除日程
   */
  async handleDelete() {
    if (!this.data.id) return;

    wx.showModal({
      title: '提示',
      content: '确定要删除这个日程吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.deleteSchedule(this.data.id!);
            wx.showToast({
              title: '删除成功',
              icon: 'success',
            });
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } catch (error: any) {
            wx.showToast({
              title: error.message || '删除失败',
              icon: 'none',
            });
          }
        }
      },
    });
  },

  // 表单输入处理
  onTitleInput(e: any) {
    this.setData({ title: e.detail.value });
  },

  onDateChange(e: any) {
    this.setData({ date: e.detail.value });
  },

  onStartTimeChange(e: any) {
    this.setData({ startTime: e.detail.value });
  },

  onEndTimeChange(e: any) {
    this.setData({ endTime: e.detail.value });
  },

  onLocationInput(e: any) {
    this.setData({ location: e.detail.value });
  },

  onDescriptionInput(e: any) {
    this.setData({ description: e.detail.value });
  },
});
