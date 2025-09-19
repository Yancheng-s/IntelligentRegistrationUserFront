// sendMsg.js

import request from '@/tools/request/request.js'

export const sendMsgApi = {
  getAiData(message, sessionId) {
    return request({
      url: '/api/hospitalGuide/chat',
      method: 'POST',
      data: { 
        message,
        sessionId 
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
