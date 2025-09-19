<!-- registrationApplication.vue -->

<template>
  <view class="page-root">
	  <!-- 就诊人单独条目 -->
	<view class="patient" @click="toSelectPatient">
	  <view class="left">
	    <uni-icons type="person-filled" size="50rpx" color="#007aff" />
	    <text class="label">就诊人</text>
	  </view>
	  <view class="right">
	    <text class="value" :class="{ 'empty-tip': !store.state.currentPatient?.treatmentName }">
	      {{ store.state.currentPatient?.treatmentName || '请选择就诊人' }}
	    </text>
	    <text class="arrow">›</text>
	  </view>
	</view>
    <!-- 顶部信息卡片 -->
    <view class="info-card">
      <view class="row">
        <text class="label">就诊医院</text>
        <text class="value">{{ hospital }}</text>
      </view>
      <view class="row">
        <text class="label">就诊科室</text>
        <text class="value">{{ department }}</text>
      </view>
      <view class="row">
        <text class="label">就诊地点</text>
        <text class="value">{{ location }}</text>
      </view>
      <view class="row">
        <text class="label">就诊医生</text>
        <text class="value">{{ doctor }}</text>
      </view>
      <view class="row">
        <text class="label">门诊类型</text>
        <text class="value">{{ type }}</text>
      </view>
      <view class="row price">
        <text class="label">费用</text>
        <text class="value">￥{{ price }}元</text>
      </view>
      <view class="row time">
        <text class="label">候诊时间</text>
        <text class="value">{{ time }}</text>
      </view>
    </view>

    <!-- 预约说明 -->
    <view class="tips">
      <view class="title">
        <text class="warn-icon">⚠️</text>
        预约说明
      </view>
      <view class="tip">1、如未抢到您预约的号源，将自动为您抢之后的号源</view>
      <view class="tip">2、在线支付暂不支持医保支付</view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <button class="submit-btn" @click="submitOrder">提交</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { orderApi } from '@/api/registration/patientInfo.js'

const store = useStore()
const patient = computed(() => store.state.currentPatient.treatmentName || '请选择')

// 模拟数据，实际从路由或接口获取
const hospital = ref('浙江树人大学慧医医院')
const department = ref('心血管内科') // 修改为心血管内科以匹配示例数据
const location = ref('门诊二楼')
const doctor = ref('扁鹊') // 修改为扁鹊以匹配示例数据
const type = ref('专家医师') // 修改为专家医师以匹配示例数据
const price = ref(50) // 修改为50以匹配示例数据
const time = ref('')

// 科室ID映射表
const departmentMap = {
  '哮喘门诊': 101,
  '心血管内科': 102,
  '呼吸内科': 103
}

// 医生ID映射表
const doctorMap = {
  '吕群': 1001,
  '扁鹊': 1002,
  '华佗': 1003
}

// 挂号级别ID映射表
const registLevelMap = {
  '正高': 1,
  '副高': 2,
  '专家医师': 3,
  '主任医师': 4
}

async function submitOrder() {
  if (!store.state.currentPatient) {
    return uni.showToast({ title: '请先选择就诊人', icon: 'none' })
  }

  try {
    uni.showLoading({ title: '提交订单中...', mask: true })
    
    // 完整构建订单数据对象
        const orderData = {
          case_number: generateCaseNumber(),
          real_name: store.state.currentPatient.treatmentName,
          gender: store.state.currentPatient.gender || '男',
          card_number: store.state.currentPatient.idCard,
          birthday: extractBirthdayFromID(store.state.currentPatient.idCard),
          age: calculateAge(extractBirthdayFromID(store.state.currentPatient.idCard)),
          age_type: "年",
          home_address: store.state.currentPatient.address,
          visit_date: formatDateTime(time.value),
          noon: convertPeriod(time.value.split(' ')[1]),
          department_name: department.value, // 直接使用科室名称
          doctor_name: doctor.value,        // 直接使用医生名称
          regist_level_id: registLevelMap[type.value] || 3,
          settle_category_id: 1,
          is_book: "是",
          regist_method: "微信",
          regist_money: price.value
        }

    console.log('提交数据:', JSON.stringify(orderData, null, 2))
    
    await orderApi.submitOrder(orderData)
    
    // 构建要传递到成功页面的数据
    const successParams = {
      orderId: orderData.case_number,
      patientName: store.state.currentPatient.realName,
      date: time.value.split(' ')[0], // 如"8月17日"
      period: time.value.split(' ')[1], // 如"上午"
      hospital: hospital.value,
      department: department.value,
      doctor: doctor.value,
      type: type.value,
      price: price.value,
      location: location.value
    }
    
    // 编码参数并跳转
    const queryString = Object.keys(successParams)
      .map(key => `${key}=${encodeURIComponent(successParams[key])}`)
      .join('&')
    
    uni.navigateTo({
      url: `/pages/index/secondVue/registerSuccess?${queryString}`
    })
    
  } catch (error) {
    console.error('提交失败:', error)
    uni.showToast({
      title: '挂号失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

// 生成病历号 (示例: M+年月日+3位随机数)
function generateCaseNumber() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 900) + 100
  return `M${yyyy}${mm}${dd}${random}`
}

// 从身份证号提取出生日期
function extractBirthdayFromID(idCard) {
  if (!idCard || idCard.length < 18) return '1990-01-01'
  const birthStr = idCard.substring(6, 14)
  return `${birthStr.substring(0, 4)}-${birthStr.substring(4, 6)}-${birthStr.substring(6, 8)}`
}

// 计算年龄
function calculateAge(birthday) {
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 格式化日期时间为数据库要求的格式
function formatDateTime(timeStr) {
  if (!timeStr) return '2025-08-17 09:00:00' // 默认值
  const [datePart, period] = timeStr.split(' ')
  const [month, day] = datePart.match(/\d+/g)
  return `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${
    period === '上午' ? '09:00:00' : '14:00:00'
  }`
}

// 转换时段
function convertPeriod(chinesePeriod) {
  return chinesePeriod === '上午' ? 'AM' : 'PM'
}

function toSelectPatient() {
  uni.navigateTo({
    url: '/pages/index/secondVue/medicalVisitInformation'
  })
}

onLoad((options) => {
  // 路由参数 → 响应式变量
  hospital.value = '浙江树人大学慧医医院'
  department.value = decodeURIComponent(options.clinic || '心血管内科')
  doctor.value = decodeURIComponent(options.name || '扁鹊')
  type.value = decodeURIComponent(options.level || '专家医师')
  
  // 根据医生级别设置价格
  switch(type.value) {
    case '专家医师':
      price.value = 50
      break
    case '主任医师':
      price.value = 20
      break
    default:
      price.value = 8
  }

  // 处理日期和时间显示
  const [y, m, d] = (options.date || '2025-08-17').split('-')
  const dateObj = new Date(y, m - 1, d)
  const monthDay = `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
  
  // 处理排班时段显示
  let apm = options.period?.includes('上午') ? '上午' : '下午'
  if (options.scheduleTag === '全天') {
    apm = options.period?.includes('上午') ? '上午' : '下午'
  } else if (options.scheduleTag) {
    apm = options.scheduleTag
  }
  
  time.value = `${monthDay} ${apm}`
})
</script>

<style lang="scss" scoped>
.page-root {
  background: #f5f5f5;
  min-height: calc(100vh - var(--window-top) - 120rpx);
  display: flex;
  flex-direction: column;
  padding-bottom: 120rpx; /* 预留按钮高度 */
}


/* 信息卡片 */
.info-card {
  margin: 0rpx 32rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  .arrow {
	  .uni-icons{
		  margin-right: 40rpx;
	  }
  }
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24rpx;
    font-size: 30rpx;
    &:last-child { margin-bottom: 0; }
    .label { color: #666; }
    .value { color: #111; font-weight: 500; }
  }
  .price .value { color: #ff4d4f; }
}

/* 预约说明 */
.tips {
  margin: 5rpx 32rpx 32rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  .title {
    font-size: 30rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
  }
  .tip {
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
  }
}

/* 底部按钮 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  background: #fff;
  border-top: 1rpx solid #e5e5e5;
  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    color: #fff;
    background: #007aff;
    border-radius: 44rpx;
    border: none;
  }
}

/* 就诊人条目可点击 */
.patient {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  margin: 30rpx;
  background: #fff;
  border-radius: 16rpx;

  .left {
    display: flex;
    align-items: center;
    .label {
      margin-left: 16rpx;
      font-size: 30rpx;
      color: #111;
    }
  }

  .right {
    display: flex;
    align-items: center;
    .value {
      margin-right: 8rpx;
      font-size: 30rpx;
      color: #111;
    }
    .arrow {
      font-size: 32rpx;
      color: #c7c7cc;
    }
  }
}
</style>