<template>
  <div id="gallery">
    <div
      v-for="project in projects"
      v-bind:key="project.id"
      class="card-project"
    >
      <router-link
        v-bind:to="{ name: 'Project', params: { slug: project.slug } }"
        class="card"
      >
        <div class="card-image">
          <img
            v-if="project.image"
            :src="path + 'images/projects/' + project.image"
          />
          <img
            v-else
            src="https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          />
        </div>
        <div class="card-title">
          {{ project.title }}
        </div>
        <div class="card-tags">
          <span v-for="tag in project.tags" v-bind:key="tag.id">{{
            tag.name
          }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    projects: Array,
  },
  data() {
    return {
      path: process.env.VUE_APP_PATH,
    };
  },
};
</script>

<style lang="sass" scoped>
#gallery
  position: relative
  display: flex
  flex-direction: row
  flex-wrap: wrap
  margin: 1vh 10vw 5vh
  & > h3
    font-weight: 100
    font-size: 3rem
    margin: 7vh auto
  & > div.card-project
    width: calc(100%/3)
    height: 280px
    & > a.card
      display: flex
      flex-direction: column
      justify-content: space-between
      border-radius: 15px
      height: stretch
      margin: 10px
      background-color: rgba(white, 0.1)
      border: 1px #707070 solid
      box-shadow: 3px 3px 6px rgba(black, 0.3)
      text-decoration: none
      color: inherit
      &:hover
        border-color: rgba(#a23034, 0.8)
      & > div.card-image
        height: 180px
        display: block
        & > img
          border-bottom: 1px rgba(white, 0.2) solid
          padding-bottom: 2px
          border-radius: 15px 15px 0 0
          height: 180px
          width: 100%
      & > div.card-title
        text-align: center
        margin-bottom: 3px
        font-size: 1.5rem
        font-weight: 300
      & > div.card-tags
        display: block
        width: calc(100% - 20px)
        margin: 0 auto 3px
        overflow-x: scroll
        padding: 0 4px 4px
        align-self: self-end
        white-space: nowrap
        &::-webkit-scrollbar
          display: none
          scroll-behavior: smooth
        & > span
          font-size: 12px
          margin: 0 0.2rem 0.2rem 0
          background-color: rgba(white, 0.1)
          border: 1px rgba(white, 0.2) solid
          transition: all 200ms ease-in-out
          border-radius: 15px
          padding: 1px 10px
          color: rgba(white, 0.5)
</style>
