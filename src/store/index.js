import "babel-polyfill";
import Vuex from 'vuex'
import Vue from 'vue'
import state from './state.js'
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
