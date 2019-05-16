<template>
  <div class="wrap">
    <config class="left" v-on:setting="setting"></config>
    <calendar class="right" :config="config"></calendar>
  </div>
</template>

<script>
import api from "./store/api"

export default {
  name: "App",
  data() {
    return {
      config: {
        startTime: 0,
        endTime: 23,
        location: [],
        allLocation: true,
        tags: [],
        allTag: true,
      },
    }
  },
  methods: {
    setting(val) {
      this.config = val
    }
  },
  beforeCompile() {
    api.crawling()
  }
}
</script>

<style>
@import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);

body {
  margin: 0;
  font-family: "Noto Sans TC";
}

.wrap {
  display: grid;
  grid-template-columns: 20% 80%;
  height: 100vh;
  width: 100vw;
}

/* Ripple effect */
.ripple {
  background-position: center;
  transition: background 0.5s;
}
.ripple:hover {
  background: #2f76e0 radial-gradient(circle, transparent 1%, #2f76e0 1%) center/15000%;
}
.ripple:active {
  background-color: #6e9ef7;
  background-size: 100%;
  transition: background 0s;
}

</style>
