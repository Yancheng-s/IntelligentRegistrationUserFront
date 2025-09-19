<!-- doctoList.vue -->

<template>
  <view class="page-root">
    <!-- 1. 顶部 7 天时间选择器 -->
    <scroll-view class="date-bar" scroll-x>
      <view
        v-for="(item, index) in weekList"
        :key="index"
        :class="['date-item', { active: index === activeIndex }]"
        @click="activeIndex = index"
      >
        <text class="week">{{ item.label }}</text>
        <text class="day">{{ item.day }}</text>
      </view>
    </scroll-view>
	

	  
    <!-- 2. 医生列表区域（示例占位） -->
    <view class="doctor-list">
      <view
        class="doctor-card"
        v-for="(doc, idx) in doctorList"
        :key="idx"
      >
		<view v-if="doc.scheduleTag" class="schedule-tag" :class="doc.scheduleTag">
		    {{ doc.scheduleTag }}
		  </view>
        <image class="avatar" :src="doc.avatar" mode="aspectFill" />
        <view class="info">
          <view class="name-line">
            <text class="name">{{ doc.name }}</text>
            <text class="level">{{ doc.level }}</text>
          </view>
          <text class="skill">{{ doc.skill }}</text>
          <view class="footer">
            <text class="booked">{{ doc.booked }}人预约过</text>
            <view class="btns">
              <button class="btn-book" @click="toBook(doc)">预约挂号</button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { SearchDoctorInformationApi } from '@/api/registration/SearchDoctorInformation.js'

// 状态管理
const loading = ref(false)
const doctorList = ref([])
const currentClinic = ref('')
const activeIndex = ref(0)

// 常量定义
const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

// 生成从今天开始的7天数据
const weekList = (() => {
  const list = []
  const today = new Date()
  const todayDay = today.getDate()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    list.push({
      date,
      label: weekMap[date.getDay()],
      day: date.getDate(),
      full: `${date.getMonth() + 1}.${date.getDate()}`,
      isToday: date.getDate() === todayDay
    })
  }
  
  return list
})()

// 当前选中的日期对象
const activeDate = computed(() => weekList[activeIndex.value])

// 监听日期变化
watch(activeIndex, (newIndex) => {
  if (currentClinic.value) {
    fetchDoctorData(currentClinic.value, getSchedulePeriodList(newIndex))
  }
})

// 跳转到预约页面
function toBook(doctor) {
  const { date, label } = weekList[activeIndex.value] // label 为"周一/周二"等
  const periodList = getSchedulePeriodList(activeIndex.value) // 时段数组
  const period = periodList[0] || '' // 这里取第一个时段，如"周一上午"

  uni.navigateTo({
    url:
      '/pages/index/secondVue/registrationApplication' +
      `?name=${encodeURIComponent(doctor.name)}` +
      `&level=${encodeURIComponent(doctor.level)}` +
      `&clinic=${encodeURIComponent(currentClinic.value)}` +
      `&date=${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}` +
      `&period=${encodeURIComponent(period)}` +
      `&scheduleTag=${encodeURIComponent(doctor.scheduleTag)}` + // 新增排班时段参数
      `&schedulingId=${doctor.schedulingId}` // 新增排班ID参数
  })
}

// 返回该日期对应的时段列表（已带周几）
function getSchedulePeriodList(index) {
  const { label, isToday } = weekList[index]   // label 就是“周一/周二...”
  if (isToday) {
    // 今天：根据当前时间决定
    return new Date().getHours() < 12
      ? [`${label}上午`, `${label}下午`]   // 上午还能选
      : [`${label}下午`]                  // 已过 12 点只能下午
  }
  // 非今天：上午下午都能选
  return [`${label}上午`, `${label}下午`]
}

// 处理医生数据转换
function processDoctorData(employee) {
  const randomAvatar = Math.random() > 0.5 
    ? '/static/男d.png' 
    : '/static/女d.png'
  
  const levelMap = {
    1: '专家医师',
    2: '普通医师',
    3: '主任医师'
  }

  // 判断排班时段
  let scheduleTag = ''
  if ([1, 3].includes(employee.schedulingId)) {
    scheduleTag = '上午'
  } else if ([2, 4].includes(employee.schedulingId)) {
    scheduleTag = '下午'
  } else if (employee.schedulingId === 5) {
    scheduleTag = '全天'
  }
  
  return {
    avatar: randomAvatar,
    name: employee.realname,
    level: levelMap[employee.registLevelId] || '医师',
    skill: employee.strongPoint || '暂无专长介绍',
    booked: employee.num || 0,
    scheduleTag: scheduleTag,  // 新增排班时段标志
    schedulingId: employee.schedulingId // 保留原始排班ID
  }
}

// 获取医生数据
async function fetchDoctorData(clinic, schedulePeriod) {
  try {
    loading.value = true
    doctorList.value = [] // 清空当前列表
    
	// console.log('【即将请求医生列表】', {
	//   deptName: clinic,
	//   schedulingId: schedulePeriod
	// })
	
    const res = await SearchDoctorInformationApi.getDoctorData({
      deptName: clinic,
      schedulingId: schedulePeriod
    })
	
	// console.log(res);
	
    if (res?.length > 0) {
      doctorList.value = res.map(emp => processDoctorData(emp))
    } else {
      uni.showToast({ 
        title: '该时段暂无医生排班', 
        icon: 'none',
        duration: 2000
      })
    }
  } catch (error) {
    console.error('获取医生数据失败:', error)
    uni.showToast({ 
      title: '加载失败，请重试', 
      icon: 'none',
      duration: 2000
    })
  } finally {
    loading.value = false
  }
}

// 页面加载
onLoad(async (options) => {
  // 初始化选中今天
  activeIndex.value = weekList.findIndex(item => item.isToday)
  
  // 获取科室参数
  currentClinic.value = decodeURIComponent(options.clinic || '')
  
  // 首次加载数据
  if (currentClinic.value) {
    await fetchDoctorData(
      currentClinic.value,
      getSchedulePeriodList(activeIndex.value)
    )
  } else {
    uni.showToast({ 
      title: '缺少科室参数', 
      icon: 'none',
      duration: 2000
    })
  }
})

// 返回当前日期对应的时段列表
const periodList = computed(() =>
  activeDate.value.isToday
    ? new Date().getHours() < 12
      ? ['上午']          // 今天且未到 12 点
      : ['下午']          // 今天且已过 12 点
    : ['上午', '下午']    // 非今天
)
</script>

<style lang="scss" scoped>
/* 页面根节点 */
.page-root {
  background: #f5f5f5;
  min-height: calc(100vh - var(--window-top));
}

/* 时间选择器 */
.date-bar {
  white-space: nowrap;
  padding: 20rpx 0;
  background: #fff;
}
.date-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  height: 120rpx;
  margin: 0 12rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #666;
  background: #f2f2f2;
  &.active {
    color: #fff;
    background: #007aff;
  }
  .week {
    font-size: 24rpx;
  }
  .day {
    font-size: 34rpx;
    margin-top: 4rpx;
  }
}

/* 医生列表示例 */
.doctor-list {
  padding: 24rpx 32rpx;
}
.doctor-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  font-size: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.doctor-card {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 24rpx;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .name-line {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      .name {
        font-size: 32rpx;
        font-weight: 600;
        margin-right: 12rpx;
      }
      .level {
        font-size: 24rpx;
        color: #007aff;
        background: #e6f4ff;
        padding: 4rpx 8rpx;
        border-radius: 4rpx;
      }
    }

    .skill {
      font-size: 26rpx;
      color: #666;
      line-height: 1.4;
      /* 两行省略 */
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12rpx;

      .booked {
        font-size: 24rpx;
        color: #999;
      }

      .btns {
        display: flex;
        gap: 16rpx;
        .btn-consult,
        .btn-book {
          font-size: 24rpx;
          padding: 8rpx 16rpx;
          border-radius: 16rpx;
          border: none;
        }
        .btn-consult {
          color: #007aff;
          background: #e6f4ff;
        }
        .btn-book {
          color: #fff;
          background: #007aff;
        }
      }
    }
  }
}
.doctor-card {
  position: relative; // 为绝对定位的标志提供参照
  
  .schedule-tag {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    color: #fff;
    
    &.上午 {
      background-color: #4a8cff;
    }
    
    &.下午 {
      background-color: #ff954a;
    }
    
    &.全天 {
      background-color: #4aff8c;
    }
  }
  
  // 其余原有样式保持不变
}
</style>