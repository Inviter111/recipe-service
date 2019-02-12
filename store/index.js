export const state = () => ({
    user: {
        username: '',
        admin: false,
        token: '',
    }
})
  
export const mutations = {
    setUser (state, user) {
        state.user = user
    },
    setToken(state, token) {
        state.user.token = token
    },
    setActive(state, active) {
        state.user.active = active
    }
}

export const getters = {
    isAuthenticated(state) {
        return state.auth.loggedIn
    },
    getUser(state) {
        return state.user.login
    },
}