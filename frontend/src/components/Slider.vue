<template>
  <div class="glide" ref="glide">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides">
        <li class="glide__slide" v-for="slider in images" :key="slider.id">
          <img :src="path + 'images/sliders/' + slider.image" />
        </li>
      </ul>
    </div>
    <div class="glide__arrows" data-glide-el="controls">
      <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
        prev
      </button>
      <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
        next
      </button>
    </div>
    <div class="glide__bullets" data-glide-el="controls[nav]">
      <button
        class="glide__bullet"
        v-for="(slider, index) in images"
        :key="slider.id"
        :data-glide-dir="'=' + index"
      ></button>
    </div>
  </div>
</template>

<script>
import Glide from "@glidejs/glide";

export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  emits: {},
  data() {
    return {
      path: process.env.VUE_APP_PATH,
    };
  },
  components: {},
  methods: {},
  mounted() {
    new Glide(this.$refs.glide, {
      type: "slider",
      perView: 1,
    }).mount();
  },
};
</script>

<style lang="sass" scoped>
@import "node_modules/@glidejs/glide/src/assets/sass/glide.core"
@import "node_modules/@glidejs/glide/src/assets/sass/glide.theme"
.glide
  margin-top: 3.5vh
  overflow: hidden
  .glide__track
    ul.glide__slides
      li.glide__slide
        background-color: grey
        height: 60vh
        display: flex
        img
          width: inherit

  .glide__arrows
    button
      opacity: 0
      border-color: black
      color: black
      background-color: white
      transition: opacity 650ms ease-in

  .glide__bullets
    .glide__bullet
      opacity: 0
      transition: opacity 650ms ease-in
      background-color: rgba(black, 0.3)
    .glide__bullet--active
      opacity: 0
      transition: opacity 650ms ease-in
      background-color: rgba(black, 0.5)

  &:hover
    .glide__arrows
      button
        opacity: 0.7
    .glide__bullet, .glide__bullet--active
      opacity: 1
</style>
