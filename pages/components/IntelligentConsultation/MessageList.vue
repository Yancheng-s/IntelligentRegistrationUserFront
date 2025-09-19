<!-- MessageList.vue -->

<template>
	<view class="message-list">
		<view class="center-bg-box">
		</view>
		
		<!-- 提示信息框 -->
		<view class="info-box">
		  <text class="info-text">您好，请输入您的症状，我会为您分析并推荐科室</text>
		  <text class="info-text">提问示例1：左脚踝关节痛</text>
		  <text class="info-text">提问示例2：感冒发烧流鼻涕挂什么科</text>
		  <text class="info-text">提问示例3：我要挂外科</text>
		</view>
		
		<view class="chat-container">
		  <view class="chat-item" v-for="(message, index) in messages" :key="index">
			<view class="chat-bubble user" v-if="message.type === 'user'">
			  <text class="chat-text">{{ message.content }}</text>
			</view>
			<view class="chat-bubble ai" v-else>
			  <text class="chat-text" v-html="parseMarkdown(message.content)"></text>
			</view>
		  </view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 解析 Markdown 文本
//输入消毒
// MessageList.vue 中的 parseMarkdown 函数
const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') return '';
  try {
    return DOMPurify.sanitize(marked.parse(text));
  } catch (error) {
    console.error('Markdown 解析失败:', error);
    return text; // 回退到原始文本
  }
};

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
});

</script>

<style scoped>

.message-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 150rpx;
}

.message-item {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 100rpx;
}

.center-bg-box {
  position: relative;
  width: 100%;
  height: 700rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,.08);
  /* background-image: url('/static/WPS动图制作.gif'); */
  background-image: url('/static/在图片中添加医生.png');
  background-size: cover;
  background-position: center;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 10%,
    black 20%,
    black 80%,
    transparent 85%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 15%,
    black 20%,
    black 80%,
    transparent 85%,
    transparent 100%
  );
}

.info-box {
  width: 85%;
  margin-top: -140rpx;
  padding: 15rpx; /* 内边距 */
  background-color: #ffffff; /* 白色背景 */
  border-radius: 16rpx; /* 圆角 */
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1); /* 阴影 */

  justify-content: flex-start;
  position: absolute;
  top: 550rpx; /* 调整为需要的顶部外边距 */
}

.info-text {
  font-size: 30rpx;
  color: #666;
  margin: 10rpx;
  display: block; /* 使文本换行显示 */
}

.chat-container {
  display: flex;
  flex-direction: column;
  width: 90%; /* 容器宽度与info-box一致 */
  margin-top: 20rpx;
}

.chat-bubble {
  padding: 20rpx;
  word-break: break-word;
  /* 移除固定宽度限制 */
  min-width: 20rpx; /* 设置最小宽度 */
  max-width: 90%; /* 只设置最大宽度限制 */
}

.user {
  margin: 10rpx 0 10rpx auto;
  background-color: #ceffff;
  border-radius: 20rpx 20rpx 0 20rpx;
  text-align: right;
  /* 添加以下属性实现真正自适应 */
  width: fit-content; /* 关键属性：根据内容适应 */
  max-width: 90%; /* 防止过长 */
}

.ai {
  margin: 10rpx auto 10rpx 0;
  background-color: #ffffff;
  border-radius: 20rpx 20rpx 20rpx 0;
  text-align: left;
  border: 1rpx solid #eee;
  /* 添加以下属性实现真正自适应 */
  width: fit-content; /* 关键属性：根据内容适应 */
  max-width: 90%; /* 防止过长 */
}

.chat-text {
  font-size: 30rpx;
  color: #333;
}
</style>