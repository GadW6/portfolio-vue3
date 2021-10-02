<template>
  <div>
    <div class="hero">
      <img v-bind:src="avatar" />
      <h1>Hello World...</h1>
      <p>
        My name is Gary Weintraub, I am a Full Stack Developer, mainly
        Javascript driven with great experience in DevOps and Linux System
        Management.
      </p>
      <RoundedLinks />
      <ScrollDown />
    </div>
    <div class="skills">
      <header>
        <h2>Skills Overview:</h2>
        <p>
          I have 4 years of experience in the hi-tech world, 1 year as an IT
          technician, 2 years as a DevOps Operator and 1 year as a Full Stack
          Developer
        </p>
      </header>
      <div class="cards" v-if="isDisplaysValid">
        <div class="card" v-for="display in displays" v-bind:key="display.id">
          <div class="card-title">
            <h4>{{ display.name }}</h4>
          </div>
          <div class="card-body">
            <ul>
              <li v-for="skill in display.skills" v-bind:key="skill.id">
                - {{ skill.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from "@/assets/avatar.png";
import RoundedLinks from "@/components/RoundedLinks.vue";
import ScrollDown from "@/components/ScrollDown.vue";

import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      avatar,
      displays: [],
    };
  },
  methods: {
    isDisplaysValid() {
      return this.displays > 0 ? true : false;
    },
  },
  components: {
    RoundedLinks,
    ScrollDown,
  },
  async mounted() {
    const { data } = await axios.get(process.env.VUE_APP_PATH + "display");
    this.displays = data;
  },
};
</script>

<style lang="sass" scoped>
$fontColor: #BFBFBF
.hero
  display: block
  margin: 0 auto
  text-align: center
  height: 83vh
  position: relative
  border-bottom: 1px solid rgba(white, 0.03)
  img
    width: 13vw
  h1
    color: $fontColor
    font-size: 4rem
    font-weight: 100
    margin: 0
  p
    color: $fontColor
    font-size: 1.4rem
    font-weight: 100
    width: 50vw
    margin: 2vh auto

.skills
  height: 96vh
  display: block
  text-align: center
  color: $fontColor
  position: relative
  header
    max-width: 50vw
    margin: 10vh auto 0
    h2
      font-size: 3.5rem
      font-weight: 100

  .cards
    display: flex
    flex-direction: row
    justify-content: space-around
    margin: 15vh 10vw 0
    .card
      .card-title
        text-align: left
        position: relative
        h4
          display: inline
          position: absolute
          margin-left: -2rem
          margin-top: -2rem
          font-weight: 100
          padding: 1rem
          font-size: 2rem
          background-color: #61646A
          box-shadow: 0px 3px 6px rgba(black, 0.16)


      .card-body
        padding: 4vh
        background-color: #54565D
        box-shadow: 7px 13px 7px #3F4248
        ul
          list-style: none
          margin: 0
          padding: 0
          width: 17vw
          height: 35vh
          margin-top: 3rem
          text-align: left
          font-size: 1.3rem
          color: rgba($fontColor, 1.7)
          font-weight: 300
          li
            margin: 0.6rem 0
</style>
