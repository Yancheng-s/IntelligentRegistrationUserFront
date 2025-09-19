<!-- accountSettings.vue -->

<template>
  <view class="user-profile-container">
    <!-- 顶部状态提示 -->
    <view class="status-tip" v-if="!isLogin">
      <text>{{ isRegister ? '注册新账号' : '请先登录' }}</text>
    </view>
    
    <!-- 用户头像区域 -->
    <view class="avatar-section" @click="isLogin ? uploadAvatar() : ''">
      <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
      <text class="avatar-text">{{ isLogin ? '点击修改头像' : '未设置头像' }}</text>
    </view>

    <!-- 登录/注册表单 -->
    <view class="form-section" v-if="!isLogin">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="tempPhone" placeholder="请输入手机号" type="number" maxlength="11" />
      </view>
      <view class="form-item">
        <text class="form-label">验证码</text>
        <input class="form-input" v-model="smsCode" placeholder="请输入验证码" type="number" maxlength="6" />
        <button class="sms-btn" @click="sendSmsCode" :disabled="smsCountdown > 0">
          {{ smsCountdown > 0 ? `${smsCountdown}s后重试` : '获取验证码' }}
        </button>
      </view>
      <view class="form-item" v-if="isRegister">
        <text class="form-label">用户名</text>
        <input class="form-input" v-model="tempUsername" placeholder="设置用户名" />
      </view>
      
      <button class="submit-btn" @click="handleAuth">
        {{ isRegister ? '注册' : '登录' }}
      </button>
      
      <view class="auth-switch">
        <text @click="toggleAuthMode">{{ isRegister ? '已有账号？去登录' : '没有账号？立即注册' }}</text>
      </view>
    </view>

    <!-- 用户信息列表 (登录后显示) -->
    <view class="info-list" v-if="isLogin">
      <view class="info-item" @click="editUsername">
        <text class="info-label">用户名</text>
        <view class="info-content">
          <text class="info-value">{{ username || '未设置' }}</text>
          <uni-icons type="forward" size="16" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="info-item" @click="editLocation">
        <text class="info-label">定位</text>
        <view class="info-content">
          <view class="location-section">
            <uni-icons type="location-filled" size="16" color="#666"></uni-icons>
            <text class="location-text">{{ currentLocation || '点击获取定位' }}</text>
          </view>
          <uni-icons type="forward" size="16" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="info-item">
          <text class="info-label">手机号</text>
          <view class="info-content">
            <text class="info-value">{{ phoneNumber || '未绑定' }}</text>
          </view>
        </view>
    </view>

    <!-- 操作按钮 (登录后显示) -->
    <view class="action-buttons" v-if="isLogin">
      <button class="confirm-btn" @click="saveProfile">
        <text>保存修改</text>
      </button>
      <button class="logout-btn" @click="logout">
        <text>退出登录</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { onLoad } from '@dcloudio/uni-app'
import { UpdateUserAPI, LoginByPhoneAPI, FirstLoginApi } from '@/api/login/firstLogin.js'

// 获取 store 实例
const store = useStore()
const user = computed(() => store.state.user)

// 认证状态
const isLogin = ref(false)
const isRegister = ref(false)

// 表单数据
const tempPhone = ref('')
const smsCode = ref('')
const tempUsername = ref('')
const smsCountdown = ref(0)

// 用户数据
const avatarUrl = ref('/static/灰色头像.png')
const username = ref('')
const currentLocation = ref('')
const phoneNumber = ref('')

// 切换登录/注册模式
function toggleAuthMode() {
  isRegister.value = !isRegister.value
  tempPhone.value = ''
  smsCode.value = ''
  tempUsername.value = ''
}

// 发送验证码
function sendSmsCode() {
  if (!/^1[3-9]\d{9}$/.test(tempPhone.value)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  
  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  uni.showToast({ title: '验证码已发送', icon: 'none' })
}

// 修改handleAuth函数为async/await
async function handleAuth() {
  if (!tempPhone.value || !smsCode.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  
  if (isRegister.value && !tempUsername.value) {
    uni.showToast({ title: '请设置用户名', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '处理中...', mask: true })
  
  try {
    if (isRegister.value) {
      const userData = {
        username: tempUsername.value,
        phoneNumber: tempPhone.value,
        avatar: avatarUrl.value,
        address: currentLocation.value,
      }
      
      const res = await FirstLoginApi.FirstLogin({ user: userData })
      console.log('注册响应:', res)
      
      username.value = tempUsername.value
      phoneNumber.value = tempPhone.value
      store.commit('setUser', userData)
      uni.setStorageSync('user', userData)
      
      uni.showToast({ title: '注册成功', icon: 'success' })
      isLogin.value = true
    } else {
      // 登录逻辑
      try {
		  const res = await LoginByPhoneAPI.LoginByPhone(tempPhone.value)
		  console.log('登录响应:', res)
		  
		  // 根据新的后端返回结构调整
		  if (res.status === 0) { // 使用status判断是否成功
			const userData = {
			  id: res.user.id,
			  username: res.user.username || res.username || '用户' + tempPhone.value.slice(-4),
			  phoneNumber: res.user.phoneNumber || tempPhone.value,
			  avatar: avatarUrl.value,
			  address: currentLocation.value,
			  // 其他可能需要的字段...
			}
			
			store.commit('setUser', userData)
			uni.setStorageSync('user', userData)
			username.value = userData.username
			phoneNumber.value = userData.phoneNumber
			isLogin.value = true
			uni.showToast({ title: '登录成功', icon: 'success' })
		  } else {
			uni.showToast({ title: '登录失败', icon: 'none' })
		  }
		} catch (error) {
		  console.error('登录请求错误:', error)
		  uni.showToast({ title: '登录请求失败', icon: 'none' })
		}
	  }
    
    // 重置表单状态
    isRegister.value = false
    tempPhone.value = ''
    smsCode.value = ''
    tempUsername.value = ''
    
  } catch (error) {
    console.error('操作失败:', error)
    uni.showToast({ title: '操作失败: ' + (error.message || '未知错误'), icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

// 编辑用户名
async function editUsername() {
  uni.showModal({
    title: '修改用户名',
    content: '',
    editable: true,
    placeholderText: username.value,
    success: async (res) => {
      if (res.confirm && res.content) {
        const newUsername = res.content.trim()
        if (!newUsername) {
          uni.showToast({ title: '用户名不能为空', icon: 'none' })
          return
        }
        
        if (newUsername === username.value) {
          uni.showToast({ title: '用户名未变化', icon: 'none' })
          return
        }
        
        try {
          uni.showLoading({ title: '修改中...' })
          
          // 构造请求数据
          const updateData = {
            username: newUsername,
            userPhone: phoneNumber.value,
            userLocal: currentLocation.value
          }
          
          // 调用API更新用户信息
          const response = await UpdateUserAPI.updateUserInfo(updateData)
          
          if (response.status === 0) { // 假设0表示成功
            // 更新本地数据
            username.value = newUsername
            const updatedUser = { 
              ...user.value, 
              username: newUsername 
            }
            
            // 更新Vuex和本地存储
            store.commit('setUser', updatedUser)
            uni.setStorageSync('user', updatedUser)
            
            uni.showToast({ title: '修改成功', icon: 'success' })
          } else {
            throw new Error(response.message || '修改失败')
          }
        } catch (error) {
          console.error('修改用户名失败:', error)
          uni.showToast({ 
            title: error.message || '修改失败', 
            icon: 'none' 
          })
        } finally {
          uni.hideLoading()
        }
      }
    }
  })
}

// 编辑手机号
function editPhoneNumber() {
  uni.showModal({
    title: '修改手机号',
    content: '请输入新手机号',
    editable: true,
    placeholderText: user.value.phoneNumber,
    success: (res) => {
      if (res.confirm && res.content) {
        if (/^1[3-9]\d{9}$/.test(res.content)) {
          const updatedUser = { ...user.value, phoneNumber: res.content }
          store.commit('setUser', updatedUser)
        } else {
          uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        }
      }
    }
  })
}

// 获取定位
function editLocation() {
  uni.showLoading({ title: '获取定位中...' })
  
  uni.getLocation({
    type: 'wgs84',
    success: (res) => {
      currentLocation.value = res.address ? `中国·${res.address}` : '未知位置'
      // Update the stored user data with the new location
      const updatedUser = { ...user.value, address: currentLocation.value }
      store.commit('setUser', updatedUser)
      uni.hideLoading()
    },
    fail: (err) => {
      console.error('获取定位失败:', err)
      uni.hideLoading()
      uni.showModal({
        title: '提示',
        content: '获取定位失败，请检查是否开启了定位权限',
        showCancel: false
      })
    }
  })
}

// 上传头像
function uploadAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      avatarUrl.value = tempFilePaths[0]
      
      // 立即更新头像
      const updatedUser = { ...user.value, avatar: tempFilePaths[0] }
      store.commit('setUser', updatedUser)
      
      uni.showToast({ title: '头像上传成功', icon: 'success' })
    }
  })
}

// 保存修改
async function saveProfile() {
  uni.showLoading({ title: '保存中...' })
  
  try {
    // 构造请求数据
    const updateData = {
      username: username.value,
      userPhone: phoneNumber.value,
      userLocal: currentLocation.value
    }
    
    // 调用API更新用户信息
    const response = await UpdateUserAPI.updateUserInfo(updateData)
    
    if (response.status === 0) { // 假设0表示成功
      // 更新本地数据
      const updatedUser = { 
        ...user.value,
        username: username.value,
        phoneNumber: phoneNumber.value,
        avatar: avatarUrl.value,
        address: currentLocation.value
      }
      
      store.commit('setUser', updatedUser)
      uni.setStorageSync('user', updatedUser)
      
      uni.showToast({ title: '保存成功', icon: 'success' })
    } else {
      throw new Error(response.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    uni.showToast({ 
      title: error.message || '保存失败', 
      icon: 'none' 
    })
  } finally {
    uni.hideLoading()
  }
}

// 退出登录
function logout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清除状态
        store.commit('setUser', null)
        uni.removeStorageSync('user')
        
        // 重置界面状态
        isLogin.value = false
        avatarUrl.value = '/static/default-avatar.png'
        currentLocation.value = ''
        
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}

onLoad(async () => {
  // Load user data from storage if available
  const storedUser = uni.getStorageSync('user')
  if (storedUser) {
    store.commit('setUser', storedUser)
    isLogin.value = true
    avatarUrl.value = storedUser.avatar || '/static/default-avatar.png'
    currentLocation.value = storedUser.address || ''
    username.value = storedUser.username || storedUser.user?.username || ''
    phoneNumber.value = storedUser.phoneNumber || storedUser.user?.phoneNumber || ''
  }
  
  console.log('当前用户:', username.value || '未登录')
})
</script>

<style lang="scss" scoped>
.user-profile-container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: calc(100vh - var(--window-top) - 80rpx);
}

.status-tip {
  text-align: center;
  padding: 20rpx;
  color: #666;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  
  .avatar {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    background-color: #eee;
    margin-bottom: 20rpx;
    border: 6rpx solid #fff;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  }
  
  .avatar-text {
    font-size: 28rpx;
    color: #999;
  }
}

.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .form-item {
    display: flex;
    align-items: center;
    padding: 25rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    .form-label {
      width: 140rpx;
      font-size: 30rpx;
      color: #333;
    }
    
    .form-input {
      flex: 1;
      font-size: 30rpx;
      color: #333;
    }
    
    .sms-btn {
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #007aff;
      background: transparent;
      border: none;
      
      &[disabled] {
        color: #999;
      }
    }
  }
  
  .submit-btn {
    margin-top: 40rpx;
    background-color: #007aff;
    color: #fff;
    border-radius: 50rpx;
    height: 90rpx;
    line-height: 90rpx;
    font-size: 32rpx;
    width: 100%;
    
    &:active {
      opacity: 0.8;
    }
  }
  
  .auth-switch {
    text-align: center;
    margin-top: 30rpx;
    color: #007aff;
    font-size: 28rpx;
  }
}
.user-profile-container {
  padding: 40rpx;
  background-color: #f5f5f5;
  min-height: calc(100vh - var(--window-top) - 80rpx);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  
  .avatar {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
    background-color: #eee;
    margin-bottom: 20rpx;
    border: 6rpx solid #fff;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  }
  
  .avatar-text {
    font-size: 28rpx;
    color: #999;
  }
}

.info-list {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 30rpx;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .info-label {
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }
    
    .info-content {
      display: flex;
      align-items: center;
      
      .info-value {
        font-size: 30rpx;
        color: #666;
        margin-right: 20rpx;
      }
    }
    
    .location-section {
      display: flex;
      align-items: center;
      margin-right: 20rpx;
      
      .location-text {
        margin-left: 10rpx;
        font-size: 28rpx;
        color: #666;
      }
    }
  }
}

.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20rpx; /* 适当缩小间距 */
  
  button {
    flex: 1; /* 让两个按钮等宽 */
    height: 90rpx;
    line-height: 90rpx;
    font-size: 32rpx;
    border-radius: 50rpx;
    
    &:active {
      opacity: 0.8;
    }
  }
  
  .confirm-btn {
    background-color: #007aff;
    color: #fff;
    border: none;
  }
  
  .logout-btn {
    background-color: #fff;
    color: #ff3b30;
    border: 1rpx solid #ff3b30;
  }
}
</style>
<!-- ------------------------------------------------------ -->