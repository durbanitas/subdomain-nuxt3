import type { RouterOptions } from "@nuxt/schema";

export default <RouterOptions>{
  routes: (_routes) => {
    // Only proceed with routing adjustments in client context
    if (process.client) {
      const { ssrContext } = useNuxtApp();

      // Extract subdomain directly from `ssrContext` if available
      let subdomain = useCookie("subdomain").value;
      if (ssrContext?.event.context.subdomain) {
        subdomain = ssrContext.event.context.subdomain;
        useCookie("subdomain").value = subdomain;
      }

      // Handle specific domain configurations for `www.cofund.ing` or other valid subdomains
      if (subdomain === "www" || !subdomain) {
        // Adjust the routes for `https://www.cofund.ing` or the main domain itself
        return _routes;
      } else if (subdomain) {
        // Filter routes to subdomain-specific folders if any
        const userRoute = _routes.filter((i) => {
          return i.path.startsWith(`/${subdomain}`);
        });

        // Map routes to correct paths for the current subdomain
        const userRouteMapped = userRoute.map((i) => ({
          ...i,
          path: i.path.replace(`/${subdomain}`, ""),
        }));

        return userRouteMapped;
      }
    }

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
