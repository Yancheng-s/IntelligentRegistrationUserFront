// floatButtonMixin.js
export default {
  data() {
    return {
      buttonX: window.innerWidth / 2,
      buttonY: window.innerHeight / 2,
    };
  },
  methods: {
    dragStart(e) {
      e.preventDefault();
      this.startX = e.clientX || e.touches[0].clientX;
      this.startY = e.clientY || e.touches[0].clientY;
      this.initialX = this.buttonX;
      this.initialY = this.buttonY;

      document.addEventListener('mousemove', this.drag);
      document.addEventListener('mouseup', this.dragEnd);
      document.addEventListener('touchmove', this.drag);
      document.addEventListener('touchend', this.dragEnd);
    },
    drag(e) {
      const dx = (e.clientX || e.touches[0].clientX) - this.startX;
      const dy = (e.clientY || e.touches[0].clientY) - this.startY;

      this.buttonX = this.initialX + dx;
      this.buttonY = this.initialY + dy;
    },
    dragEnd() {
      document.removeEventListener('mousemove', this.drag);
      document.removeEventListener('mouseup', this.dragEnd);
      document.removeEventListener('touchmove', this.drag);
      document.removeEventListener('touchend', this.dragEnd);
    },
    goToHome() {
      // 跳转到首页的逻辑
      console.log('回到首页');
      // 这里可以添加代码跳转到首页，例如使用uni.navigateTo跳转
    }
  },
  mounted() {
    // 初始化浮球位置
    this.buttonX = window.innerWidth / 2;
    this.buttonY = window.innerHeight / 2;
  },
  beforeDestroy() {
    // 清理事件监听
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.dragEnd);
    document.removeEventListener('touchmove', this.drag);
    document.removeEventListener('touchend', this.dragEnd);
  }
};