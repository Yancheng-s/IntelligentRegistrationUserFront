<!-- serviceTabs.vue -->

<template>
  <view class="service-tabs">
    <!-- 主选项卡 -->
    <view class="main-tabs">
      <view
        v-for="(tab, index) in mainTabs"
        :key="index"
        class="main-tab"
        :class="{ active: activeMainTab === index }"
        @click="activeMainTab = index"
      >
        {{ tab }}
      </view>
    </view>

    <!-- 子选项 -->
    <view class="sub-options">
      <view
        v-for="(option, index) in subOptions[activeMainTab]"
        :key="index"
        class="sub-option"
        @click="navigateTo(activeMainTab, index)"
      >
        <image
          class="option-icon"
          :src="optionIcons[activeMainTab][index]"
          mode="aspectFit"
        />
        <text class="option-text">{{ option }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const mainTabs = ref(['门诊服务', '住院服务', '便民服务']);
const activeMainTab = ref(0);

// 子选项文字
const subOptions = ref([
  ['预约挂号'],
  ['记录查询'],
  ['AI问诊']
]);

// 子选项图标（请换成本地路径）
const optionIcons = ref([
  ['/static/预约挂号.png'],
  ['/static/费用清单.png'],
  ['/static/AI问诊(4).png']
]);

// 子选项对应的页面路径
const optionPages = ref([
  ['/pages/index/secondVue/departmentList'],  // 预约挂号
  ['/pages/index/secondVue/appointment'],       // 费用清单
  ['/pages/index/chat']    // AI问诊
]);

const navigateTo = (mainIndex, subIndex) => {
  const url = optionPages.value[mainIndex][subIndex];
  uni.navigateTo({
    url: url
  });
};
</script>

<style scoped>
/* 原有样式保持不变 */
.service-tabs {
  width: 92%;
  background: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx 30rpx;
  padding: 0 30rpx 30rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.main-tabs {
  display: flex;
  background: #f2f4f8;
  border-radius: 20rpx 20rpx 0 0;
  overflow: hidden;
  margin: 0 -30rpx 30rpx;
}

.main-tab {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 30rpx 0;
  transition: all 0.3s;
}

.main-tab.active {
  color: #333;
  font-weight: 600;
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.sub-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx 20rpx;
}

.sub-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sub-option:active {
  transform: scale(0.96);
  transition: transform 0.15s;
}

.option-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 16rpx;
}

.option-text {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}
</style>