<template>
  <div id="search">
    <div class="titles">
      <h4>Search:</h4>
      <h4>Tags:</h4>
    </div>
    <div class="contents">
      <div>
        <input
          @input="$emit('input-search', text)"
          v-model="text"
          type="text"
        />
      </div>
      <div class="tags">
        <button
          v-for="tag in tags"
          @click="btnEvent(tag.id)"
          v-bind:class="state(tag.id)"
          v-bind:key="tag.id"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    tags: Array,
  },
  emits: {
    "selected-tags": null,
    "input-search": null,
  },
  data() {
    return {
      text: "",
      tagsSelected: [],
    };
  },
  methods: {
    btnEvent(id) {
      const index = this.tagsSelected.indexOf(id);
      if (this.tagsSelected.includes(id)) this.tagsSelected.splice(index, 1);
      else this.tagsSelected.push(id);
      this.$emit("selected-tags", this.tagsSelected);
    },
    state(id) {
      return this.tagsSelected.includes(id) ? "on" : null;
    },
  },
};
</script>

<style lang="sass" scoped>
#search
  position: relative
  display: flex
  flex-direction: row
  padding: 0 20vw

  .titles
    display: inline-flex
    flex-direction: column
    margin-right: 1rem
    h4
      font-weight: 300
      height: 1.5rem
      font-size: 1.2rem
      line-height: 1.5rem
      margin: 0
      &:first-child
        margin-bottom: 15px

  .contents
    display: inline-flex
    position: relative
    flex-direction: column
    width: 100%
    div
      height: 1.5rem
      line-height: 1.5rem
      font-size: 0.7rem
      &:first-child
        margin-bottom: 15px
      &.tags
        height: auto
      & > input
        position: absolute
        font-size: 0.8rem
        padding: 0.4rem 0.6rem
        border-radius: 15px
        background-color: rgba(white, 0.3)
        border: none
        width: 80%
        &:focus
          color: black
          background-color: rgba(white, 0.6)

      & > button
        height: 1.5rem
        margin: 0 0.3rem 0.3rem 0
        background-color: rgba(white, 0.1)
        border: 1px rgba(white, 0.2) solid
        transition: all 200ms ease-in-out
        cursor: pointer
        border-radius: 15px
        padding: 0 15px
        color: rgba(white, 0.5)
        &.on
          background-color: rgba(white, 0.4)
          color: rgba(white, 0.9)
        &:hover:not(.on)
          border: 1px rgba(white, 0.3) solid
          background-color: rgba(white, 0.2)
</style>
