import { App } from "./App.js";
import dropAreaLabel from "./helpers/dropArea.js";
//import { firebaseData } from "./helpers/firebase.js";



if('serviceWorker' in navigator){
  navigator.serviceWorker.register('../sw.js')
  .then(reg=>reg)
  .catch(err=>err)
}

document.addEventListener("DOMContentLoaded", () => {
 // firebaseData();
  App();
});
