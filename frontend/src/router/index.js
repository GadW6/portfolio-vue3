import { createRouter, createWebHistory } from "vue-router";
// import Home from "../views/Home.vue";
// import Project from "../views/Project.vue";
// import Portfolio from "../views/Portfolio.vue";
// import Blog from "../views/Blog.vue";
// import NotFound from "../views/404.vue";

// const regex = new RegExp("/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi")

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    component: () =>
      import(/* webpackChunkName: "Portfolio" */ "../views/Portfolio.vue"),
  },
  {
    path: "/portfolio/:slug",
    name: "Project",
    component: () =>
      import(/* webpackChunkName: "Project" */ "../views/Project.vue"),
  },
  {
    path: "/blog",
    name: "Blog",
    component: () =>
      import(/* webpackChunkName: "Portfolio" */ "../views/Blog.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../views/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
