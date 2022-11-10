import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import store from './store'

import Home from '../src/pages/Home.vue'
import OnRamp from '../src/pages/OnRamp.vue'
import Pix from '../src/pages/Pix.vue'
import Bridge from '../src/pages/Bridge.vue'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/on-ramp', name: 'OnRamp', component: OnRamp },
        { path: '/bridge', name: 'Bridge', component: Bridge },
        { path: '/pix/:code', name: 'Pix', component: Pix },
    ]
})

createApp(App).use(router).use(store).mount('#app')
