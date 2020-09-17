import Vue from 'vue'
import VueRouter from 'vue-router'
import Shop from '../views/Shop.vue'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Purchases from '../views/Purchases.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Shop',
    name: 'Shop',
    component: Shop
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path:'/Cart',
    name:'Cart',
    component: Cart

  },
  {
    path:"/Checkout",
    name:"Checkout",
    component: Checkout
  },
  {
    path:"/Purchases",
    name:"Purchases",
    component: Purchases
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
