import axios from 'axios'
import Cookies from 'js-cookie'

// state
export const state = () => ({
  user: null,
  token: null,
  profile: null,
})

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  check: state => state.user !== null,
  profile: state => state.profile,
}

// mutations
export const mutations = {
  SET_TOKEN (state, token) {
    state.token = token
  },

  FETCH_USER_SUCCESS (state, user) {
    state.user = user
  },

  FETCH_USER_FAILURE (state) {
    state.token = null
  },

  LOGOUT (state) {
    state.user = null
    state.token = null
  },

  UPDATE_USER (state, { user }) {
    state.user = user
  },

  FETCH_PROFILE(state, data) {
    state.profile = data
  }
}

// actions
export const actions = {
  saveToken ({ commit, dispatch }, { token, remember }) {
    commit('SET_TOKEN', token)

    Cookies.set('token', token, { expires: remember ? 365 : null })
  },

  async fetchUser ({ commit }) {
    try {
      const { data } = await axios.get('/user')
      commit('FETCH_USER_SUCCESS', data)
    } catch (e) {
      Cookies.remove('token')

      commit('FETCH_USER_FAILURE')
    }
  },

  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  async logout ({ commit }) {
    try {
      await axios.post('/logout')
    } catch (e) { }

    Cookies.remove('token')

    commit('LOGOUT')
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await axios.post(`/oauth/${provider}`)

    return data.url
  },

  async fetchProfile ({ commit }, slug) {
    try {
      let url = `/get_profile/${slug}`;
      const { data } = await axios.get(url)
      if(data.status == 200) {
        commit('FETCH_PROFILE', data.profile)
      }      
    } catch (e) {
        console.log(e)
    }
  },
}
