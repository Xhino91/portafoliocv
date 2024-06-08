import {
    getDatabase,
    ref,
    get,
    onValue,
    onChildChanged,
    update,
    remove
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { tabActive } from "./tabActive.js";
import { renderTableHistory } from "./renderTableHistory.js";
import { ItemHistory } from "./ItemHistory.js";

 // Función para cargar la vista productiva para el usuario dado
 export function cargarVistaHistorial(user) {
  const db = getDatabase(), d = document;
  const refItems = ref(db, "historialviajes");
  let modal = document.getElementById("myModal");
  let keyUpdate = null, initialData = {},
  updateValue = {};  
  localStorage.vret = "false";
    localStorage.vpro = "false";
    localStorage.vhis = "true";
  

  get(refItems)
 .then((snapshot) => {
     if (snapshot.exists()) {
     initialData = snapshot.val();
     renderTableHistory(initialData); 
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
   
    d.getElementById(`${keyUpdate}`).innerHTML = `${ItemHistory(updateValue, keyUpdate)}`;
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
    tabActive("history"); 
}