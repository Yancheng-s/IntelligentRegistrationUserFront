<!-- registerSuccess.vue -->

<template>
  <view class="page-container">
    <view class="success-card">
      <view class="success-icon">
        <uni-icons type="checkmarkempty" size="60" color="#4cd964"></uni-icons>
      </view>
      <text class="success-title">预约成功</text>
      <text class="success-tip">请准时于就诊当天前往医院门诊就诊</text>
      
      <view class="info-section">
        <view class="info-item">
          <text class="info-label">就诊时间</text>
          <text class="info-value">{{ order.date }} {{ order.period }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">就诊医院</text>
          <text class="info-value">{{ order.hospital }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">就诊科室</text>
          <text class="info-value">{{ order.department }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">就诊医生</text>
          <text class="info-value">{{ order.doctor }}{{ order.type }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">门诊金额</text>
          <text class="info-value">{{ order.price }}元</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">就诊地点</text>
          <text class="info-value">{{ order.location }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">就诊人</text>
          <text class="info-value">{{ order.patientName }}</text>
        </view>
      </view>
	  <view class="status-tag" :class="status">
	          {{ status === 'completed' ? '已完成' : '待就诊' }}
	        </view>
    </view>
    
    <view class="button-group">
      <button class="btn primary" @click="goHome">首页</button>
      <button class="btn cancel" 
              @click="cancelAppointment"
              v-if="status !== 'completed'">取消预约</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { refundApi } from '@/api/registration/patientInfo.js'

// 响应式字段
const order = ref({})

const status = ref('')

onLoad((options) => {
	status.value = options.status || ''
  // 一次性解析所有 query
  order.value = {
    patientName: options.patientName || '',
    date: options.date || '',
    period: options.period || '',
    hospital: options.hospital || '',
    department: options.department || '',
    doctor: options.doctor || '',
    type: options.type || '',
    price: options.price || '',
    location: options.location || ''
  }
})

function goHome() {
  uni.switchTab({ url: '/pages/index/index' })
}

async function cancelAppointment() {
  uni.showModal({
    title: '提示',
    content: '确定要取消本次预约吗？',
    async success(res) {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '取消中...', mask: true })
          
          // 调用退号接口
          const result = await refundApi.refundByName(order.value.patientName)
          console.log('退号结果:', result)
          
          uni.showToast({ 
            title: result || '退号成功', 
            icon: 'success',
            success: () => {
              setTimeout(() => {
                uni.navigateBack() // 退号成功后返回上一页
              }, 1500)
            }
          })
          
        } catch (error) {
          console.error('退号失败:', error)
          uni.showToast({
            title: error.message.includes('退号成功') ? '退号成功' : '退号失败',
            icon: 'none'
          })
        } finally {
          uni.hideLoading()
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-block;
  padding: 6rpx 20rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-bottom: 20rpx;
  
  &.completed {
	background-color: #e6f7ff;
	color: #1890ff;
  }
  
  &.pending {
	background-color: #fff7e6;
	color: #fa8c16;
  }
}
.page-container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--window-top) - 80rpx);
  background-color: #f7f7f7;
}

.success-card {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  text-align: center;
}

.success-icon {
  margin-bottom: 20rpx;
}

.success-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.success-tip {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 40rpx;
}

.info-section {
  text-align: left;
  border-top: 1rpx solid #eee;
  padding-top: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-size: 28rpx;
  color: #999;
  width: 160rpx;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  text-align: right;
  font-weight: 500;
}

.button-group {
  display: flex;
  margin-top: auto;
  gap: 20rpx;
}

.btn {
  flex: 1;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  font-size: 32rpx;
  
  &.primary {
    background-color: #007aff;
    color: #fff;
  }
  
  &.cancel {
    background-color: #fff;
    color: #666;
    border: 1rpx solid #ddd;
  }
}
</style>