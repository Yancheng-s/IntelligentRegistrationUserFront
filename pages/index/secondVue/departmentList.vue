<!-- departmentList.vue -->

<template>
  <view class="page-container">
    <!-- 模糊搜索 -->
    <view class="search-bar">
      <uni-icons type="search" size="40rpx"></uni-icons>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="请输入科室或门诊名称"
        @input="onSearch"
      />
      <text
        v-if="keyword"
        class="search-clear"
        @click="clearKeyword"
      >✕</text>
    </view>
    
    <!-- 搜索结果层 -->
    <view v-if="keyword" class="search-panel">
      <scroll-view class="search-scroll" scroll-y scroll-with-animation>
        <view
          v-for="(item, index) in searchResult"
          :key="index"
          class="search-card"
          @click="jumpTo(item)"
        >
          <view class="search-content">
            <text class="search-dept">{{ item.dept }}</text>
            <text class="search-clinic">{{ item.name }}</text>
          </view>
          <text class="search-arrow">›</text>
        </view>
        <view v-if="!searchResult.length" class="search-empty">
          <image class="empty-ico" src="/static/empty.svg" mode="aspectFit" />
          <text>无匹配结果</text>
        </view>
      </scroll-view>
    </view>
    
    <view class="container">
      <!-- 左侧科室 -->
      <scroll-view class="left" scroll-y>
        <view
          v-for="(dept, index) in deptList"
          :key="index"
          :class="['left-item', { active: activeDept === dept.name }]"
          @click="selectDept(dept.name)"
        >
          {{ dept.name }}
        </view>
      </scroll-view>

      <!-- 右侧门诊列表 -->
      <scroll-view 
        class="right" 
        scroll-y
        :scroll-top="rightScrollTop"
        scroll-with-animation
      >
        <view
          v-for="(clinic, index) in currentClinics"
          :key="index"
          :class="['clinic-item', { active: activeClinic === clinic }]"
          @click="selectClinic(clinic)"
          :id="'clinic-' + index"
        >
          {{ clinic }}
        </view>
        <view v-if="!currentClinics.length" class="empty-tip">暂无门诊</view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'

// 滚动控制
const rightScrollTop = ref(0)
const scrollTimer = ref(null)

// 完整的科室与门诊数据映射
const clinicMap = {
  内科: [
    '心血管内科', '神经内科', '普通内科', '消化内科', '呼吸内科', 
    '内分泌科', '肾病内科', '血液内科', '感染内科', '老年病内科',
    '风湿免疫内科', '变态反应科'
  ],
  外科: [
    '普通外科', '泌尿外科', '神经外科', '胸外科', '整形外科', 
    '肛肠外科', '肝胆外科', '乳腺外科', '心血管外科', '心脏外科',
    '器官移植', '微创外科', '功能神经外科', '腺体外科', '骨外科',
    '手外科', '创伤骨科', '脊柱外科', '骨关节科', '骨质疏松科',
    '矫形骨科'
  ],
  妇产科: [
    '妇产科综合', '妇科', '产科', '计划生育科', '妇科内分泌',
    '遗传咨询科', '产前检查科', '妇泌尿科', '小儿妇科'
  ],
  儿科: [
    '儿科综合', '小儿外科', '新生儿科', '小儿骨科', '小儿神经内科',
    '小儿呼吸科', '小儿血液科', '小儿耳鼻喉科', '小儿心内科',
    '小儿康复科', '小儿精神科', '小儿肾内科', '小儿消化科',
    '小儿皮肤科', '小儿急诊科', '小儿内分泌科', '小儿泌尿外科',
    '小儿感染科', '小儿心外科', '小儿胸外科', '小儿神经外科',
    '小儿整形科', '小儿风湿免疫科'
  ],
  眼科: ['眼科'],
  耳鼻咽喉科: ['耳鼻咽喉头颈科', '小儿耳鼻喉科'],
  传染科: ['传染科', '肝病科', '艾滋病科', '传染危重室'],
  精神科: ['精神科', '司法鉴定科', '药物依赖科', '中医精神科', '双相障碍科'],
  儿童保健科: ['儿童保健科'],
  全科医疗科: ['急诊科', '体检科'],
  口腔科: ['口腔科'],
  肿瘤科: [
    '肿瘤综合科', '肿瘤内科', '肿瘤外科', '肿瘤妇科', '骨肿瘤科',
    '放疗科', '肿瘤康复科'
  ],
  皮肤科: ['皮肤科', '性病科', '小儿皮肤科'],
  康复医学科: ['康复科', '理疗科', '肿瘤康复科', '小儿康复科'],
  中医科: [
    '中医综合科', '针灸科', '中医骨科', '中医妇产科', '中医外科',
    '中医儿科', '中医肛肠科', '中医皮肤科', '中医五官科', '中医按摩科',
    '中医消化科', '中医肿瘤科', '中医心内科', '中医神经内科', '中医肾病内科',
    '中医内分泌', '中医呼吸科', '中医肝病科', '中医男科', '中医风湿免疫内科',
    '中医血液科', '中医乳腺外科', '中医老年病科'
  ],
  运动医学科: [],
  麻醉科: ['麻醉科'],
  医学影像科: [
    '功能检查科', '放射科', '超声诊断科', '医学影像科', '核医学科',
    '心电图科'
  ]
}

/* 扁平化所有门诊数据 */
const allClinics = computed(() => {
  const list = []
  Object.keys(clinicMap).forEach(dept => {
    clinicMap[dept].forEach(c => {
      list.push({ dept, name: c })
    })
  })
  return list
})

const keyword = ref('')
const searchResult = computed(() => {
  if (!keyword.value.trim()) return []
  const kw = keyword.value.toLowerCase()
  return allClinics.value.filter(item =>
    item.name.toLowerCase().includes(kw) || 
    item.dept.toLowerCase().includes(kw)
  )
})

// 科室列表
const deptList = Object.keys(clinicMap).map(name => ({ name }))
const activeDept = ref(deptList[0].name)
const currentClinics = computed(() => clinicMap[activeDept.value] || [])
const activeClinic = ref('')


/* 搜索跳转功能 */
function jumpTo({ dept, name }) {
  keyword.value = ''                 // 清空输入框
  activeDept.value = dept            // 切到对应科室
  activeClinic.value = name          // 高亮门诊
  
  // 计算门诊在右侧的索引
  const idx = clinicMap[dept].indexOf(name)
  if (idx > -1) {
    nextTick(() => {
      if (scrollTimer.value) clearTimeout(scrollTimer.value)
      
      uni.createSelectorQuery()
        .selectAll('.clinic-item')
        .boundingClientRect(rects => {
          if (rects && rects[idx]) {
            let scrollTop = 0
            for (let i = 0; i < idx; i++) {
              scrollTop += rects[i].height
            }
            
            // 设置滚动位置（添加50rpx的偏移量）
            rightScrollTop.value = scrollTop - 50
            scrollTimer.value = setTimeout(() => {
              rightScrollTop.value = 0
            }, 0)
          }
        })
        .exec()
    })
  }
}

function clearKeyword() {
  keyword.value = ''
  searchResult.value = []
}

function selectDept(name) {
  activeDept.value = name
  activeClinic.value = ''
}

function selectClinic(clinic) {
  activeClinic.value = clinic
  uni.navigateTo({
    url: `/pages/index/secondVue/doctoList?clinic=${encodeURIComponent(clinic)}&dept=${encodeURIComponent(activeDept.value)}`
  })
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  height: calc(100vh - var(--window-top) - 90rpx);
}
.left {
  width: 220rpx;
  background: #f8f8f8;
  border-right: 1rpx solid #e5e5e5;
}
.left-item {
  padding: 32rpx 24rpx;
  font-size: 28rpx;
  &.active {
    background: #fff;
    color: #007aff;
    font-weight: bold;
    border-right: 1rpx solid #fff;
  }
}
.right {
  flex: 1;
  padding: 24rpx 32rpx;
}
.clinic-item {
  padding: 28rpx 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
  font-size: 30rpx;
  &.active {
    color: #007aff;
    background: #e5e5e5;
  }
}
.empty-tip {
  margin-top: 40rpx;
  color: #999;
  text-align: center;
  font-size: 28rpx;
}
.search-bar {
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 50rpx;
  border-bottom: 1rpx solid #e5e5e5;
  .uni-icons {
    width: 32rpx;
    height: 32rpx;
    margin-right: 30rpx;
	margin-bottom: 5rpx;
  }
  .search-input {
    flex: 1;
    font-size: 30rpx;
  }
}
.search-mask {	
  position: absolute;
  top: 88rpx;          /* 与搜索栏对齐 */
  left: 0;
  right: 0;
  height: 60vh;        /* 固定高度（可用 rpx 或 px） */
  background: #fff;
  z-index: 99;
}
.search-scroll {
  height: 100%;        /* 撑满父容器 */
}
.search-item {
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #e5e5e5;
}
.search-empty {
  padding: 40rpx;
  text-align: center;
  color: #999;
}
/* 搜索结果浮层 */
.search-panel {
  position: absolute;
  top: 88rpx;
  left: 32rpx;
  right: 32rpx;
  max-height: 60vh;                 /* 固定最大高度 */
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16rpx);     /* 毛玻璃 */
  border-radius: 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  z-index: 999;
  overflow: hidden;                 /* 切掉圆角溢出 */
}

.search-scroll {
  max-height: 60vh;                 /* 与父级一致 */
}

/* 单条卡片 */
.search-card {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f2f2f2;
  transition: background 0.2s;
  &:active {
    background: #f5f8ff;
  }

  .search-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
    color: #007aff;
  }

  .search-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.4;
  }

  .search-dept {
    font-size: 26rpx;
    color: #666;
  }

  .search-clinic {
    font-size: 30rpx;
    color: #111;
    font-weight: 500;
  }

  .search-arrow {
    font-size: 40rpx;
    color: #c7c7cc;
    margin-left: 16rpx;
  }
}

/* 空状态 */
.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;

  .empty-ico {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 16rpx;
    opacity: 0.4;
  }
}

.search-clear {
  font-size: 32rpx;
  color: #999;
  padding: 8rpx;
  cursor: pointer;   /* H5 生效 */
}
</style>