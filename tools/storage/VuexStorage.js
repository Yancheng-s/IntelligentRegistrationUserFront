// VuexStorage.js

import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      currentPatient: null,   // 存储当前选中的原始就诊人数据
      user: null,
      token: ''
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setToken(state, token) {
      state.token = token
    },
    setCurrentPatient(state, rawPatientData) {
        state.currentPatient = rawPatientData
    },
    clearUser(state) {
      state.user = null
      state.token = ''
      state.selectedPatient = null
    }
  },
  getters: {
    getCurrentPatient: state => state.currentPatient
  }
})

export default store