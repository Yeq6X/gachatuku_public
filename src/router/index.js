import Vue from 'vue'
import VueRouter from 'vue-router'
import Top from '../views/Top.vue'
import Ranking from '../views/Ranking.vue'
import NewArrivals from '../views/NewArrivals.vue'
// import Hot from '../views/Hot.vue'
// import Search from '../views/Search.vue'
import Create from '../views/Create.vue'
import Edit from '../views/Edit.vue'
import LogIn from '../views/LogIn.vue'
import User from '../views/User.vue'
import AppPage from '../views/AppPage.vue'
import Terms from '../views/Terms.vue'
import Privacy from '../views/Privacy.vue'
import Error404 from '../views/Error404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Top',
    component: Top,
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking,
  },
  {
    path: '/new_arrivals',
    name: 'NewArrivals',
    component: NewArrivals,
  },
  // {
  //   path: '/hot',
  //   name: 'Hot',
  //   component: Hot,
  // },
  // {
  //   path: '/search',
  //   name: 'Search',
  //   component: Search,
  // },
  {
    path: '/create',
    name: 'Create',
    component: Create,
    meta: { requiredAuth: true } //コンポーネントの表示に認証が必要と定義する
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn,
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
  },
  {
    path: '/app/:id',
    name: 'AppPage',
    component: AppPage,
  },
  {
    path: '/app/:id/edit',
    name: 'Edit',
    component: Edit,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  },
  {
    path: '*',
    name: 'Erorr404',
    component: Error404,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  // 戻る進むではスクロール位置保存、新しい遷移では先頭
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
