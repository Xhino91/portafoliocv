import {
    getDatabase,
    ref,
    get,
    onChildChanged
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { renderTable } from "./renderTable.js";
  import { tabActive } from "./tabActive.js";


  export function cargarVistaProductiva(user) {
    const db = getDatabase(), d = document;
    const refItems = ref(db, "items");
    let modal = document.getElementById("myModal");
    let keyUpdate = null, initialData = {},
    updateValue = {}; 
    tabActive("tablero"); 

   /* get(ref(db, "viajes"))
    .then((snapshot) => {
        if (snapshot.exists()) {
        initialData = snapshot.val();
        let itemsArray = Object.entries(initialData);
       // console.log(initialData); 
       
        for (var clave in initialData) {
          if (initialData.hasOwnProperty(clave) && initialData[clave].length > 1) {
       // console.log("Ruta Lechera:", repetidos[clave]);
             let viaje = initialData[clave];
             console.log(viaje);
            } else {
              let viaje = initialData[clave];
              console.log(viaje);
            }
            }


       } else {
         console.log("No se encontraron datos.");
       }
      })
    .catch((error) => {
        console.error("Error al obtener los datos:", error);
         });*/


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
               renderTable(initialData);  
               d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
               setTimeout(function () {
                 d.getElementById(`${keyUpdate}`).classList.remove("parpadeo");
               }, 1000); 
             } else {
              console.log("No se encontraron datos.");
             }
              })
            .catch((error) => {
              if(d.getElementById(`${keyUpdate}`).classList.add("parpadeo") === null) return
                //console.error("Error al obtener los datos:", error);
               });
      }


    if(localStorage.tabViajes === "true"){      
       onChildChanged(refItems, (snapshot) => {
         updateValue = snapshot.val();
         keyUpdate = snapshot.key;
         updateItem(updateValue, keyUpdate);
        });   
      }

}