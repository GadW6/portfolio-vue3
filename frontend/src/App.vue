<template>
  <div>
    <div v-if="isMobile()" style="text-align: center">
      <h1 style="font-size: 5rem; color: red; font-weight: 100; margin: 3vh 0">
        x
      </h1>
      <h2 style="font-size: 3rem; font-weight: 300">Sorry</h2>
      <p>The mobile version hasn't been created yet</p>
    </div>
    <div v-else>
      <Navbar />
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component v-bind:is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  methods: {
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap')

// Varibales
$roboto: 'Roboto', serif
$backgroundColor: #4E5158
$fontColor: #BFBFBF

body
  background-color: $backgroundColor
  padding: 0
  margin: 0
  box-sizing: border-box
  *:focus
    outline: none

#app
  font-family: $roboto
  color: $fontColor
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale

  .page-fade-enter-active,
  .page-fade-leave-active
    transition: opacity 400ms ease-in-out
  .page-fade-enter-from,
  .page-fade-leave-to
    opacity: 0
</style>
