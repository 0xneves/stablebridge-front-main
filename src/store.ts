
import { createStore } from 'vuex'

export default createStore({
  state: {
    currentNetwork: '',
    accountAddress: '',
    accountBalance: '',
    accountAddressFormatted: '',
    contractAddress: '',
    pixData: {}
  },
  mutations: {
    SET_ACCOUNT_ADDRESS: (state, payload) => {
      state.accountAddress = payload
      state.accountAddressFormatted = `${payload.slice(0, 6)}...${payload.slice(payload.length - 5, payload.length)}`
    },
    SET_ACCOUNT_BALANCE: (state, payload) => {
      state.accountBalance = payload
    },
    SET_CURRENT_NETWORK: (state, payload) => {
      state.currentNetwork = payload
    },
    SET_PIX_DATA: (state, payload) => {
      state.pixData = { ...payload };
    },
    SET_CONTRACT_ADDRESS: (state, payload) => {
      state.contractAddress = payload;
    },
  },
  actions: {
    updateAccountAddress({ commit }, payload) {
      commit('SET_ACCOUNT_ADDRESS', payload)
    },
    updateAccountBalance({ commit }, payload) {
      commit('SET_ACCOUNT_BALANCE', payload)
    },
    updateCurrentNetwork({ commit }, payload) {
      commit('SET_CURRENT_NETWORK', payload)
    },
    updatePixData({ commit }, payload) {
      commit('SET_PIX_DATA', payload)
    },
    updateContractAddress({ commit }, payload) {
      commit('SET_CONTRACT_ADDRESS', payload)
    },
  },
  getters: {
    getAccountBalance: (state) => state.accountBalance,
    getAccountAddress: (state) => state.accountAddress,
    getAccountAddressFormatted: (state) => state.accountAddressFormatted,
    getCurrentNetwork: (state) => state.currentNetwork,
    getPixData: (state) => state.pixData,
    getContractAddress: (state) => state.contractAddress,
  },
})