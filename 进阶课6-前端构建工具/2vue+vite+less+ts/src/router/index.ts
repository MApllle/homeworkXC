import {
    createRouter,
    createWebHashHistory,
    RouteRecordRaw,
  } from "vue-router";
  
  import Home from "@/views/home.vue";
  import Page1 from "@/views/page1.vue";
  import Page2 from "@/views/page2.vue";
  
  const routes: Array<RouteRecordRaw> = [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/page1",
      name: "page1",
      component: Page1,
    },
    {
      path: "/page2",
      name: "page2",
      component: Page2,
    },
  ];
  
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  
  export default router;
  