import { App } from "./App.js";

document.addEventListener("DOMContentLoaded", () => {
  App();
});

window.addEventListener("hashchange", () => {
  //console.log(api.API_WP);
  App();
});
