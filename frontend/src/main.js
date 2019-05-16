import Vue from "vue"
import App from "./App.vue"
import Components from "./components/_index"
import VModal from "vue-js-modal"

Vue.use(VModal)

Vue.config.productionTip = false

Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

new Vue({
  el: "#app",
  template: "<App/>",
  components: { App }
})