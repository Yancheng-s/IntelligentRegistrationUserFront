<!-- chat.vue -->

<template>
  <view class="page">
    <!-- 顶部栏 -->
    <view class="nav-bar">
	  <uni-icons
		  class="nav-back"
		  type="back"
		  size="20"
		  color="#999"
		  @tap="goBack"
		/>
	  <view class="nav-title">
		就诊人：<text class="name">{{ patientName }}</text>
		<text v-if="!isLoggedIn" class="login-tip"></text>
	  </view>
	</view>
	
	<!-- 中间背景图 -->
	<view>
		<text class="ai-tip">- 该内容由AI生成 -</text>
	</view>
	<view class="center-bg-box">
	    <scroll-view scroll-y="true" style="height: calc(100vh - 100rpx);">
	      <MessageList :messages="allMessages" />  <!-- 传递消息数据 -->
	    </scroll-view>
	  </view>
	
    <!-- 底部卡片 -->
    <view class="bottom-card">
      <view class="input-bar">
        <!-- + 功能键 -->
        <view class="plus-btn" @tap="openActions">
          <uni-icons type="plus" size="24" color="#007AFF"></uni-icons>
        </view>
    
        <!-- 输入框 -->
        <input
          v-model="question"
          class="input"
          placeholder="请输入您想问的问题"
          confirm-type="send"
          @confirm="sendMsg"
        />
    
        <!-- 发送按钮 -->
        <view class="send-btn" @tap="sendMsg">发送</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { useStore } from 'vuex';
import MessageList from '../components/IntelligentConsultation/MessageList.vue';
import { sendMsgApi } from '@/api/hospitalGuide/sendMsg.js'
import { onShow } from '@dcloudio/uni-app'

// 获取 store 实例
const store = useStore()

// 计算属性 - 使用用户信息
const patientName = computed(() => {
  // 1. 检查是否有登录用户信息
  if (store.state.user?.realName) {
    return store.state.user.realName
  }
  // 2. 检查是否有用户名
  if (store.state.user?.username) {
    return store.state.user.username
  }
  // 3. 检查token判断是否登录
  if (store.state.token) {
    return '用户'
  }
  return '未登录'
})

const isLoggedIn = computed(() => !!store.state.token) // 基于token判断登录状态

const question = ref('');
const userMsgs = ref([]);
const scrollTop = ref(0);

const goBack = () => uni.navigateBack();
const switchPatient = () => {
  uni.showToast({ title: '切换就诊人', icon: 'none' });
};

const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = 9999; // 简单做法
  });
};

const allMessages = ref([
  // 初始消息数据
  // { type: 'user', content: '左脚踝关节痛' },
  // { type: 'ai', content: '建议您挂骨科就诊' },
]);

const openActions = () => {
  uni.showActionSheet({
    itemList: ['预约挂号'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.navigateTo({
          url: '/pages/index/secondVue/departmentList'
        });
      }
    }
  });
};

const sendMsg = async () => {
  const q = question.value.trim();
  if (!q) return;
  
  // 添加用户消息
  allMessages.value.push({
    type: 'user',
    content: q
  });
  
  question.value = '';
  scrollToBottom();
  
  try {
    const sessionId = store.state.user?.id || store.state.user?.userId || ''; // 根据你的用户信息结构调整
    const res = await sendMsgApi.getAiData(q, sessionId);
    allMessages.value.push({
      type: 'ai',
      content: res.data,
    });
    console.log('请求成功:', res);
  } catch (error) {
    allMessages.value.push({
      type: 'ai',
      content: '服务暂时不可用，请稍后再试'
    });
    console.error('请求失败:', error);
  } finally {
    scrollToBottom();
  }
};

// 在onShow中调用异步函数
onShow(async () => {
  try {
    // 添加用户消息
    allMessages.value.push({
      type: 'user',
      content: "你好"
    });  
    const sessionId = store.state.user?.id || store.state.user?.userId || ''; // 根据你的用户信息结构调整
    const res = await sendMsgApi.getAiData("你好", sessionId);
    allMessages.value.push({
      type: 'ai',
      content: res.data
    });
  } catch (error) {
    allMessages.value.push({
      type: 'ai',
      content: '服务暂时不可用，请稍后再试'
    });
    console.error('请求失败:', error);
  } finally {
    scrollToBottom();
  }
});
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11 */
  padding-bottom: env(safe-area-inset-bottom);      /* iOS 12+ */
}
.nav-bar {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  height: 100rpx;
  background: #fff;
  border-bottom: 1rpx solid #e5e5e5;
  justify-content: space-between;
  .nav-back {
    width: 48rpx;
    height: 48rpx;
    align-items: center;
  }
  .nav-title {
    font-size: 32rpx;
    color: #333;
	align-items: center;
  }
}

.ai-tip {
  margin-top: 20rpx;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24rpx;
  color: #999;
}

.center-bg-box {
  position: relative;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,.08);
  background-size: cover;
  background-position: center;
}

.bottom-card {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 24rpx 32rpx 32rpx;
  /* 上下渐变：上白 → 下蓝 */
  background: linear-gradient(to bottom, #e6fbff 0%, #c7ffff 100%);
  border-radius: 32rpx 32rpx 0 0;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
  border-top: 1rpx solid #e5e5e5;
  box-sizing: border-box;
  padding-bottom: calc(32rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.input-bar {
  display: flex;
  align-items: center;

  .plus-btn {
    margin-right: 20rpx;
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  }

  .input {
    flex: 1;
    height: 72rpx;
    padding: 0 28rpx;
    font-size: 28rpx;
    color: #333;
    background: #ffffff;
    border-radius: 36rpx;
  }

  .send-btn {
    margin-left: 20rpx;
    width: 136rpx;
    height: 72rpx;
    line-height: 72rpx;
    font-size: 30rpx;
    color: #ffffff;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 36rpx;
    text-align: center;
  }
}
</style>