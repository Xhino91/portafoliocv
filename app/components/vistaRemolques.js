import {
  getDatabase,
  ref,
  get,
  onValue,
  onChildChanged,
  update
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { tabActive } from "./tabActive.js";
import { renderTableCV } from "./renderTableCV.js";
import { ItemV } from "./ItemV.js";


 export function cargarVistaRemolques(user) {
  const db = getDatabase(), d = document;
  const refItems = ref(db, "subitem1");
  let modal = document.getElementById("myModal");
  let keyUpdate = null, initialData = {},
  updateValue = {}; 
  localStorage.vret = "false";
    localStorage.vhis = "false";
    localStorage.vpro = "false";  
  

  get(refItems)
  .then((snapshot) => {
      if (snapshot.exists()) {
        localStorage.onValue = "true";
        initialData = snapshot.val();
      renderTableCV(initialData); 
     } else {
       console.log("No se encontraron datos.");
     }
    })
  .catch((error) => {
      console.error("Error al obtener los datos:", error);
       });

   function updateItem (updateValue, keyUpdate){
     if (!updateValue || !keyUpdate ) return;
     if(!d.getElementById(`${keyUpdate}`) || d.getElementById(`${keyUpdate}`) === null) return;

         d.getElementById(`${keyUpdate}`).innerHTML = `${ItemV(updateValue, keyUpdate)}`;
         d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
       setTimeout(function () {
         d.getElementById(`${keyUpdate}`).classList.remove("parpadeo");
       }, 1000); 
      
     }

    if(localStorage.onValue === "true"){
      onChildChanged(refItems, (snapshot) => {
        updateValue = snapshot.val();
        keyUpdate = snapshot.key;
        updateItem(updateValue, keyUpdate);
       });
    }
    tabActive("cajas");  
}