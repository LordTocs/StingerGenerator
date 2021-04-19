import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueKofi from 'vue-kofi';

Vue.config.productionTip = false

Vue.use(VueKofi);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
