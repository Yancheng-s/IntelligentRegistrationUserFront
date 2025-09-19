<!-- index.vue -->

<template>
  <!-- 顶部导航栏 -->
  <view class="nav-gation">
    <view class="nav-title">
      <image class="nav-logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="nav-title-left">树人慧医</text>
      <text class="nav-title-divider">|</text>
      <text class="nav-title-right">互联网医院</text>
    </view>
  </view>

  <!-- 固定高度内容容器 -->
  <view class="content-container">
    <!-- 轮播图 -->
    <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
      :duration="duration">
      <swiper-item v-for="(item, index) in background" :key="index">
        <view class="swiper-item" :style="{ backgroundImage: `url(${item})` }"></view>
      </swiper-item>
    </swiper>

    <!-- 功能网格 -->
    <view class="function-container">
      <u-grid :border="false" col="3">
        <u-grid-item 
          v-for="(item,index) in list" 
          :key="index"
          @click="handleClick(item)"
        >
          <view class="grid-item">
            <image 
              class="grid-icon"
              :src="item.img"
              mode="aspectFit"
            />
            <text class="grid-title">{{item.title}}</text>
            <text class="grid-subtitle">{{item.subtitle}}</text>
          </view>
        </u-grid-item>
      </u-grid>
    </view>
    
    <!-- 服务选项卡 -->
    <ServiceTab/>
    
    <u-toast ref="uToast" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import ServiceTab from '../components/index/serviceTabs.vue'
import { onShow } from '@dcloudio/uni-app'
import { testApi } from '@/api/test'

const background = ['/static/index2.png', '/static/index1.png', '/static/index4.png'];
const indicatorDots = ref(false);
const autoplay = ref(true);
const interval = ref(4000);
const duration = ref(1000);
const list = ref([
  {
    img: '/static/预约.png',
    title: '预约挂号',
    subtitle: '就医挂号无忧',
    path: '/pages/index/secondVue/departmentList'
  },
  {
    img: '/static/icon-咨询.png',
    title: '智能导诊',
    subtitle: '专家精准答疑',
    path: '/pages/index/chat' // 添加对应的页面路径
  },
  {
    img: '/static/查询.png',
    title: '记录查询',
    subtitle: '检查挂号记录',
    path: '/pages/index/secondVue/appointment' // 添加对应的页面路径
  },
]);

const handleClick = (item) => {
  // 跳转到对应页面
  uni.navigateTo({
    url: item.path
  });
};

// 定义异步函数
// const fetchData = async () => {
//   try {
//     const res = await testApi.getTestData({
//       name: 'name',
//       age: 18
//     }, 3000) // 设置3秒超时
    
//     console.log('请求成功:', res)
//   } catch (error) {
//     if (error.code === 'TIMEOUT') {
//       console.log('请求超时，已自动取消')
//     } else {
//       console.log('请求失败:', error)
//     }
//   }
// }

// 在onShow中调用异步函数
onShow(() => {
  // fetchData()
})
</script>

<style>
/* 全局禁止滚动 */
page {
  height: 100%;
  overflow: hidden;
}

/* 导航栏样式保持不变 */
.nav-gation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.nav-logo {
  width: 100rpx;
  height: 100rpx;
  margin-top: 15rpx;
  margin: 15rpx;
}

.nav-title {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  height: 100rpx;
  line-height: 100rpx;
  padding-left: 20rpx;
  color: #fff;
  font-weight: bold;
  font-size: 36rpx;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3);
}

.nav-title-left,
.nav-title-right {
  margin: 0 10rpx;
}

.nav-title-divider {
  margin: 0 15rpx;
  opacity: 0.7;
}

/* 内容容器 - 固定高度不滚动 */
.content-container {
  position: fixed;
  top: 140rpx; /* 导航栏高度 */
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: hidden;
  background-color: #f5f7fa;
  background-image: url('/static/背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 轮播图样式 */
.swiper {
  height: 300rpx;
  margin: 20rpx 30rpx 0;
  border-radius: 16rpx;
  overflow: hidden;
}
.swiper-item {
  display: block;
  height: 300rpx;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 功能网格样式 */
.function-container {
  background-color: #fff;
  border-radius: 24rpx;
  margin: 30rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.grid-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.grid-subtitle {
  font-size: 24rpx;
  color: #888;
  text-align: center;
  line-height: 1.4;
  padding: 0 15rpx;
}

.u-grid-item {
  transition: all 0.3s;
}
.u-grid-item:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.grid-icon {
  width: 150rpx;
  height: 150rpx;
  margin-bottom: 15rpx;
}
</style>