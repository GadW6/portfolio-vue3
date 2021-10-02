<template>
  <div>
    <h2>404</h2>
    <h6>You got lost! Go <router-link to="/">back</router-link></h6>
  </div>
</template>

<script>
export default {
  name: "404",
};
</script>

<style lang="sass" scoped>
div
  text-align: center
  h2
    margin: 4rem 0 0
    color: #B5363A
    font-size: 12rem
    font-weight: 600
    text-shadow: 2px 2px #812629
  h6
    margin: 0
    font-size: 2rem
    font-weight: 300
    a
      text-decoration: none
      border-bottom: 1px rgba(white, 0.3) solid
      color: inherit
      transition: all 250ms ease-in-out
      &:hover
        border-bottom-color: rgba(#B5363A, 0.6)
</style>
