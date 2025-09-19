<!-- s-index.vue -->

<template>
	<!-- 顶部 -->
	<view class="nav-gation">
		<view class="nav-top"></view>
		<view class="nav-height">某某省第一人民医院</view>
	</view>
	<view class="yuyue" @click="RouteTo('抑郁测评专业版', 0, '001')">
		<image mode="widthFix" src="https://diancan-1252107261.cos.accelerate.myqcloud.com/yiliao/nav-yiyu.png"></image>
	</view>

	<!-- 挂号和体检 -->
	<view class="guahao">
		<view class="guahao-item" v-for="(item, index) in reserve" :key="index" @click="guahao_route(index)">
			<text style="font-size: 38rpx;">{{ item.title }}</text>
			<text class="text-small">{{ item.describe }}</text>
			<image :src="item.image" mode="widthFix"></image>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const reserve = ref([
	{ title: '在线挂号', describe: '快速便捷', image: 'https://example.com/register.jpg' },
	{ title: '体检服务', describe: '全面检查', image: 'https://example.com/exam.jpg' }
]);

// 路由跳转
const RouteTo = (name: string, index: number, type: string) => {
	uni.navigateTo({
		url: `/pages/self-test/topic?type=${type}&name=${name}`
	});
};

// 预约疫苗跳转
const reserve_route = (index: number) => {
	switch (index) {
		case 0:
			uni.navigateTo({ url: "/pages/xinguan-vaccine/xinguan-vaccine" });
			break;
		case 1:
			uni.navigateTo({ url: "/pages/hpv-vaccine/hpv-vaccine" });
			break;
		case 2:
			uni.navigateTo({ url: "/pages/nucleic-acid/index" });
			break;
		case 3:
			uni.navigateTo({ url: "/pages/graphics/index" });
			break;
	}
};

// 挂号和体检的路由跳转
const guahao_route = (index: number) => {
	switch (index) {
		case 0:
			uni.switchTab({ url: "/pages/registered/registered" });
			break;
		case 1:
			uni.navigateTo({ url: "/pages/phy-exam/index" });
			break;
	}
};
</script>

<style>
.nav-gation {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: linear-gradient(90deg, #4facfe, #00f2fe); /* 渐变背景 */
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 阴影效果 */
}

.nav-top {
    height: 100rpx;
}

.nav-height {
    height: 100rpx;
    line-height: 100rpx;
    padding-left: 20rpx;
    color: #fff;
    font-weight: bold;
    font-size: 36rpx; /* 调整字体大小 */
    text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.3); /* 字体阴影 */
}

.yuyue image {
    width: 100%;
    display: block;
    height: 550rpx;
    border-radius: 20rpx; /* 圆角处理 */
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.guahao {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10rpx;
    width: 100%;
    margin-top: 40rpx;
    gap: 20rpx; /* 增加间距 */
}

.guahao-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 30%; /* 调整宽度 */
    height: 220rpx; /* 调整高度 */
    border-radius: 20rpx;
    padding: 20rpx; /* 增加内边距 */
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.2); /* 阴影效果 */
    background: linear-gradient(135deg, #66ccff, #0099ff); /* 渐变背景 */
    color: #fff; /* 优化字体颜色 */
    text-align: center; /* 居中对齐 */
}

.guahao-item:nth-child(2) {
    background: linear-gradient(135deg, #ffcc66, #ff9900); /* 渐变背景 */
}

.guahao-item:nth-child(3) {
    background: linear-gradient(135deg, #66ff99, #33cc66); /* 新增样式 */
}

.guahao-item image {
    display: block;
    width: 80rpx; /* 调整大小 */
    height: 80rpx;
    margin: 10rpx auto; /* 居中对齐 */
    border-radius: 50%; /* 圆形图片 */
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.guahao-item text {
    margin: 10rpx 0;
    font-size: 32rpx; /* 调整字体大小 */
    font-weight: bold; /* 加粗字体 */
}

.guahao-item .text-small {
    margin-top: 8rpx;
    color: #ffffff;
    font-size: 28rpx;
}
</style>