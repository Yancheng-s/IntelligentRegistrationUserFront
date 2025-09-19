// SearchDoctorInformation.js

import request from '@/tools/request/request.js'

export const SearchDoctorInformationApi = {
  getDoctorData(params) {
    return request({
      url: '/api/searchDoctorInformation', // 添加/api前缀
      method: 'POST',
      data: params,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export const getAlreadyRegisterPatientsApi = {
  getAlreadyRegisterPatients(data) {
    return request({
      url: '/getAlreadyRegisterPatients',
      method: 'POST',
      data,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}