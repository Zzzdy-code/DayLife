import { Schedule } from '../../utils/api';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    schedule: {
      type: Object as () => Schedule,
      value: {} as Schedule,
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击日程卡片
     */
    handleTap() {
      this.triggerEvent('tap', {
        schedule: this.data.schedule,
      });
    },
  },
});
