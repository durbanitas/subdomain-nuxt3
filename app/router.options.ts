import type { RouterOptions } from "@nuxt/schema";

export default <RouterOptions>{
  routes: (_routes) => {
    const { ssrContext } = useNuxtApp();

    // Get the current subdomain
    let subdomain = useCookie("subdomain").value;
    if (ssrContext?.event.context.subdomain) {
      subdomain = ssrContext.event.context.subdomain;
      useCookie("subdomain").value = subdomain;
    }

    // If we are on the main domain or `www`, return all routes directly
    if (subdomain === "www" || !subdomain) {
      return _routes;
    }

    // Filter routes based on the `demo` folder if the subdomain is `demo`
    if (subdomain === "demo") {
      const demoRoutes = _routes.filter((i) => i.path.startsWith(`/${subdomain}`));

      // Map paths to remove the `demo` folder prefix
      const demoRoutesMapped = demoRoutes.map((i) => ({
        ...i,
        path: i.path.replace(`/${subdomain}`, ""),
      }));

      return demoRoutesMapped;
    }

    // Default: return all routes if no subdomain-specific mapping is needed
    return _routes;
  },
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      const el = document.querySelector(to.hash) as HTMLElement;
      return { left: 0, top: (el?.offsetTop ?? 0) - 30, behavior: "smooth" };
    }

    if (to.fullPath === from.fullPath) return;
    return { left: 0, top: 0, behavior: "smooth" };
  },
};
