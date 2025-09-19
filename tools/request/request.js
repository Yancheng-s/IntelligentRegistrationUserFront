// utils/request.js

// const BASE_URL = 'http://47.86.168.28:8091'
const BASE_URL = 'http://localhost:8091'

/**
 * 封装uni.request请求（带超时中断功能）
 * @param {Object} options 请求配置
 * @param {string} options.url 请求地址
 * @param {Object} [options.data] 请求参数
 * @param {string} [options.method='GET'] 请求方法
 * @param {Object} [options.header={}] 请求头
 * @param {number} [options.timeout=10000] 超时时间(ms)，默认10秒
 * @returns {Promise} 返回Promise对象
 */
function request(options) {
  return new Promise((resolve, reject) => {
    let requestTask = null
    let timeoutTimer = null
    
    // 清除定时器
    const clearTimer = () => {
      if (timeoutTimer) {
        clearTimeout(timeoutTimer)
        timeoutTimer = null
      }
    }
    
    // 设置超时定时器
    timeoutTimer = setTimeout(() => {
      if (requestTask) {
        requestTask.abort()
        const error = new Error('请求超时')
        error.code = 'TIMEOUT'
        reject(error)
        console.error('请求超时:', options.url)
      }
    }, options.timeout || 100000)
    
    // 显示加载中
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
    
    requestTask = uni.request({
      url: BASE_URL + options.url,
      data: options.data || {},
      method: options.method || 'GET',
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        clearTimer()
        uni.hideLoading()
        
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          const error = new Error('请求失败')
          error.code = res.statusCode
          error.response = res
          reject(error)
          handleError(res)
        }
      },
      fail: (err) => {
        clearTimer()
        uni.hideLoading()
        reject(err)
        handleError(err)
      },
      complete: () => {
        clearTimer()
      }
    })
  })
}

/**
 * 错误处理
 * @param {Object} error 错误对象
 */
function handleError(error) {
  let errMsg = '请求失败'
  
  if (error.code === 'TIMEOUT') {
    errMsg = '请求超时，请检查网络'
  } else if (error.statusCode) {
    switch (error.statusCode) {
      case 400:
        errMsg = '请求错误'
        break
      case 401:
        errMsg = '未授权，请登录'
        break
      case 403:
        errMsg = '拒绝访问'
        break
      case 404:
        errMsg = '请求地址出错'
        break
      case 500:
        errMsg = '服务器内部错误'
        break
      default:
        errMsg = `连接错误 ${error.statusCode}`
    }
  } else {
    errMsg = '网络连接失败，请检查网络'
  }
  
  uni.showToast({
    title: errMsg,
    icon: 'none',
    duration: 2000
  })
  
  console.error('请求错误:', error)
}

export default request