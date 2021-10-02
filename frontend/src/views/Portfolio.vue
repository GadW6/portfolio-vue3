<template>
  <div>
    <Search
      v-if="tags.length > 0 && spinner === false"
      v-bind:tags="tags"
      @selected-tags="selectedTags($event)"
      @input-search="inputSearch($event)"
    />
    <GalleryProject
      v-if="selectedProjectsArray.length > 0 && spinner === false"
      v-bind:projects="selectedProjectsArray"
    />
    <div
      v-else-if="selectedProjectsArray.length === 0 && spinner === false"
      id="gallery"
    >
      <h3>No Project Found...</h3>
    </div>
    <FulfillingBouncingCircleSpinner
      v-else-if="spinner"
      :animation-duration="4000"
      :size="60"
      color="#a23034"
    />
  </div>
</template>

<script>
import axios from "axios";
import Search from "@/components/Search.vue";
import GalleryProject from "@/components/GalleryProject.vue";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";
export default {
  name: "Portfolio",
  components: {
    Search,
    GalleryProject,
    FulfillingBouncingCircleSpinner,
  },
  data() {
    return {
      projects: [],
      selectedProjectsArray: [],
      tags: [],
      spinner: false,
    };
  },
  methods: {
    selectedTags([...payloads]) {
      const projectsToFilter = [...this.projects];

      this.selectedProjectsArray = projectsToFilter.filter((project) => {
        const outputs = project.tags.map((tag) => {
          return payloads.includes(tag.id);
        });
        let count = 0;
        outputs.forEach((output) => (output === true ? count++ : null));
        return payloads.length === count ? true : false;
      });
    },
    inputSearch(payloads) {
      const projectsToFilter = [...this.projects];
      const splitPayloads = payloads
        .split(" ")
        .filter((payload) => payload !== "");

      this.selectedProjectsArray = projectsToFilter.filter((project) => {
        const isIncluded = (word, payload) =>
          word.toLowerCase().includes(payload.toLowerCase());
        const isValid = (subjects, payloads, cases) => {
          return subjects.filter((subject) => {
            return payloads.find((payload) => {
              switch (cases) {
                case "tags":
                  return isIncluded(subject.name, payload);
                case "title":
                  return isIncluded(subject, payload);
              }
            });
          });
        };

        const tagsCount = isValid(project.tags, splitPayloads, "tags").length;
        const titleCount = isValid(
          project.title.split(" "),
          splitPayloads,
          "title"
        ).length;

        // FILTERING ALGORITHM
        const STRICT = 0;
        const LOOSE = 1;
        switch (splitPayloads.length) {
          case 0:
            return true;
          case 1:
          case 2:
            return titleCount + tagsCount >= splitPayloads.length - STRICT;
          default:
            return titleCount + tagsCount >= splitPayloads.length - LOOSE;
        }
      });
    },
  },
  async mounted() {
    this.spinner = true;
    try {
      const tagsResponse = await axios.get(process.env.VUE_APP_PATH + "tags");
      const projectsResponse = await axios.get(
        process.env.VUE_APP_PATH + "projects"
      );
      this.tags = tagsResponse.data;
      this.projects = projectsResponse.data;
      this.selectedProjectsArray = [...this.projects];
    } catch (error) {
      console.log(error);
    } finally {
      this.spinner = false;
    }
  },
};
</script>

<style lang="sass" scoped>
#gallery
  h3
    font-weight: 300
    text-align: center
    margin-top: 15vh
.fulfilling-bouncing-circle-spinner
  margin: 15vh auto 0
</style>
