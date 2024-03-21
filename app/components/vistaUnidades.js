import {
  getDatabase,
  ref,
  get,
  onValue,
  onChildChanged,
  update
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { tabActive } from "./tabActive.js";
import { renderTableUnits } from "./renderTableUnits.js";
import { ItemUnit } from "./ItemUnits.js";

 export function cargarVistaUnidades(user) {
  const db = getDatabase(), d = document;
  const refItems = ref(db, "subitem");
  let modal = document.getElementById("myModal");
  let keyUpdate = null,
  updateValue = {}; 
  tabActive("unidades"); 

  get(refItems)
  .then((snapshot) => {
      if (snapshot.exists()) {
      const data = snapshot.val();
      renderTableUnits(data); 
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

         d.getElementById(`${keyUpdate}`).innerHTML = `${ItemUnit(updateValue, keyUpdate)}`;
         d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
       setTimeout(function () {
         d.getElementById(`${keyUpdate}`).classList.remove("parpadeo");
       }, 1000); 
      
     }

    if(localStorage.tabUnit === "true" && localStorage.tabConveyance === "false" && localStorage.tabViajes === "false"){
    
      onChildChanged(refItems, (snapshot) => {
        updateValue = snapshot.val();
        keyUpdate = snapshot.key;
        updateItem(updateValue, keyUpdate);
       });
    }
        
}