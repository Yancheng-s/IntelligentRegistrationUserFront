// src/api/patientInfo.js

import request from '@/tools/request/request.js'

/**
 * 就诊人信息保存接口
 */
export const savePatientInfoApi = {
  /**
   * 提交就诊人信息
   * @param {Object} data
   *   {
   *     realName: '张三',
   *     treatmentName: '李四',
   *     idCard: '110101199001011234',
   *     phone: '13800138000',
   *     address: '北京市朝阳区XX路XX号'
   *   }
   */
  submit(data) {
    return request({
      url: '/api/treatment-groups/add',   // 后端真实接口地址
      method: 'POST',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const treatmentGroupsApi = {
  /**
   * 根据姓名获取就诊分组
   */
  getByName(realName) {
    return request({
      url: `/api/treatment-groups/by-name/${encodeURIComponent(realName)}`,
      method: 'GET'
    })
  },
  
  /**
   * 根据就诊人姓名删除记录
   */
  deleteByName(treatmentName) {
    return request({
      url: `/api/treatment-groups/delete-by-name/${encodeURIComponent(treatmentName)}`,
      method: 'DELETE'
    })
  }
}

export const orderApi = {
  /**
   * 提交预约订单（单层结构）
   * @param {Object} orderData 单层订单数据
   */
  submitOrder(orderData) {
    return request({
      url: '/addRegister',
      method: 'POST',
      data: orderData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      }
    })
  }
}

export const refundApi = {
  /**
   * 根据真实姓名退号
   * @param {string} realName 就诊人真实姓名
   */
  refundByName(realName) {
    return request({
      url: `/refundByName?realName=${encodeURIComponent(realName)}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}