// firstLogin.js

import request from '@/tools/request/request.js'

export const FirstLoginApi = {
  FirstLogin(params) {
    return request({
      url: '/api/FirstLogin', // 添加/api前缀
      method: 'POST',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
export const LoginByPhoneAPI = {
  LoginByPhone(phoneNumber) {
    return request({
      url: '/api/UserLogin',
      method: 'POST',
      data: { phoneNumber },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // 确保返回统一格式
      if (typeof res === 'object' && res !== null) {
        return res
      }
      // 如果返回的是纯数字或其他格式，转换为统一格式
      return {
        status: res === 0 ? 0 : 1, // 假设0表示成功
        user: {
          phoneNumber: phoneNumber
        }
      }
    })
  }
}

// 新增用户信息更新API
export const UpdateUserAPI = {
  updateUserInfo(params) {
    return request({
      url: '/api/UpdateUserInfo', // 根据你的实际后端接口调整
      method: 'POST',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // 统一处理响应格式
      if (typeof res === 'object' && res !== null) {
        return res
      }
      return {
        status: res === 0 ? 0 : 1,
        message: res === 0 ? '更新成功' : '更新失败'
      }
    })
  }
}