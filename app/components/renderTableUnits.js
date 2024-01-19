import { ItemUnit } from "./ItemUnits.js";
import { ItemV } from "./ItemV.js";


const d = document;

export function renderTableUnits(items){

      // console.log(newArray); 
    
      let itemsArray = Object.entries(items);

    //  console.log(itemsArray);

      // Ubication Order
      let orderItems = itemsArray.sort((o1, o2) => {
        if (o1[1].unidad < o2[1].unidad || o1[1].unidad < o2[1].unidad) {
          return -1;
        } else if (o1[1].unidad > o2[1].unidad || o1[1].unidad > o2[1].unidad) {
          return 1;
        } else {
          return 0;
        }
      });

    //console.log(orderItems);

      let html = "";
      

      orderItems.forEach((item) => (html += ItemUnit(item)));
     
    
 

 d.getElementById("thtable").innerHTML =  `
         <table class="table table-hover table-sm  table-striped" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr>
     
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th class="modelo" scope="col">MARCA</th>
      <th class="placa" scope="col">PLACA</th>
      <th class="año" scope="col">AÑO</th>
       <th class="verificacion" scope="col">NO. SERIE</th>
       <th class="poliza" scope="col">NO. POLIZA</th>
      <th class="inciso" scope="col">INCISO</th>
      <th class="contacto" scope="col">KILOMETRAJE</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
      <th scope="col" style="${window.location.hash === "#/Public" ? "display: none;" : ""}">OPCIONES</th>
 
                 
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

//  console.log($tr);
  // Orden Run Complete
 
  newOrder.sort((a, b) => a.dataset.unit - b.dataset.unit);
      console.log(newOrder);

      newOrder.forEach((e) => {
        d.getElementById("table_body").insertAdjacentElement("beforeend", e);          
       }); 


}

/* 
   //Helper de acceso a los items
      const $tr = d.querySelectorAll(".item");
      const newOrder = Array.from($tr);

    //  console.log($tr);
      // Orden Run Complete
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
*/