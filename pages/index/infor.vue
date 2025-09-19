<!-- infor.vue -->

<template>
  <view class="container"> 
	<uni-section class="section-title" title="热门推荐" type="line">
	  <uni-card padding="0" spacing="0">
	    <template v-slot:cover>
	      <view class="custom-cover">
	        <image class="cover-image" mode="aspectFill" :src="cover"></image>
	        <view class="cover-content">
	          <text class="uni-subtitle uni-white">今日新闻热点</text>
	        </view>
	      </view>
	    </template>
	    <uni-list>
	      <uni-list-item title="今日新闻" showArrow></uni-list-item>
	      <uni-list-item title="今日新闻" showArrow></uni-list-item>
		  <uni-list-item title="今日新闻" showArrow></uni-list-item>
		  <uni-list-item title="今日新闻" showArrow></uni-list-item>
	    </uni-list>
	  </uni-card>
	</uni-section>

    <!-- 更多分类 -->
    <view class="category-grid">
      <view class="category-item" v-for="item in categories2" :key="item.name" @click="navigateTo(item.path)">
        <text>{{item.name}}</text>
        <text class="view-detail">查看详情</text>
      </view>
    </view>
            
    <!-- 查看更多 -->
    <view class="view-more">
      <text>查看更多</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const cover = ref('/static/index2.png');
const avatar = ref('/static/index2.png');
const extraIcon = ref({
  color: '#4cd964',
  size: '22',
  type: 'gear-filled'
});

const categories2 = ref([
  { name: '心理健康', path: '/pages/mental-health' },
  { name: '改善睡眠', path: '/pages/sleep' },
  { name: '科学减肥', path: '/pages/weight-loss' },
  { name: '美容抗衰', path: '/pages/beauty' },
  { name: '儿童健康', path: '/pages/child-health' },
  { name: '运动健康', path: '/pages/sports-health' },
]);

const onClick = (e) => {
  console.log(e);
};

const actionsClick = (text) => {
  uni.showToast({
    title: text,
    icon: 'none'
  });
};

const navigateTo = (path) => {
  uni.navigateTo({
    url: path
  });
};

const consultDoctor = () => {
  uni.navigateTo({
    url: '/pages/consult'
  });
};
</script>

<style>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: calc(100vh - 120rpx);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
  margin-top: 30rpx;
}

.category-item {
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  transition: box-shadow 0.3s;
}

.category-item:hover {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.view-detail {
  display: block;
  font-size: 22rpx;
  color: #3498db;
  margin-top: 10rpx;
  cursor: pointer;
  transition: color 0.3s;
}

.view-detail:hover {
  color: #2980b9;
}

.view-more {
  text-align: center;
  color: #999;
  font-size: 24rpx;
  padding: 20rpx 0;
  cursor: pointer;
  transition: color 0.3s;
}

.view-more:hover {
  color: #666;
}

.container {
  overflow: hidden;
  
}

.custom-cover {
  position: relative;
  width: 100%; /* 确保宽度填满 */
  overflow: hidden; /* 隐藏任何可能的溢出 */
}

.cover-image {
  width: 100%; /* 确保宽度填满 */
  height: 150px;
  display: block; /* 移除图片底部的默认间距 */
  object-fit: cover; /* 确保图片填充整个容器 */
}

.cover-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.4); /* 修正rgba语法 */
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
  font-size: 14px;
  color: #fff;
}

/* 确保卡片没有内边距 */
.uni-card {
  padding: 0 !important;
  margin: 0 !important;
}
.no-border {
  border-width: 0;
}
</style>