import Vue from 'vue'
import App from './App.vue'
import router from './router'

import BootstrapVue from 'bootstrap-vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import firebase from './firebase'
firebase.analytics();

/* アドセンスのインポート */
import VueAdsense from 'vue-adsense'
/* アドセンスの使用宣言 */
Vue.component('adsense', VueAdsense)

Vue.config.productionTip = false

// ブレークポイント
import VueMq from "vue-mq";
const breakpoints = {
  sp: 400,
  pc: 1024
};
Vue.use(VueMq, { breakpoints });

// 認証ページのため
router.beforeEach((to, from, next) => {
  // toは行こうとしてるページ
  // fromは現在のページ
  // next()はtoへ
  let currentUser = firebase.auth().currentUser;
  if (to.matched.some(record => record.meta.requiredAuth)) {
    if (currentUser) {
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.path},
      });
    }
  }
  next();
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
