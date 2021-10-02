<template>
  <div id="project" v-if="!error && !spinner">
    <header>
      <h2 class="container">{{ project.title }}</h2>
      <h6 class="container">
        <span v-if="project.description">{{ project.description }}</span>
        <span v-else style="visibility: hidden"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit.</span
        >
        <span>{{ project.createdAt }}</span>
      </h6>
    </header>

    <div class="container main-body">
      <div class="image">
        <img v-if="project.image" :src="path + 'images/projects/' + project.image" />
      </div>
      <div class="description">
        <h4>Description:</h4>
        <p>{{ project.fullDescription }}</p>
      </div>
      <div class="goto">
        <a :href="project.linkSite" target="_blank">
          <svg class="svg-icon" viewBox="0 0 20 20">
            <path
              d="M17.701,3.919H2.299c-0.223,0-0.405,0.183-0.405,0.405v11.349c0,0.223,0.183,0.406,0.405,0.406h15.402c0.224,0,0.405-0.184,0.405-0.406V4.325C18.106,4.102,17.925,3.919,17.701,3.919 M17.296,15.268H2.704V7.162h14.592V15.268zM17.296,6.352H2.704V4.73h14.592V6.352z M5.947,5.541c0,0.223-0.183,0.405-0.405,0.405H3.515c-0.223,0-0.405-0.182-0.405-0.405c0-0.223,0.183-0.405,0.405-0.405h2.027C5.764,5.135,5.947,5.318,5.947,5.541"
            ></path>
          </svg>
          <span>To Site</span>
        </a>
        <a :href="project.linkGit" target="_blank">
          <svg class="svg-icon" viewBox="0 0 24 24">
            <path
              d="M2.6,10.59L8.38,4.8L10.07,6.5C9.83,7.35 10.22,8.28 11,8.73V14.27C10.4,14.61 10,15.26 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.26 13.6,14.61 13,14.27V9.41L15.07,11.5C15,11.65 15,11.82 15,12A2,2 0 0,0 17,14A2,2 0 0,0 19,12A2,2 0 0,0 17,10C16.82,10 16.65,10 16.5,10.07L13.93,7.5C14.19,6.57 13.71,5.55 12.78,5.16C12.35,5 11.9,4.96 11.5,5.07L9.8,3.38L10.59,2.6C11.37,1.81 12.63,1.81 13.41,2.6L21.4,10.59C22.19,11.37 22.19,12.63 21.4,13.41L13.41,21.4C12.63,22.19 11.37,22.19 10.59,21.4L2.6,13.41C1.81,12.63 1.81,11.37 2.6,10.59Z"
            ></path>
          </svg>
          <span>To Git</span>
        </a>
      </div>
      <Slider
        v-if="project.sliderImages && project.sliderImages.length > 0"
        :images="project.sliderImages"
      />
      <div class="technologies">
        <h4>Technologies:</h4>
        <p>{{ project.techUsedDesc }}</p>
        <ul class="tech-gallery">
          <li v-for="tag in project.techUsedImages" :key="tag.id">
            <img :title="tag.name" :src="path + 'images/tags/' + tag.image" />
          </li>
        </ul>
      </div>
      <div class="conclusion" v-if="project.conclusion">
        <h4>Conclusion:</h4>
        <p>{{ project.conclusion }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="error && !spinner" style="text-align: center;
    margin-top: 15vh;">
    {{ project.msg }}
  </div>
  <FulfillingBouncingCircleSpinner
    v-else-if="spinner"
    :animation-duration="4000"
    :size="80"
    color="#a23034"
  />
</template>

<script>
import Slider from "../components/Slider.vue";
import axios from "axios";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";

export default {
  props: {},
  emits: {},
  data() {
    return {
      path: process.env.VUE_APP_PATH,
      project: {},
      spinner: false,
      error: false
    };
  },
  components: {
    Slider,
    FulfillingBouncingCircleSpinner,
  },
  methods: {},
  async mounted() {
    this.spinner = true;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    try {
      const projectResponse = await axios.get(
        `${process.env.VUE_APP_PATH}projects/${this.$route.params.slug}`
      );
      const d = new Date(projectResponse.data.createdAt);
      projectResponse.data.createdAt = `${
        months[d.getMonth()]
      } ${d.getDate()}, ${d.getFullYear()}`;
      return this.project = projectResponse.data;
    } catch (error) {
      this.error = true
      return this.project = error.response.data
    } finally {
      this.spinner = false;
    }
  },
};
</script>

<style lang="sass" scoped>
#project
  .container
    width: 60vw
    margin: 0 auto
  header
    background-color: rgba(white, 0.2)
    height: 35vh
    h2
      font-size: 5vh
      font-weight: 500
      padding: 2vh 0 0
    h6
      font-size: 2.5vh
      font-weight: 300
      display: flex
      flex-direction: row
      justify-content: space-between

  .main-body
    position: relative
    top: -21vh
    font-weight: 300
    & > div.image img
      max-height: 44vh
      height: auto
      width: 100%
      border-radius: 15px
    & > div.description, div.technologies, div.conclusion
      h4
        font-weight: 500
        font-size: 2.5vh
        margin: 3vh 0 1vh
      p
        margin-top: 0
        font-size: 2vh

    & > div.goto
      margin-top: 5vh
      display: flex
      flex-direction: row
      a
        display: flex
        flex-direction: row
        text-decoration: none
        padding: 1vh 1.5vw
        font-size: 2vh
        &:first-child
          border-radius: 15px 0 0 15px
          color: rgba(white, 0.7)
          background-color: rgba(white, 0.2)
        &:last-child
          color: rgba(white, 0.7)
          background-color: rgba(black, 0.2)
          border-radius: 0 15px 15px 0
        & > .svg-icon
          height: 3vh
          fill: rgba(white, 0.4)
        &:hover > .svg-icon
          fill: rgba(#a23034, 0.7)
        & > span
          margin: 0 1vw

    & > div.technologies
      ul.tech-gallery
        display: flex
        flex-direction: row
        flex-wrap: wrap
        list-style: none
        padding: 0
        li
          margin-right: 2em
          margin-top: 2em
          &:last-child
            margin-right: 0
          img
            min-height: 8vh
            width: 4vw
.fulfilling-bouncing-circle-spinner
  margin: 15vh auto 0
</style>
