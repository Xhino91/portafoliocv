import { itemPublic } from "./itemPublic.js";

const d = document;

export function renderTablePublic(items){

      // console.log(newArray); 
    
      let itemsArray = Object.entries(items);

      // Orden for date
      let orderItems = itemsArray.sort((o1, o2) => {
        if (o1[1].fecha < o2[1].fecha || o1[1].ventana < o2[1].ventana) {
          return -1;
        } else if (o1[1].fecha > o2[1].fecha || o1[1].ventana > o2[1].ventana) {
          return 1;
        } else {
          return 0;
        }
      });

     // console.log(orderItems);

      let html = "";
      

      orderItems.forEach((item) => (html += itemPublic(item)));
     
      d.getElementById("thtable").innerHTML = `
  <table class="table table-hover table-sm table-striped" id="table_xls">
  <thead class="table-dark text-center align-middle">
    <tr>
      <th scope="col">UNIDAD</th>
      <th scope="col">CAJA</th>
      <th scope="col">OPERADOR</th>
      <th class="cporte" scope="col">C.PORTE</th>
      <th class="track" scope="col">TRACKING</th>
      <th class="bol" scope="col">BOL / SHIPPER</th>
      <th class="ruta" scope="col">RUTA</th>
      <th scope="col">CLIENTE</th>
      <th class="fecha"  scope="col">FECHA</th>
      <th class="ventana" scope="col">HORARIO</th>
      <th class="llegada" scope="col">LLEGADA</th>
      <th scope="col">ESTATUS</th>
      <th scope="col">COMENTARIOS</th>
    </tr>
  </thead>

  <tbody id="table_body" class="body_table">
  </tbody>
  
</table>
  `; 

      d.getElementById("table_body").insertAdjacentHTML("beforeend", html);
     
      //Helper de acceso a los items
      const $tr = d.querySelectorAll(".item");
      const newOrder = Array.from($tr);

      newOrder.sort((a, b) => {
        if (
          a.dataset.hour < b.dataset.hour ||
          a.dataset.hour < b.dataset.hour
        ) {
          return -1;
        } else if (
          a.dataset.hour > b.dataset.hour ||
          a.dataset.hour > b.dataset.hour
        ) {
          return 1;
        } else {
          return 0;
        } 
      });


      //Date Order
     newOrder.sort((e1, e2) => {
      if (
        e1.dataset.fechaf < e2.dataset.fechaf ||
        e1.dataset.fechaf < e2.dataset.fechaf
      ) {
        return -1;
      } else if (
        e1.dataset.fechaf > e2.dataset.fechaf ||
        e1.dataset.fechaf > e2.dataset.fechaf
      ) {
        return 1;
      } else {
        return 0;
      }
     });
        
          
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