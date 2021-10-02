<template>
  <div class="nav">
    <img v-bind:src="imgSource" />
    <div class="links">
      <router-link :to="{ name: 'Home' }">
        <aside>[</aside>
        <span>Home</span>
        <aside>]</aside>
      </router-link>
      <router-link :to="{ name: 'Portfolio' }">
        <aside>[</aside>
        <span>Portfolio</span>
        <aside>]</aside>
      </router-link>
      <router-link :to="{ name: 'Blog' }">
        <aside>[</aside>
        <span>Blog</span>
        <aside>]</aside>
      </router-link>
    </div>
  </div>
</template>

<script>
import imgSource from "@/assets/icons/letter_g.svg";

export default {
  name: "Navbar",
  data() {
    return {
      imgSource,
    };
  },
};
</script>

<style lang="sass" scoped>
.nav
  display: flex
  flex: auto
  flex-direction: row
  justify-content: space-between
  padding: 3vh 3vw

  img
    display: flex
    height: 3rem
    min-height: 3vh
    width: 3rem
    opacity: 0.7

  .links
    display: flex
    align-self: center
    font-size: 1.7vh
    a
      display: flex
      flex-direction: row
      color: #BFBFBF
      padding: 0 0.8vw
      text-decoration: none

      aside
        width: 15px
        &:first-child
          text-align: start
          transform: translateX(0px)
          transition: transform 200ms ease-in-out

        &:last-child
          text-align: end
          transform: translateX(0px)
          transition: transform 200ms ease-in-out

      &:hover
        & > aside:first-child
          transform: translateX(10px)
        & > aside:last-child
          transform: translateX(-10px)

      span
        font-weight: 300
        padding: 0 5px
        color: #BFBFBF

      &.router-link-exact-active
        span
          color: #a23034
</style>
