import { App } from "./App.js";

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('../sw.js')
  .then(reg=>console.log("Reg exitoso", reg))
  .catch(err=>console.log("Error SW", err))
}

document.addEventListener("DOMContentLoaded", () => {
  App();
});

window.addEventListener("hashchange", () => {
  //console.log(api.API_WP);
  App();
});
