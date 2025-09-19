<!-- my.vue -->

<template>
  <view class="page-container">
    <!-- 固定用户信息头部 -->
    <view class="user-header fixed-header">
	  <view class="user-info">
		<text class="username">{{ displayUsername }}，您好</text>
		<text class="welcome">欢迎使用医疗服务</text>
	  </view>
	  <image class="avatar" src="/static/灰色头像.png" mode="aspectFill"></image>
	</view>

    <!-- 可滚动的功能列表 -->
    <scroll-view 
      class="scroll-content" 
      scroll-y
      :show-scrollbar="false"
      :style="{height: scrollHeight + 40 + 'px'}"
    >
      <view class="function-list">
        <!-- 第一组 -->
        <view class="function-group">
          <view class="function-item" @click="navigateTo('accountSettings')">
            <text>账号设置</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
          <view class="function-item" @click="navigateTo('patientManagement')">
            <text>就诊人管理</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
          <view class="function-item" @click="navigateTo('settings')">
            <text>设置</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <!-- 第三组 -->
        <view class="function-group">
          <view class="function-item" @click="navigateTo('orders')">
            <text>订单</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
          <view class="function-item" @click="navigateTo('healthIndicators')">
            <text>健康指标</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
          <view class="function-item" @click="navigateTo('backupOrders')">
            <text>候补订单</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <!-- 第四组 -->
        <view class="function-group">
          <view class="function-item" @click="navigateTo('commonTools')">
            <text>常用工具</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
          <view class="function-item" @click="navigateTo('shippingAddress')">
            <text>收货地址</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
          <view class="function-item" @click="scanQRCode">
            <text>扫一扫</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
        </view>

        <!-- 第五组 -->
        <view class="function-group">
          <view class="function-item" @click="navigateTo('coupons')">
            <text>优惠券</text>
            <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { onMounted, onUnmounted } from 'vue'

// 获取 store 实例
const store = useStore()
const user = computed(() => store.state.user)

const scrollHeight = ref(0)
let systemInfo = null

// 计算显示的用户名
const displayUsername = computed(() => {
  return user.value?.username || '游客'
})

// 计算高度的公共方法
const calculateHeight = () => {
  systemInfo = uni.getSystemInfoSync()
  uni.createSelectorQuery()
    .select('.user-header')
    .boundingClientRect(headerRect => {
      const safeAreaBottom = systemInfo.safeAreaInsets?.bottom || 0
      scrollHeight.value = systemInfo.windowHeight - headerRect.height - safeAreaBottom
    })
    .exec()
}

// 监听设备变化
const onResize = () => {
  calculateHeight()
}

onMounted(() => {
  calculateHeight()
  // 添加监听
  uni.onWindowResize?.(onResize) // 微信小程序
  window.addEventListener('resize', onResize) // H5
})

onUnmounted(() => {
  // 移除监听
  uni.offWindowResize?.(onResize)
  window.removeEventListener('resize', onResize)
})

function navigateTo(page) {
  const routes = {
    'accountSettings': '/pages/index/my/accountSettings',
    'patientManagement': '/pages/index/secondVue/medicalVisitInformation',
    'settings': '/pages/index/noService',
    'orders': '/pages/index/noService',
    'healthIndicators': '/pages/index/noService',
    'backupOrders': '/pages/index/noService',
    'commonTools': '/pages/index/noService',
    'shippingAddress': '/pages/index/noService',
    'coupons': '/pages/index/noService',
  }
  
  uni.navigateTo({
    url: routes[page] || '/pages/index/index'
  })
}

function scanQRCode() {
  uni.scanCode({
    success(res) {
      console.log('扫码结果:', res.result)
      uni.showToast({
        title: '扫码成功',
        icon: 'success'
      })
    },
    fail(err) {
      console.error('扫码失败:', err)
      uni.showToast({
        title: '扫码失败',
        icon: 'none'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  background-color: #f5f5f5;
  height: calc(100vh - 120rpx);
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  background-color: #fff;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  
  .user-info {
    display: flex;
    flex-direction: column;
    
    .username {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 10rpx;
    }
    
    .welcome {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: #eee;
  }
}

.scroll-content {
  width: 100%;
  padding-top: 180rpx; /* 头部高度 */
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }
}

.function-list {
  padding-bottom: -20rpx;
}

.function-group {
  background-color: #fff;
  border-radius: 12rpx;
  margin: 0 20rpx 20rpx;
  overflow: hidden;
  
  .function-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    font-size: 30rpx;
    color: #333;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background-color: #f9f9f9;
    }
  }
}

</style>