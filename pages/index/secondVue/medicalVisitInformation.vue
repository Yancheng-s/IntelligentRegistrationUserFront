<!-- medicalVisitInformation.vue -->

<template>
  <view class="page-root">
    <!-- 顶部添加按钮 -->
    <view class="add-bar" @click="toAdd">
      <uni-icons type="plus-filled" size="40rpx" color="#007aff" />
      <text>添加就诊人</text>
    </view>

    <!-- 列表 -->
    <view class="list">
      <view
        class="item"
        v-for="(p, idx) in patients"
        :key="idx"
        @click="selectPatient(idx)"
        @longpress="del(idx)"
        :class="{ selected: selectedIndex === idx }"
      >
        <view class="left">
          <text class="name">{{ p.treatmentName || p.name }}</text>
          <text class="id">身份证：{{ hideId(p.idCard) }}</text>
        </view>
        <view class="right">
          <text v-if="p.isDefault" class="badge">默认</text>
          <text v-if="selectedIndex === idx" class="checkmark">✓</text>
          <text v-else class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 空提示 -->
    <view v-if="!patients.length" class="empty">
      <image src="/static/empty.svg" mode="aspectFit" />
      <text>暂无就诊人，点击上方添加</text>
    </view>

    <!-- 底部操作按钮 (显示在选中状态时) -->
    <view v-if="selectedIndex !== null" class="action-bar">
      <button class="action-btn" @click="setAsDefault">设为默认</button>
      <button class="action-btn primary" @click="confirmSelection">确认选择</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { onShow } from '@dcloudio/uni-app'

import { getAlreadyRegisterPatientsApi } from '@/api/registration/SearchDoctorInformation.js'
import { treatmentGroupsApi } from '@/api/registration/patientInfo.js'

/* ---------- 响应式数据 ---------- */
const patients        = ref([])   // 合并后的就诊人列表
const selectedIndex   = ref(null)

const store = useStore()
const user  = computed(() => store.state.user)

/* ---------- 工具函数 ---------- */
function hideId(id) {
  return id?.slice(0, 4) + ' **** **** ' + id?.slice(-4)
}

/* ---------- 拉取数据 ---------- */
// 在组件中修改loadPatients方法
function loadPatients() {
  if (!user.value?.username) return
  const realName = user.value.real_name || user.value.username

  Promise.all([
    getAlreadyRegisterPatientsApi.getAlreadyRegisterPatients({ real_name: realName }),
    treatmentGroupsApi.getByName(realName)
  ])
  .then(([old, rawPatientData]) => {  // rawPatientData是从数据库直接返回的原始数据
    const map = new Map()
    
    // 保留原始数据结构
    rawPatientData.forEach(originalData => {
      const idCard = originalData.idCard
      if (!map.has(idCard)) {
        map.set(idCard, {
          ...originalData,  // 保留所有原始字段
          isDefault: false, // 添加前端需要的字段
          source: 'database'
        })
      }
    })

    patients.value = [...map.values()]
    if (patients.value.length) patients.value[0].isDefault = true
  })
  .catch(err => {
    console.error('加载失败:', err)
    uni.showToast({ title: '加载失败', icon: 'none' })
  })
}

/* ---------- 生命周期 ---------- */
onMounted(async () => {
  /* 未登录先跳转 */
  if (!user.value?.username) {
    await uni.showModal({ title: '提示', content: '请先登录后再查看就诊人', showCancel: false })
    uni.navigateTo({ url: '/pages/index/my/accountSettings' })
    return
  }
  loadPatients()
})

onShow(() => loadPatients())

/* ---------- 交互 ---------- */
function toAdd() {
  uni.navigateTo({ url: '/pages/index/secondVue/addPatienter' })
}
function selectPatient(idx) {
  selectedIndex.value = selectedIndex.value === idx ? null : idx
}
function setAsDefault() {
  if (selectedIndex.value === null) return
  patients.value.forEach(p => p.isDefault = false)
  patients.value[selectedIndex.value].isDefault = true
  selectedIndex.value = null
  uni.showToast({ title: '已设为默认', icon: 'success' })
}

function confirmSelection() {
  if (selectedIndex.value === null) return
  
  // 获取原始数据库数据（未经处理的）
  const selectedPatientOriginalData = patients.value[selectedIndex.value]
  
  // 存储完整的原始就诊人数据到Vuex
  store.commit('setCurrentPatient', {
    id: selectedPatientOriginalData.id,          // 数据库ID
    treatmentName: selectedPatientOriginalData.treatmentName, // 原始字段名
    idCard: selectedPatientOriginalData.idCard,  // 身份证号
    phone: selectedPatientOriginalData.phone,    // 手机号
    address: selectedPatientOriginalData.address, // 地址
    // 包含所有其他原始字段...
    ...selectedPatientOriginalData
  })
  
  uni.showToast({ 
    title: `已选择: ${selectedPatientOriginalData.treatmentName}`, 
    icon: 'success'
  })
  selectedIndex.value = null
}

function del(idx) {
  const patient = patients.value[idx]
  
  uni.showModal({
    title: '提示',
    content: `确定删除就诊人 ${patient.treatmentName} 吗？`,
    success: (res) => {
      if (res.confirm) {
        if (patient.isDefault) {
          uni.showToast({ title: '不能删除默认就诊人', icon: 'error' })
          return
        }
        
        uni.showLoading({ title: '删除中...', mask: true })
        
		console.log(patient.treatmentName)
		
        treatmentGroupsApi.deleteByName(patient.treatmentName)
          .then(() => {
            patients.value.splice(idx, 1)
            if (selectedIndex.value === idx) selectedIndex.value = null
            uni.showToast({ title: '删除成功', icon: 'success' })
          })
          .catch(error => {
            console.error('删除失败:', error)
            uni.showToast({ title: '删除失败', icon: 'none' })
          })
          .finally(() => {
            uni.hideLoading()
          })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-root {
  background: linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%);
  min-height: calc(100vh - var(--window-top) - 120rpx);
  padding-bottom: 120rpx; /* 为底部操作栏留出空间 */
}
.delete-confirm {
  color: #FA5151;
  font-weight: bold;
}
/* 顶部添加按钮 */
.add-bar {
  position: sticky;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  padding: 30rpx;
  background: #fff;
  font-size: 28rpx;
  color: #007aff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(6rpx);
  justify-content: center;
  .uni-icons {
    margin-right: 10rpx;
  }
}

/* 列表 */
.list {
  padding: 0 30rpx 30rpx;
  .item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24rpx;
    padding: 36rpx 32rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    transition: all .2s ease;
    
    &.selected {
      border: 1rpx solid #007aff;
      background-color: #f5f9ff;
    }
    
    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
    }
    
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      .name {
        font-size: 32rpx;
        font-weight: 600;
        color: #111;
        margin-bottom: 8rpx;
      }
      .id {
        font-size: 26rpx;
        color: #666;
      }
    }
    
    .right {
      display: flex;
      align-items: center;
      gap: 20rpx;
      .badge {
        padding: 6rpx 14rpx;
        border-radius: 20rpx;
        font-size: 22rpx;
        color: #fff;
        background: linear-gradient(135deg, #007aff, #00aaff);
      }
      .arrow {
        font-size: 34rpx;
        color: #c7c7cc;
      }
      .checkmark {
        font-size: 34rpx;
        color: #007aff;
        font-weight: bold;
      }
    }
  }
}

/* 空状态 */
.empty {
  margin-top: 300rpx;
  margin-right: 180rpx;
  text-align: center;
  image {
    width: 160rpx;
    height: 160rpx;
    opacity: .3;
  }
  text {
    margin-top: 24rpx;
    font-size: 30rpx;
    color: #888;
    letter-spacing: 2rpx;
  }
}

/* 底部操作栏 */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 20rpx 30rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 10;
  
  .action-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 28rpx;
    border-radius: 40rpx;
    margin: 0 10rpx;
    background: #f5f5f5;
    color: #333;
    
    &.primary {
      background: #007aff;
      color: #fff;
    }
  }
}
</style>