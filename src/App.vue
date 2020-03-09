<template>
  <div id="app">
    <router-view :shortKeys="shortKeys" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      shortKeys: {
        c: null,
        s: null,
        a: null
      }
    };
  },
  created() {
    document.onkeydown = this.Keys;
    document.onkeyup = this.Keys;
  },
  methods: {
    Keys(e) {
      switch (e.type) {
        case "keydown":
          if (e.keyCode === 17) {
            this.shortKeys.c = 17;
          } else if (e.keyCode === 39) {
            this.shortKeys.s = 39;
          }
          break;
        case "keyup":
          if (e.keyCode === 17) {
            this.shortKeys.c = null;
          } else if (e.keyCode === 39) {
            this.shortKeys.s = null;
          }
          break;
        default:
      }
    }
  }
};
</script>
<style>
#app {
  height: 100%;
}
</style>
