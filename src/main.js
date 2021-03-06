import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueKofi from 'vue-kofi';

import VScrollThreshold from 'v-scroll-threshold';
import Sticky from 'vue-sticky-directive';
import browserDetect from "vue-browser-detect-plugin";


Vue.config.productionTip = false


Vue.use(VScrollThreshold);
Vue.use(Sticky);
Vue.use(browserDetect);
Vue.use(VueKofi);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
