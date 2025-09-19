<!-- message.vue -->

<template>
  <view class="page-container">
    <!-- 固定顶部操作栏 -->
    <view class="msg-header">
      <text class="msg-count">{{ unreadCount }}条未就诊</text>
    </view>
    
    <!-- 滚动容器（减去顶部高度） -->
    <scroll-view class="msg-scroll" scroll-y enable-back-to-top>
      <view class="msg-page">
        <!-- 未登录提示 -->
        <view v-if="!isLoggedIn" class="login-prompt">
          <image src="/static/login-prompt.png" mode="aspectFit"></image>
          <text class="prompt-text">请先登录查看挂号信息</text>
        </view>
        
        <!-- 有数据时显示消息卡片列表 -->
        <template v-else-if="registerList.length > 0">
          <view
            class="msg-card"
            v-for="(item, idx) in registerList"
            :key="idx"
            @click="handleCardClick(item)"
          >
            <!-- 卡片标题（已就诊/未就诊） -->
            <view class="card-title">
              <text class="dot" :class="{ unread: item.visit_state === 1 }"></text>
              <text class="title-text">{{ item.visit_state === 1 ? '已就诊' : '未就诊' }}</text>
            </view>

            <!-- 正文 -->
            <view class="card-body">
              <view class="msg-title">{{ item.real_name }}的挂号信息</view>

              <!-- 信息列表 -->
              <view class="info-list">
                <view class="info-item">
                  <text class="info-label">就诊人：</text>
                  <text class="info-value">{{ item.real_name }}</text>
                </view>
                <view class="info-item">
                  <text class="info-label">年龄：</text>
                  <text class="info-value">{{ item.age }}岁</text>
                </view>
                <view class="info-item">
                  <text class="info-label">就诊日期：</text>
                  <text class="info-value">{{ formatDate(item.visit_date) }}</text>
                </view>
                <view class="info-item">
                  <text class="info-label">就诊时段：</text>
                  <text class="info-value">{{ item.noon }}</text>
                </view>
              </view>
            </view>
          </view>
        </template>
        
        <!-- 没有数据时显示空状态 -->
        <view v-else class="empty-state">
          <image src="/static/empty-state.png" class="empty-image"></image>
          <text class="empty-text">暂无数据</text>
          <text class="empty-subtext">当前没有找到相关数据</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from 'vuex'

const store = useStore()
const registerList = ref([])

// 检查登录状态
const isLoggedIn = computed(() => {
  return !!store.state.user?.username
})

// 获取当前登录用户名
const currentUserName = computed(() => {
  return store.state.user?.username || ''
})

// 计算未就诊条数
const unreadCount = computed(() => {
  return registerList.value.filter(item => item.visit_state === 2).length
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 处理卡片点击事件
const handleCardClick = (item) => {
  uni.navigateTo({
    url: `/pages/register/detail?id=${item.id}`
  })
}

// 获取挂号信息
const fetchRegisterGroups = async (realName) => {
  try {
    const res = await uni.request({
      url: `http://localhost:8091/search_register-groups_by_treatment-groups/${encodeURIComponent(realName)}`,
      method: 'GET'
    })
    
    const responseData = res[1]?.data || res.data
    registerList.value = Array.isArray(responseData) ? responseData : []
    
  } catch (error) {
    console.error('获取挂号信息失败:', error)
    uni.showToast({
      title: '数据加载失败',
      icon: 'none'
    })
    registerList.value = []
  }
}

// 每次显示页面时获取数据
onShow(() => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    registerList.value = []
    return
  }
  
  console.log('获取用户挂号信息:', currentUserName.value)
  fetchRegisterGroups(currentUserName.value)
})
</script>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f6f7fb;
}

/* 未登录提示样式 */
.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.login-prompt image {
  width: 300rpx;
  height: 300rpx;
  margin-bottom: 30rpx;
}

.prompt-text {
  font-size: 32rpx;
  color: #666;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  padding: 40rpx;
  text-align: center;
}

.empty-image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 40rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 16rpx;
}

.empty-subtext {
  font-size: 28rpx;
  color: #ccc;
}

/* 原有样式保持不变 */
.msg-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #f6f7fb;
  font-size: 28rpx;
}

.msg-scroll {
  height: 100vh;
  padding-top: 80rpx;
  padding-bottom: 100rpx;
  box-sizing: border-box;
}

.msg-page {
  padding: 30rpx;
  background: #f6f7fb;
  padding-top: 0;
}

.msg-count { color: #666; }

.msg-card {
  background: #fff;
  border-radius: 20rpx;
  padding-left: 32rpx;
  padding-right: 30rpx;
  padding-top: 40rpx;
  padding-bottom: 5rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 24rpx;
}

.card-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  background: #c8c8c8;
  border-radius: 50%;
  margin-right: 12rpx;
}

.dot.unread { background: #4cd964; }

.title-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.msg-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.info-list { margin-bottom: 24rpx; }

.info-item {
  display: flex;
  margin-bottom: 12rpx;
  font-size: 28rpx;
}

.info-label {
  color: #999;
  min-width: 160rpx;
}

.info-value { color: #333; }
</style>