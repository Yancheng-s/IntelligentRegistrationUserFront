// test.js

import request from '@/tools/request/request.js'

export const testApi = {
  /**
   * 测试接口
   * @param {Object} params 参数
   * @param {string} params.name 姓名
   * @param {number} params.age 年龄
   * @param {number} [timeout=3000] 超时时间(ms)
   * @returns {Promise} 返回Promise对象
   */
  getTestData(params, timeout = 3000) {
    return request({
      url: '/test',
      method: 'GET',
      data: params,
      timeout: timeout
    })
  }
}