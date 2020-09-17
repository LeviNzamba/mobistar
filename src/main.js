import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyC3E-gw7qSJIvkic69Q0ph4ddYE2V3pcH0',
  authDomain: 'mobistarhardware.firebaseapp.com',
  databaseURL: 'https://mobistarhardware.firebaseio.com',
  projectId: 'mobistarhardware',
  storageBucket: 'mobistarhardware.appspot.com',
  messagingSenderId: '593437825224',
  appId: '1:593437825224:web:84d940142e36a8603fedfd',
  measurementId: 'G-RZYR3577E6'
}

firebase.initializeApp(firebaseConfig)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
