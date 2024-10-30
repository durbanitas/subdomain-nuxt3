import type { RouterOptions } from "@nuxt/schema";

export default <RouterOptions>{
  routes: (_routes) => {
    // Get the current URL from the cookie
    const currentUrl = useCookie("currentUrl").value;
    console.log('currentUrl app:', currentUrl);
    let slug = null;
    let page = "";

    // Check if the current URL matches either localhost or cofund.ing domains
    const isValidDomain = /^(localhost:3000|cofund\.ing|demo\.cofund\.ing)$/.test(window.location.hostname);

    if (currentUrl && isValidDomain) {
      // Extract the slug based on the valid domain
      slug = currentUrl.match(/(?<=\b(localhost:3000[/]|cofund.ing[/]|demo.cofund.ing[/])\b).+/g);
    }

    if (slug) {
      page = slug[0];
      // Remove trailing slash if present
      if (currentUrl.charAt(currentUrl.length - 1) === "/") {
        page = page.substring(0, page.length - 1);
      }
    }

    const { ssrContext } = useNuxtApp();
    let subdomain = useCookie("subdomain").value;
    console.log('subdomain', subdomain);

    if (ssrContext?.event.context.subdomain) {
      subdomain = ssrContext?.event.context.subdomain;
      useCookie("subdomain").value = subdomain;
    }

    // If there is a valid subdomain
    if (subdomain) {
      // Filter the routes based on the subdomain and page
      const userRoute = _routes.filter((i) => {
        if (page) return i.path === `/${subdomain}/${page}`;
        else return i.path === `/${subdomain}`;
      });

      // Map the filtered routes to replace the paths appropriately
      const userRouteMapped = userRoute.map((i) => ({
        ...i,
        path: page
          ? i.path === `/${subdomain}/${page}`
            ? i.path.replace(`/${subdomain}/${page}`, `/${page}`)
            : i.path.replace(`/${subdomain}/${page}/`, `/${page}`)
          : i.path === `/${subdomain}`
          ? i.path.replace(`/${subdomain}`, "/")
          : i.path.replace(`/${subdomain}/`, "/"),
      }));

      return userRouteMapped;
    }
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
