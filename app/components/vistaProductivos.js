import {
    getDatabase,
    ref,
    get,
    onValue,
    onChildChanged,
    update,
    remove
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { renderTable } from "./renderTable.js";
  import { tabActive } from "./tabActive.js";
  import { Item } from "./Item.js";
  // Función para cargar la vista productiva para el usuario dado
  export function cargarVistaProductiva(user) {
    const db = getDatabase(), d = document;
    const refItems = ref(db, "items");
    let modal = document.getElementById("myModal");
    let keyUpdate = null, initialData = {},
    updateValue = {}; 
    tabActive("tablero"); 

    get(refItems)
   .then((snapshot) => {
       if (snapshot.exists()) {
       initialData = snapshot.val();
       renderTable(initialData); 
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
            get(refItems)
            .then((snapshot) => {
             if (snapshot.exists()) {
             initialData = snapshot.val();
<<<<<<< HEAD
               renderTable(initialData);  
=======
               renderTable(initialData); 
>>>>>>> 2db7223862ddbfe366a6e7770a0b6b91d1754691
               d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
               setTimeout(function () {
                 d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
               }, 1000); 
             } else {
              console.log("No se encontraron datos.");
             }
              })
            .catch((error) => {
<<<<<<< HEAD
              if(d.getElementById(`${keyUpdate}`).classList.add("parpadeo") === null) return
                //console.error("Error al obtener los datos:", error);
               });
=======
                console.error("Error al obtener los datos:", error);
                 });
>>>>>>> 2db7223862ddbfe366a6e7770a0b6b91d1754691
      }


    if(localStorage.tabViajes === "true"){      
       onChildChanged(refItems, (snapshot) => {
         updateValue = snapshot.val();
         keyUpdate = snapshot.key;
         updateItem(updateValue, keyUpdate);
        });   
      }

}