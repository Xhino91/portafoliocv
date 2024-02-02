import { Item } from "./Item.js";
import { ItemHistory } from "./ItemHistory.js";


const d = document;

export function renderTableHistory(items){
  

      //console.log(items); 
    
      let itemsArray = Object.entries(items);

    


      let orderItems = itemsArray.sort((o1, o2) => {
        if (o1[1].citaprogramada < o2[1].citaprogramada) {
          return -1;
        } else if (o1[1].citaprogramada > o2[1].citaprogramada) {
          return 1;
        } else {
          return 0;
        }
      });

      

      let html = "";
     
    
      orderItems.forEach((item) => (html += ItemHistory(item)));
     
    
      d.getElementById("thtable").innerHTML =  `
         <table class="table table-hover table-sm  table-striped" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr>
        <th scope="col">UNIDAD</th>
        <th scope="col">CAJA</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">C.PORTE</th>
        <th scope="col">TRACKING</th>
        <th scope="col">BOL / SHIPPER</th>
        <th scope="col">RUTA</th>
        <th scope="col">CLIENTE</th>
        <th scope="col">PROVEEDOR</th>
        <th scope="col">CITA PROGRAMADA</th>
        <th scope="col">LLEGADA REAL</th>
        <th scope="col">SALIDA REAL</th>
        <th scope="col">ETA DESTINO</th>
        <th scope="col">LLEGADA DESTINO</th>
        <th scope="col">SALIDA DESTINO</th>
        <th scope="col">LLEGADA</th>
        <th scope="col">ESTATUS</th>
        <th scope="col">COMENTARIOS</th>
        <th scope="col" style="${localStorage.username === "Public" || localStorage.username === "CVehicular" ? "display: none;" : ""}">OPCIONES</th>
  
      </tr>
    </thead>
 
    <tbody id="table_body" class="body_table">
    </tbody>
    
  </table>
      </section>`;

      d.getElementById("table_body").insertAdjacentHTML("beforeend", html);
     
      //Helper de acceso a los items
      const $tr = d.querySelectorAll(".item");
      const newOrder = Array.from($tr);       
          
     //Run Order 
     newOrder.sort((e1, e2) => {
      if (
        e1.dataset.run < e2.dataset.run ||
        e1.dataset.run < e2.dataset.run
      ) {
        return -1;
      } else if (
        e1.dataset.run > e2.dataset.run ||
        e1.dataset.run > e2.dataset.run
      ) {
        return 1;
      } else {
        return 0;
      }
     });
     


        newOrder.forEach((e) => {
          d.getElementById("table_body").insertAdjacentElement("beforeend", e);          
         });     



}