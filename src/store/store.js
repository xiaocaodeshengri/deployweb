import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        username: null,
        name: null,
        token: null,
        title: '',
        role: null,
        category: null
    },
    mutations: {
        [types.LOGIN]: (state, data) => {
            localStorage.token = data;
            state.token = data;
        },
        [types.USERNAME]: (state, data) => {
            localStorage.username = data;
            state.username = data;
        },
        [types.NAME]: (state, data) => {
            localStorage.name = data;
            state.name = data;
        },
        [types.ROLE]: (state, data) => {
            localStorage.role = data;
            state.role = data;
        },
        [types.CATEGORY]: (state, data) => {
            localStorage.category = data;
            state.category = data;
        },
        [types.CATEGORY_ID]: (state, data) => {
            localStorage.category_id = data;
            state.category_id = data;
        },
        [types.LOGOUT]: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.removeItem('role');
            localStorage.removeItem('category');
            localStorage.removeItem('category_id');
            state.token = null
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        },
    }
})