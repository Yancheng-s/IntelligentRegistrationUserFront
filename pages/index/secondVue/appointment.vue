<!-- appointment.vue -->

<template>
  <view class="detail-page">
    <!-- 主要内容 -->
    <scroll-view class="detail-scroll" scroll-y>
      <view class="detail-content">
        <!-- 未登录提示 -->
        <view v-if="!isLoggedIn" class="login-prompt">
          <image src="/static/login-prompt.png" mode="aspectFit" class="prompt-image"></image>
          <text class="prompt-text">请先登录查看预约信息</text>
          <button class="login-button" @click="navigateToLogin">立即登录</button>
        </view>
        
        <!-- 已登录内容 -->
        <template v-else>
          <!-- 有数据时显示预约卡片 -->
          <template v-if="details.length > 0">
            <view class="detail-card" 
                  v-for="(item, index) in details" 
                  :key="index"
                  @click="handleCardClick(item)"> 
              <view class="card-header">
                <text class="status" :class="item.visit_state === 1 ? 'completed' : 'pending'">
                  {{ item.visit_state === 1 ? '已完成' : '待就诊' }}
                </text>
                <text class="clinic">{{ item.deptment_id }}门诊</text>
              </view>
              
              <view class="info-row">
                <text class="info-label">候诊时间</text>
                <text class="info-value">{{ formatDate(item.visit_date) }} {{ item.noon }}</text>
              </view>
              
              <view class="info-row">
                <text class="info-label">候诊号码</text>
                <text class="info-value">{{ item.case_number }}</text>
              </view>
              
              <view class="info-row">
                <text class="info-label">提交时间</text>
                <text class="info-value">{{ getSubmitDate(item.case_number) }}</text>
              </view>
            </view>
          </template>
          
          <!-- 没有数据时显示空状态 -->
          <view v-else class="empty-state">
            <image src="/static/empty-state.png" class="empty-image"></image>
            <text class="empty-text">暂无数据</text>
            <text class="empty-subtext">当前没有找到相关数据</text>
          </view>
        </template>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useStore } from 'vuex'

const store = useStore()
const details = ref([])

// 检查登录状态
const isLoggedIn = computed(() => {
  return !!store.state.user?.username
})

// 获取当前登录用户名
const currentUserName = computed(() => {
  return store.state.user?.username || ''
})

// 跳转到登录页
const navigateToLogin = () => {
  uni.navigateTo({ url: '/pages/index/my/accountSettings' })
}

// 格式化就诊日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 格式化提交时间为相对时间
const getSubmitDate = (caseNumber) => {
  if (!caseNumber || caseNumber.length < 8 || !caseNumber.startsWith('M')) {
    return '未知日期';
  }
  
  try {
    // 提取M后面的8位数字：20250818 → 2025年08月18日
    const dateStr = caseNumber.substring(1, 9); // 从第2个字符开始取8位
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    
    return `${year}年${month}月${day}日`;
  } catch (e) {
    console.error('解析case_number失败:', e);
    return '日期解析错误';
  }
};

// 获取预约详情数据
const fetchAppointmentDetails = async (realName) => {
  try {
    const res = await uni.request({
      url: `http://localhost:8091/search_register-groups_by_treatment-groups/${encodeURIComponent(realName)}`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${store.state.token || ''}`
      }
    })
    const responseData = res[1]?.data || res.data
    details.value = Array.isArray(responseData) ? responseData.map(item => ({
      ...item,
      deptment_id: getDepartmentName(item.deptment_id)
    })) : []
    
  } catch (error) {
    console.error('获取预约详情失败:', error)
    uni.showToast({
      title: '数据加载失败',
      icon: 'none'
    })
    details.value = []
  }
}

// 科室ID转名称
const getDepartmentName = (id) => {
  return `${id}`
}

// 处理卡片点击事件
const handleCardClick = (item) => {
  const params = {
    patientName: item.real_name,
    date: formatDate(item.visit_date),
    period: item.noon,
    hospital: '浙江树人大学慧医医院',
    department: getDepartmentName(item.deptment_id),
    doctor: getDepartmentName(item.employee_id),
    price: getDepartmentName(item.regist_money),
    location: '门诊楼3楼',
    case_number: item.case_number,
    visit_date: item.visit_date,
    status: item.visit_state === 1 ? 'completed' : 'pending'
  }
  
  uni.navigateTo({
    url: `/pages/index/secondVue/registerSuccess?${Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')}`
  })
}

// 页面显示时获取数据
onShow(() => {
  if (!isLoggedIn.value) {
    uni.showToast({
      title: '请先登录查看预约信息',
      icon: 'none',
      duration: 2000
    })
    return
  }
  fetchAppointmentDetails(currentUserName.value)
})
</script>

<style scoped>
/* 未登录提示样式 */
.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 40rpx;
  text-align: center;
  background-color: #f6f7fb;
}

.prompt-image {
  width: 300rpx;
  margin-top: -200rpx;
  margin-bottom: 40rpx;
}

.prompt-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.login-button {
  width: 60%;
  background-color: #007aff;
  color: white;
  border-radius: 50rpx;
  font-size: 32rpx;
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

/* 全局样式 */
.detail-page {
  height: calc(100vh - var(--window-top));
  background-color: #f6f7fb;
}

.detail-scroll {
  height: 100%;
  background-color: #f6f7fb;
}

.detail-content {
  min-height: 100%;
  background-color: #f6f7fb;
  padding: 24rpx;
}

.detail-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.status {
  font-size: 26rpx;
  font-weight: 600;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}

.completed {
  background: #f6ffed;
  color: #52c41a;
}

.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.clinic {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 30rpx;
  width: 40%;
}

.info-value {
  color: #333;
  font-weight: 600;
  font-size: 30rpx;
  text-align: right;
  width: 60%;
}
</style>