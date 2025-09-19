<!-- noService.vue -->

<template>
  <view class="empty-page">
    <!-- 空状态图片 -->
    <image 
      class="empty-image" 
      src="/static/暂无数据.png" 
      mode="aspectFit"
    />
    
    <!-- 主提示文字 -->
    <text class="empty-title">暂无数据</text>
    
    <!-- 副提示文字 -->
    <text class="empty-subtitle">当前没有找到相关数据</text>

  </view>
</template>

<script setup>


const emit = defineEmits(['buttonClick'])

// 按钮点击事件
function handleButtonClick() {
  emit('buttonClick')
}
</script>

<style lang="scss" scoped>
.empty-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top: -300rpx;
  background-color: #ffffff;
  text-align: center;
}

.empty-image {
  width: 500rpx;
  height: 400rpx;
  margin-right: 20rtx;
  opacity: 0.6;
}

.empty-title {
  font-size: 36rpx;
  color: #666;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.empty-subtitle {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.empty-button {
  width: 240rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #fff;
  background-color: #007aff;
  
  &:active {
    opacity: 0.8;
  }
  
  &::after {
    border: none;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .empty-page {
    background-color: #1a1a1a;
  }
  
  .empty-title {
    color: #ddd;
  }
  
  .empty-subtitle {
    color: #888;
  }
}
</style>