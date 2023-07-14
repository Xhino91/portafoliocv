import { ItemV } from "./ItemV.js";


const d = document;

export function renderTableCV(items){

      // console.log(newArray); 
    
      let itemsArray = Object.entries(items);

    //  console.log(itemsArray);

      // Ubication Order
      let orderItems = itemsArray.sort((o1, o2) => {
        if (o1[1].ubicacion < o2[1].ubicacion || o1[1].ubicacion < o2[1].ubicacion) {
          return -1;
        } else if (o1[1].ubicacion > o2[1].ubicacion || o1[1].ubicacion > o2[1].ubicacion) {
          return 1;
        } else {
          return 0;
        }
      });

     // console.log(orderItems);

      let html = "";
      

      orderItems.forEach((item) => (html += ItemV(item)));
     
    
 

d.getElementById("thtable").innerHTML =  `
         <table class="table table-hover table-sm  table-striped" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr>
     
      <th scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th class="placa" scope="col">PLACA</th>
      <th class="año" scope="col">AÑO</th>
       <th class="verificacion" scope="col">VERIFICACION</th>
       <th class="poliza" scope="col">NO. POLIZA</th>
      <th class="inciso" scope="col">INCISO</th>
      <th class="contacto" scope="col">CONTACTO DEL SEGURO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">RUTA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
      <th scope="col" style="${window.location.hash === "#/Tracking" || window.location.hash === "#/Traffic" || window.location.hash === "#/Public"  ? "display: none;" : ""}" >OPCIONES</th>
 
                 
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