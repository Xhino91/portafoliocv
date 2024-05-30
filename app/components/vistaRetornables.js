import {
    getDatabase,
    ref,
    get,
    onValue,
    onChildChanged,
    update,
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { tabActive } from "./tabActive.js";
import { renderTableEV } from "./renderTableEV.js";
import { itemEV } from "./ItemEV.js";
 // Función para cargar la vista productiva para el usuario dado
 export function cargarVistaEquipoV(user) {

  const db = getDatabase(), d = document;
  const refItems = ref(db, "items");
  let modal = document.getElementById("myModal");
  let keyUpdate = null, initialData = {},
  updateValue = {}; 
  localStorage.vpro = "false";
  localStorage.vhis = "false";
  localStorage.vret = "true";
  

  get(refItems)
 .then((snapshot) => {
     if (snapshot.exists()) {
     initialData = snapshot.val();
     renderTableEV(initialData); 
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
   
    d.getElementById(`${keyUpdate}`).innerHTML = `${itemEV(updateValue, keyUpdate)}`;
    d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
       setTimeout(function () {
         d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
       }, 1000); 
    
     
    }


  if(localStorage.tabViajes === "true"){      
     onChildChanged(refItems, (snapshot) => {
       updateValue = snapshot.val();
       keyUpdate = snapshot.key;
       updateItem(updateValue, keyUpdate);
      });

    }    
    tabActive("equipov"); 
    
}