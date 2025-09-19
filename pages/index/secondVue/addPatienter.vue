<!-- addPatienter.vue -->

<template>
  <view class="page-root">
    <view class="form-container">
      <view class="privacy-notice">
        <text>隐私保护，以下信息仅对维修医生可见</text>
      </view>

      <!-- 就诊人类型 -->
      <view class="form-item">
        <text class="label">就诊人类型</text>
        <view class="radio-group">
          <view
            class="radio-option"
            :class="{ active: patientType === 'adult' }"
            @click="patientType = 'adult'"
          >
            <text>成人</text>
          </view>
          <view
            class="radio-option"
            :class="{ active: patientType === 'child' }"
            @click="patientType = 'child'"
          >
            <text>儿童（小于16岁）</text>
          </view>
        </view>
      </view>

      <!-- 就诊人姓名 -->
      <view class="form-item">
        <text class="label">就诊人姓名</text>
        <input
          class="input"
          type="text"
          placeholder="必填，请输入真实姓名"
          v-model="patientInfo.name"
        />
      </view>

      <!-- 证件类型 -->
      <view class="form-item">
        <text class="label">证件类型</text>
        <picker
          class="picker"
          mode="selector"
          :range="idTypes"
          range-key="name"
          @change="onIdTypeChange"
        >
          <view class="picker-view">
            <text>{{ idTypes[idTypeIndex].name }}</text>
            <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
          </view>
        </picker>
      </view>

      <!-- 证件号码 -->
      <view class="form-item">
        <text class="label">证件号码</text>
        <input
          class="input"
          type="text"
          :placeholder="idTypes[idTypeIndex].placeholder"
          v-model="patientInfo.idNumber"
        />
      </view>

      <!-- 手机号码 -->
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          type="number"
          placeholder="必填，请输入手机号码"
          v-model="patientInfo.phone"
        />
      </view>

      <!-- 家庭住址（省市区选择器） -->
      <view class="form-item">
        <text class="label">家庭住址</text>
        <view class="address-container" @tap="showAreaPicker = true">
          <text v-if="!fullArea" class="placeholder">请选择省-市-区</text>
          <text v-else>{{ fullArea }}</text>
          <uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
        </view>
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <input
          class="input"
          type="text"
          placeholder="详细地址，如道路、门牌号等"
          v-model="patientInfo.detailAddress"
        />
      </view>

      <!-- 保存按钮 -->
      <button class="submit-btn" @click="savePatientInfo">保存</button>
    </view>

    <!-- 省市区三级联动选择器 -->
    <u-picker
      ref="uPicker"
      :show="showAreaPicker"
      :columns="addressColumns"
      keyName="name"
      closeOnClickOverlay
      title="请选择所在地"
      @confirm="areaConfirm"
      @cancel="showAreaPicker = false"
      @close="showAreaPicker = false"
      @change="areaChange"
      :defaultIndex="defaultAreaIndex"
      immediateChange
    ></u-picker>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import areas from '@/static/region/region.js'
import { useStore } from 'vuex'
import { savePatientInfoApi } from '@/api/registration/patientInfo.js'

const store = useStore()
const user = computed(() => store.state.user)

/* -------- 省市区选择器 -------- */
const showAreaPicker   = ref(false)
const addressColumns   = ref([])
const defaultAreaIndex = ref([0, 0, 0])
const fullArea         = ref('')
const provinceCode     = ref('')
const cityCode         = ref('')
const areaCode         = ref('')

/* 重新计算三层数据，并同步索引 */
function genColumns(pIdx = 0, cIdx = 0, aIdx = 0) {
  const p = areas.map(e => ({ name: e.name, code: e.code }))
  const c = areas[pIdx].areas.map(e => ({ name: e.name, code: e.code }))
  const a = areas[pIdx].areas[cIdx].areas.map(e => ({ name: e.name, code: e.code }))
  addressColumns.value = [p, c, a]
  // 关键：同步 defaultAreaIndex，让 u-picker 使用新的索引
  defaultAreaIndex.value = [pIdx, cIdx, aIdx]
}

onMounted(() => {
  genColumns()

  // 自动回填登录人信息
  if (user.value) {
    patientInfo.value.name = user.value.realName || ''
    patientInfo.value.phone = user.value.phone || ''
    patientInfo.value.idNumber = user.value.idCard || ''
  }
})

/* 列滚动时联动 */
function areaChange(e) {
  const { columnIndex, index, indexs } = e
  if (columnIndex === 0) {
    // 省变化 → 市、区重置
    genColumns(index, 0, 0)
  } else if (columnIndex === 1) {
    // 市变化 → 区重置
    const pIdx = indexs[0]
    const cIdx = index
    genColumns(pIdx, cIdx, 0)
  }
}

/* 确认选择 */
function areaConfirm(e) {
  const [p, c, a] = e.value
  fullArea.value   = `${p.name}-${c.name}-${a.name}`
  provinceCode.value = p.code
  cityCode.value     = c.code
  areaCode.value     = a.code
  showAreaPicker.value = false
}

/* -------- 其它表单字段 -------- */
const patientType = ref('adult')
const idTypeIndex = ref(0)
const idTypes = ref([
  { name: '身份证', placeholder: '必填，请输入身份证号码' },
  { name: '护照', placeholder: '必填，请输入护照号码' },
  { name: '军官证', placeholder: '必填，请输入军官证号码' },
  { name: '港澳通行证', placeholder: '必填，请输入港澳通行证号码' },
  { name: '台湾通行证', placeholder: '必填，请输入台湾通行证号码' }
])
const patientInfo = ref({
  name: '',
  idType: '身份证',
  idNumber: '',
  phone: '',
  detailAddress: ''
})

function onIdTypeChange(e) {
  idTypeIndex.value = e.detail.value
  patientInfo.value.idType = idTypes.value[idTypeIndex.value].name
}

async function savePatientInfo() {
  const address = `${fullArea.value || ''} ${patientInfo.value.detailAddress || ''}`.trim()

  const params = {
    realName : user.value.real_name || user.value.username,
    treatmentName: patientInfo.value.name,
    idCard: patientInfo.value.idNumber,
    phone: patientInfo.value.phone,
    address
  }

  try {
    await savePatientInfoApi.submit(params)   // ← 这里改成正确的变量名
	console.log(params)
    uni.showToast({ title: '保存成功', icon: 'success' })
    uni.navigateTo({ url: '/pages/index/secondVue/medicalVisitInformation' })
  } catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
    console.error('保存失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.page-root {
  background-color: #f7f7f7;
  min-height: 100vh;
  padding: 20rpx;
}

.form-container {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
}

.privacy-notice {
  text-align: center;
  color: #f68a54;
  font-size: 26rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.radio-group {
  display: flex;
  gap: 30rpx;
}

.radio-option {
  padding: 16rpx 30rpx;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666;
  &.active {
    border-color: #007aff;
    color: #007aff;
    background-color: #f0f7ff;
  }
}

.input {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #f9f9f9;
}

.picker {
  .picker-view {
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 20rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
    font-size: 28rpx;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.address-container {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .placeholder {
    color: #999;
  }
}

.submit-btn {
  margin-top: 60rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 50rpx;
  height: 90rpx;
  line-height: 90rpx;
  font-size: 32rpx;
}
</style>