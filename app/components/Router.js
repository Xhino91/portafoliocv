import api from "../helpers/wp_api.js";
import { ajax } from "../helpers/ajax.js";
import { Item } from "./Item.js";
import { generar_xls } from "../helpers/generar_xls.js";
import { crearTabla } from "./template_con_csv.js";
import { ItemXls } from "./ItemXls.js";
import { itemPublic } from "./itemPublic.js";


export async function Router() {
  const d = document,
       w = window;
  

  let { hash } = w.location;   

  if (!hash || hash === "#/Public") {     

    await ajax({
        url: api.ITEMS,
        cbSuccess: (items) => {
          // console.log(items);
          // Orden por fecha y hora
          let orderItems = items.sort((o1, o2) => {
            if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
              return -1;
            } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
              return 1;
            } else {
              return 0;
            }
          });
  
          let html = "";
          orderItems.forEach((item) => (html += itemPublic(item)));
          d.querySelector(".loader").style.display = "none";
          d.getElementById("thtable").innerHTML = `
      <table class="table table-hover table-sm" id="table_xls">
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
          <th scope="col">FECHA</th>
          <th scope="col">HORARIO</th>
          <th scope="col">LLEGADA</th>
          <th scope="col">ESTATUS</th>
          <th scope="col">OPCIONES</th>
    
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
  
  
        },
      });

    d.addEventListener("click", (e) => {
      //console.log(e.target);
      //LEER CSV / XLS
      /*if (e.target.matches(".import_csv")){
       //console.log(e.target);    
      }*/
      //GENERAR REPORTE XLS
      let date = new Date;
      if (e.target.matches(".modal_xls")){
            d.getElementById("exportModalXls").innerHTML = `
        <section id="thtable" class="thtable">
       <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">CAJA</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">C.PORTE</th>
        <th scope="col">TRACKING</th>
        <th scope="col">BOL / SHIPPER</th>
        <th scope="col">RUTA</th>
        <th scope="col">CLIENTE</th>
        <th scope="col">FECHA</th>
        <th scope="col">HORARIO</th>
        <th scope="col">LLEGADA</th>
        <th scope="col">ESTATUS</th>  
      </tr>
    </thead>
 
    <tbody id="table_body" class="body_table">
    </tbody>
    
  </table>
</section>
        `; 

      
      ajax({
          url: api.ITEMS,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);
            let orderItems = items.sort((o1, o2) => {
              if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
                return -1;
              } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
                return 1;
              } else {
                return 0;
              }
            });

            orderItems.forEach((item) => {
              d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXls(item));          
            });

            //Helper de acceso a los items
            const $tr = d.querySelectorAll(".item2");
              const newOrder = Array.from($tr);
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
        },
        });
        
      }
      if (e.target.matches(".control") || e.target.matches(".fa-car")) {
       // console.log(e.target);
       ajax({
        url: `${api.SUBITEMS}1`,
        method: "GET",
        cbSuccess: (unit) => {
          console.log(unit);
          console.log(e.target);

          d.querySelector(".hidden").style.display = "none";
          d.querySelector("#exampleModal").style.height = "60vh";
          d.getElementById("exampleModalLabel").innerHTML = `Control Vehicular`;
          d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid"> 
        <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">MODELO</th>
            <th scope="col">PLACA</th>
            <th scope="col">AÑO</th>
            <th scope="col">VERIFICACION</th>
            <th scope="col">NO. POLIZA</th>
            <th scope="col">INCISO</th>
            <th scope="col">CONTACTO DEL SEGURO</th> 
          </tr>
        </thead>
        <tbody class="text-center" class="text-wrap">
        <tr>
        <td>${unit.unidad}</td>
        <td>${unit.modelo}</td>
        <td>${unit.placa}</td>
        <td>${unit.año}</td>
        <td>${unit.verificacion}</td>
        <td>${unit.poliza}</td>
        <td>${unit.inciso}</td>
        <td>${unit.contacto}</td>     
        </tr>   
        </tbody>      
      </table>

      <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre la Unidad" disabled>${unit.comentarios.toUpperCase()}</textarea>
      </div>
        `;
        },
      });

     ajax({
        url: `${api.SUBITEMS1}5070`,
        method: "GET",
        cbSuccess: (conv) => {
          console.log(conv);
          console.log(e.target);
          d.querySelector(".modal-body").insertAdjacentHTML("beforeend", `
            <div class="container-fluid"> 
    
               <table class="table table-sm" >
               <thead class="table-dark text-center">
                 <tr class="text-wrap">
                   <th scope="col">REMOLQUE</th>
                   <th scope="col">TIPO</th>
                   <th scope="col">MODELO</th>
                   <th scope="col">PLACA</th>
                   <th scope="col">AÑO</th>
                   <th scope="col">VERIFICACION</th>
                   <th scope="col">NO. POLIZA</th>
                   <th scope="col">INCISO</th>
                   <th scope="col">CONTACTO DEL SEGURO</th> 
                 </tr>
               </thead>
               <tbody class="text-center" class="text-wrap">
               <tr>
               <td>${conv.caja}</td>
               <td>${conv.modelo}</td>
               <td>${conv.placa}</td>
               <td>${conv.año}</td>
               <td>${conv.verificacion}</td>
               <td>${conv.poliza}</td>
               <td>${conv.inciso}</td>
               <td>${conv.contacto}</td>     
               </tr>
             </tbody>      
            </table>

             <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre el Remolque" disabled>${conv.comentarios.toUpperCase()}</textarea>

              </div>` 
      
          );

      },
      });
      }
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
        generar_xls('table_xls', 'Reporte');
 
      }
      return;
    });
    
    d.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target.matches(".search-form")) {
        //console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();

        //console.log(query);

        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
          //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } else if (
            e.dataset.unit.includes(query) ||
            e.dataset.box.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
      }
    });

 
   }

   if (!hash || hash === "#/Tracking") {
    
     
     await ajax({
       url: api.ITEMS,
       cbSuccess: (items) => {
         // console.log(items);
         // Orden por fecha y hora
         let orderItems = items.sort((o1, o2) => {
           if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
             return -1;
           } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
             return 1;
           } else {
             return 0;
           }
         });
 
         let html = "";
         orderItems.forEach((item) => (html += Item(item)));
         d.querySelector(".loader").style.display = "none";
         d.getElementById("table_body").insertAdjacentHTML("beforeend", html);
        
         //Helper de acceso a los items
         const $tr = d.querySelectorAll(".item");
         const newOrder = Array.from($tr);
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
 
 
       },
     });  
 
     d.addEventListener("click", async (e) => {
       //console.log(e.target);
       //LEER CSV / XLS
       /*if (e.target.matches(".import_csv")){
        //console.log(e.target);    
       }*/
       //GENERAR REPORTE XLS
       let date = new Date;
       if (e.target.matches(".modal_xls")){
       d.getElementById("exportModalXls").innerHTML = `
         <section id="thtable" class="thtable">
        <table class="table table-hover table-sm" id="table_xls">
         <thead class="table-dark text-center align-middle">
         <tr style="background-color:black; color:white;">
         <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
         </tr>
       <tr style="background-color:black; color:white;">
         <th scope="col">UNIDAD</th>
         <th scope="col">CAJA</th>
         <th scope="col">OPERADOR</th>
         <th scope="col">C.PORTE</th>
         <th scope="col">TRACKING</th>
         <th scope="col">BOL / SHIPPER</th>
         <th scope="col">RUTA</th>
         <th scope="col">CLIENTE</th>
         <th scope="col">FECHA</th>
         <th scope="col">HORARIO</th>
         <th scope="col">LLEGADA</th>
         <th scope="col">ESTATUS</th>  
       </tr>
     </thead>
  
     <tbody id="table_body" class="body_table">
     </tbody>
     
   </table>
 </section>
         `;      
       ajax({
           url: api.ITEMS,
           method: "GET",
           cbSuccess: (items) => {
             //console.log(items);
             let orderItems = items.sort((o1, o2) => {
               if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
                 return -1;
               } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
                 return 1;
               } else {
                 return 0;
               }
             });
 
             orderItems.forEach((item) => {
               d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXls(item));          
             });
 
             //Helper de acceso a los items
             const $tr = d.querySelectorAll(".item2");
               const newOrder = Array.from($tr);
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
         },
         });
         
       }
       if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
         console.log(e.target);
 
         let isConfirm = confirm("¿Eliminar Registro?");
 
         if (isConfirm) {
          await ajax({
             url: `${api.ITEMS}/${e.target.id}`,
             options: {
               method: "DELETE",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
             },
             cbSuccess: (res) => {
               //console.log(res);
             },
           });
         }
       }
       if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
         //console.log(e.target.id);
         d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;
 
        await ajax({
           url: `${api.ITEMS}/${e.target.id}`,
           method: "GET",
           cbSuccess: (item) => {
             // console.log(item);
             d.getElementById("formulario").classList.add("edit");
             d.getElementById("formulario").classList.remove("register");
             d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
             d.querySelector(".modal-body").innerHTML = `
             <div class="container-fluid"> 
             <table class="table table-sm" >
         <thead class="table-dark text-center">
           <tr class="text-wrap">
             <th scope="col">UNIDAD</th>
             <th scope="col">CAJA</th>
             <th scope="col">OPERADOR</th>
             <th scope="col">C.PORTE</th>
             <th scope="col">TRACKING</th>
             <th scope="col">BOL/SHIPPER</th>
             <th scope="col">RUTA</th>
             <th scope="col">CLIENTE</th>
             <th scope="col">FECHA</th>
             <th scope="col">HORARIO</th>
             <th scope="col">LLEGADA</th>
             <th scope="col">ESTATUS</th>
             <th scope="col">CHECKED</th>
       
           </tr>
         </thead>
         <tbody class="text-center text-wrap" >
         <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}"></td>
         <td><input name="caja" style="width: 60px;" type="text"   value="${item.caja}"></td>
         <td><input name="operador" style="width: 130px;" type="text"  value="${item.operador}"></td>
         <td><input name="cporte" style="width: 70px;" type="text"  value="${item.cporte}"></td>
         <td><input name="tracking" style="width: 80px;" type="text"  value="${item.tracking}"></td>
         <td><input name="bol" style="width: 75px;" type="text"  value="${item.bol}"></td>
         <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" required></td>
         <td><input name="cliente" style="width: 95px;" type="text"  value="${item.cliente}"></td>
         <td><input name="fecha" type="text" style="width: 80px;"  value="${item.fecha}" disabled</td>
         <td><input name="ventana" type="time" name="hour" id="hour"  value="${item.ventana}"></td>
         <td>
         <select class="form-select form-select-sm" name="llegada" id="arribo">
         <option value="${item.llegada}">${item.llegada}</option> 
         <option value="A Tiempo">A Tiempo</option>  
         <option value="Tarde" >Tarde</option>
         <option value="Desfasada" >Desfasada</option>
         </select>
         </td>
         <td>
         <input name="status" style="width: 95px;" type="text"  value="${item.status}">
         </td>
         <td>
         <div class="form-check form-check-inline">
           <input name="x3" class="form-check-input" type="checkbox" id="inlineCheckbox1"${item.x3 ? "checked" : ""} >
           <label class="form-check-label" for="inlineCheckbox1">X3</label>
          </div>
          <div class="form-check form-check-inline">
           <input name="af" class="form-check-input" type="checkbox" id="inlineCheckbox2"${item.af ? "checked" : ""} >
           <label class="form-check-label" for="inlineCheckbox2">AF</label>
          </div>
          <div class="form-check form-check-inline">
           <input name="ag" class="form-check-input" type="checkbox" id="inlineCheckbox3"${item.ag ? "checked" : ""} >
           <label class="form-check-label" for="inlineCheckbox3">AG</label>
          </div>
          <div class="form-check form-check-inline">
           <input name="x1" class="form-check-input" type="checkbox" id="inlineCheckbox4"${item.x1 ? "checked" : ""} >
           <label class="form-check-label" for="inlineCheckbox4">X1</label>
          </div>
         </td>    
         </tbody>
         
       </table>
       </div>
             `;
           },
         });
 
         d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
       }
       if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        // console.log(e.target);
      
        ajax({
          url: `${api.SUBITEMS}1`,
          method: "GET",
          cbSuccess: (unit) => {
            console.log(unit);
            console.log(e.target);

            d.querySelector(".hidden").style.display = "none";
            d.querySelector("#exampleModal").style.height = "60vh";
            d.getElementById("exampleModalLabel").innerHTML = `Control Vehicular`;
            d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
              <th scope="col">VERIFICACION</th>
              <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">CONTACTO DEL SEGURO</th> 
            </tr>
          </thead>
          <tbody class="text-center" class="text-wrap">
          <tr>
          <td>${unit.unidad}</td>
          <td>${unit.modelo}</td>
          <td>${unit.placa}</td>
          <td>${unit.año}</td>
          <td>${unit.verificacion}</td>
          <td>${unit.poliza}</td>
          <td>${unit.inciso}</td>
          <td>${unit.contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre la Unidad" >${unit.comentarios.toUpperCase()}</textarea>
        </div>
          `;
          },
        });

       ajax({
          url: `${api.SUBITEMS1}5070`,
          method: "GET",
          cbSuccess: (conv) => {
            console.log(conv);
            console.log(e.target);
            d.querySelector(".modal-body").insertAdjacentHTML("beforeend", `
              <div class="container-fluid"> 
      
                 <table class="table table-sm" >
                 <thead class="table-dark text-center">
                   <tr class="text-wrap">
                     <th scope="col">REMOLQUE</th>
                     <th scope="col">TIPO</th>
                     <th scope="col">MODELO</th>
                     <th scope="col">PLACA</th>
                     <th scope="col">AÑO</th>
                     <th scope="col">VERIFICACION</th>
                     <th scope="col">NO. POLIZA</th>
                     <th scope="col">INCISO</th>
                     <th scope="col">CONTACTO DEL SEGURO</th> 
                   </tr>
                 </thead>
                 <tbody class="text-center" class="text-wrap">
                 <tr>
                 <td>${conv.caja}</td>
                 <td>${conv.modelo}</td>
                 <td>${conv.placa}</td>
                 <td>${conv.año}</td>
                 <td>${conv.verificacion}</td>
                 <td>${conv.poliza}</td>
                 <td>${conv.inciso}</td>
                 <td>${conv.contacto}</td>     
                 </tr>
               </tbody>      
              </table>

               <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre el Remolque">${conv.comentarios.toUpperCase()}</textarea>

                </div>` 
        
            );

            d.querySelector(".modal-footer").insertAdjacentHTML("afterend", ` 
          <button id="" data-unidad="" data-caja="" type="submit" class="btn btn-primary ">Actualizar</button>
          `);

        },
        });
      
       }
       if (e.target.matches(".reg")) {
         //  console.log(e.target);
         //MODAL REGISTRO DE VIAJES
         d.querySelector(".hidden").style.display = "block";
         d.getElementById("formulario").classList.add("register");
         d.getElementById("formulario").classList.remove("edit");
         d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
         d.querySelector(".modal-body").innerHTML = `
             <div class="container-fluid"> 
             <table class="table table-sm" >
         <thead class="table-dark text-center">
           <tr class="text-wrap">
             <th scope="col">UNIDAD</th>
             <th scope="col">CAJA</th>
             <th scope="col">OPERADOR</th>
             <th scope="col">C.PORTE</th>
             <th scope="col">TRACKING</th>
             <th scope="col">BOL/SHIPPER</th>
             <th scope="col">RUTA</th>
             <th scope="col">CLIENTE</th>
             <th scope="col">FECHA</th>
             <th scope="col">HORARIO</th>
             <th scope="col">LLEGADA</th>
             <th scope="col">ESTATUS</th>
             <th scope="col">CHECKED</th>
       
           </tr>
         </thead>
         <tbody class="text-center text-wrap" >
         <td><input name="unidad" style="width: 35px;" type="text"></input></td>
         <td><input name="caja" style="width: 60px;" type="text"></input></td>
         <td><input name="operador" style="width: 130px;" type="text"></input></td>
         <td><input name="cporte" style="width: 70px;" type="text"></input></td>
         <td><input name="tracking" style="width: 80px;" type="text"></input></td>
         <td><input name="bol" style="width: 75px;" type="text"></input></td>
         <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
         <td><input id="cliente" name="cliente" style="width: 95px;" type="text"></input></td>
         <td><input name="fecha" type="date" style="width: 80px;" required></input></td>
         <td><input id="ventana" name="ventana" type="time" name="hour" id="hour"></td>
         <td>
         <select class="form-select form-select-sm" name="llegada" id="arribo">
          <option value="A Tiempo" selected>A Tiempo</option>
         <option value="Tarde" >Tarde</option>
         <option value="Desfasada" >Desfasada</option>
         </select>
         </td>
         <td>
         <input name="status" style="width: 95px;" type="text"  value="">
         </td>
         <td>
         <div class="form-check form-check-inline">
           <input name="x3" class="form-check-input" type="checkbox" id="inlineCheckbox1">
           <label class="form-check-label" for="inlineCheckbox1">X3</label>
          </div>
          <div class="form-check form-check-inline">
           <input name="af" class="form-check-input" type="checkbox" id="inlineCheckbox2">
           <label class="form-check-label" for="inlineCheckbox2">AF</label>
          </div>
          <div class="form-check form-check-inline">
           <input name="ag" class="form-check-input" type="checkbox" id="inlineCheckbox3">
           <label class="form-check-label" for="inlineCheckbox3">AG</label>
          </div>
          <div class="form-check form-check-inline">
           <input name="x1" class="form-check-input" type="checkbox" id="inlineCheckbox4">
           <label class="form-check-label" for="inlineCheckbox4">X1</label>
          </div>
         </td>    
         </tbody>
         
       </table>
       </div>
             `;
       }
       if(e.target.matches(".generar_xls")){
         //let $dataTable = d.getElementById("table_xls");
             generar_xls('table_xls', 'Reporte');
  
       }
       return;
     });
 
     d.addEventListener("submit", async (e) => {
       e.preventDefault();
       clearInterval(reloadTime);
       reloadTime = null;
       if (e.target.matches(".search-form")) {
         //console.log(e.target);
         let query = localStorage.getItem("apiSearch").toUpperCase();
 
         //console.log(query);
 
         let item = d.querySelectorAll(".item");
             item.forEach((e) => {
           //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
           if (!query) {
             e.classList.remove("filter");
             return false;
           } else if (
             e.dataset.unit.includes(query) ||
             e.dataset.box.includes(query) ||
             e.dataset.track.includes(query) ||
             e.dataset.ruta.includes(query) ||
             e.dataset.cliente.includes(query)
           ) {
             e.classList.remove("filter");
           } else {
             e.classList.add("filter");
           }
                         });
       }
       
       else if (e.target.matches(".register")) {
         //Create Register
         if (!e.target.id.value) {
           let options = {
             method: "POST",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: e.target.unidad.value.toUpperCase(),
               caja: e.target.caja.value.toUpperCase(),
               cporte: e.target.cporte.value.toUpperCase(),
               tracking: e.target.tracking.value.toUpperCase(),
               bol: e.target.bol.value.toUpperCase(),
               ruta: e.target.ruta.value.toUpperCase(),
               operador: e.target.operador.value.toUpperCase(),
               cliente: e.target.cliente.value.toUpperCase(),
               fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
               ventana: e.target.ventana.value,
               llegada: e.target.llegada.value.toUpperCase(),
               status: e.target.status.value.toUpperCase(),
               x3: e.target.x3.checked,
               af: e.target.af.checked,
               ag: e.target.ag.checked,
               x1: e.target.x1.checked,
             }),
           };
         await ajax({
             url: api.ITEMS,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
           });
           location.reload();
         }
         // console.log(e.target);
       } 
       
       else if (e.target.matches(".edit")) {
         //UPDATE
        // console.log(e.target);
         if (!e.target.id.value) {
           let options = {
             method: "PUT",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
             body: JSON.stringify({
               unidad: e.target.unidad.value.toUpperCase(),
               caja: e.target.caja.value.toUpperCase(),
               cporte: e.target.cporte.value.toUpperCase(),
               tracking: e.target.tracking.value.toUpperCase(),
               bol: e.target.bol.value.toUpperCase(),
               ruta: e.target.ruta.value.toUpperCase(),
               operador: e.target.operador.value.toUpperCase(),
               cliente: e.target.cliente.value.toUpperCase(),
               fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
               ventana: e.target.ventana.value,
               llegada: e.target.llegada.value.toUpperCase(),
               status: e.target.status.value.toUpperCase(),
               x3: e.target.x3.checked,
               af: e.target.af.checked,
               ag: e.target.ag.checked,
               x1: e.target.x1.checked,
             }),
           };
          await ajax({
             url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}`,
             options,
             cbSuccess: (res) => {
               console.log(res);
             },
           });
           location.reload();
         }
 
         // console.log(e.target);
       }
     });
 
     d.addEventListener("keyup", (e) => {
       //  console.log(d.getElementById("ruta"));
       //limpiar busqueda
       let query = localStorage.getItem("apiSearch");
       if (e.key === "Escape") localStorage.removeItem("apiSearch");
       let item = d.querySelectorAll(".item");
       item.forEach((e) => {
         if (!query) {
           e.classList.remove("filter");
           return false;
         }
       });
     });

     
   }

   if (!hash || hash === "#/Traffic") {
     
    await ajax({
      url: api.ITEMS,
      cbSuccess: (items) => {
        // console.log(items);
        // Orden por fecha y hora
        let orderItems = items.sort((o1, o2) => {
          if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
            return -1;
          } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
            return 1;
          } else {
            return 0;
          }
        });

        let html = "";
        orderItems.forEach((item) => (html += Item(item)));
        d.querySelector(".loader").style.display = "none";
        d.getElementById("table_body").insertAdjacentHTML("beforeend", html);
       
        //Helper de acceso a los items
        const $tr = d.querySelectorAll(".item");
        const newOrder = Array.from($tr);
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


      },
    });  

    d.addEventListener("click", (e) => {
      //console.log(e.target);
      //LEER CSV / XLS
      /*if (e.target.matches(".import_csv")){
       //console.log(e.target);    
      }*/
      //GENERAR REPORTE XLS
      let date = new Date;
      if (e.target.matches(".modal_xls")){
      d.getElementById("exportModalXls").innerHTML = `
        <section id="thtable" class="thtable">
       <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">CAJA</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">C.PORTE</th>
        <th scope="col">TRACKING</th>
        <th scope="col">BOL / SHIPPER</th>
        <th scope="col">RUTA</th>
        <th scope="col">CLIENTE</th>
        <th scope="col">FECHA</th>
        <th scope="col">HORARIO</th>
        <th scope="col">LLEGADA</th>
        <th scope="col">ESTATUS</th>  
      </tr>
    </thead>
 
    <tbody id="table_body" class="body_table">
    </tbody>
    
  </table>
</section>
        `;      
      ajax({
          url: api.ITEMS,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);
            let orderItems = items.sort((o1, o2) => {
              if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
                return -1;
              } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
                return 1;
              } else {
                return 0;
              }
            });

            orderItems.forEach((item) => {
              d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXls(item));          
            });

            //Helper de acceso a los items
            const $tr = d.querySelectorAll(".item2");
              const newOrder = Array.from($tr);
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
        },
        });
        
      }
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
        //console.log(e.target.id);
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;

        ajax({
          url: `${api.ITEMS}/${e.target.id}`,
          method: "GET",
          cbSuccess: (item) => {
            // console.log(item);
            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL/SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">FECHA</th>
            <th scope="col">HORARIO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">CHECKED</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}"></td>
        <td><input name="caja" style="width: 60px;" type="text"   value="${item.caja}"></td>
        <td><input name="operador" style="width: 130px;" type="text"  value="${item.operador}"></td>
        <td><input name="cporte" style="width: 70px;" type="text"  value="${item.cporte}"></td>
        <td><input name="tracking" style="width: 80px;" type="text"  value="${item.tracking}"></td>
        <td><input name="bol" style="width: 75px;" type="text"  value="${item.bol}"></td>
        <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" required disabled></td>
        <td><input name="cliente" style="width: 95px;" type="text"  value="${item.cliente}" disabled></td>
        <td><input name="fecha" type="text" style="width: 80px;"  value="${item.fecha}" disabled> </td>
        <td><input name="ventana" type="time" name="hour" id="hour"  value="${item.ventana}" disabled></td>
        <td>
        <select class="form-select form-select-sm" name="llegada" id="arribo">
        <option value="${item.llegada}">${item.llegada}</option> 
        <option value="A Tiempo">A Tiempo</option>  
        <option value="Tarde" >Tarde</option>
        <option value="Desfasada" >Desfasada</option>
        </select>
        </td>
        <td>
        <input name="status" style="width: 95px;" type="text"  value="${item.status}">
        </td>
        <td>
        <div class="form-check form-check-inline">
          <input name="x3" class="form-check-input" type="checkbox" id="inlineCheckbox1"${item.x3 ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox1">X3</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="af" class="form-check-input" type="checkbox" id="inlineCheckbox2"${item.af ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox2">AF</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="ag" class="form-check-input" type="checkbox" id="inlineCheckbox3"${item.ag ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox3">AG</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="x1" class="form-check-input" type="checkbox" id="inlineCheckbox4"${item.x1 ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox4">X1</label>
         </div>
        </td>    
        </tbody>
        
      </table>
      </div>
            `;
          },
        });

        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      }
      if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        // console.log(e.target);
       
        ajax({
          url: `${api.SUBITEMS}1`,
          method: "GET",
          cbSuccess: (unit) => {
            console.log(unit);
            console.log(e.target);

            d.querySelector(".hidden").style.display = "none";
            d.querySelector("#exampleModal").style.height = "60vh";
            d.getElementById("exampleModalLabel").innerHTML = `Control Vehicular`;
            d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
              <th scope="col">VERIFICACION</th>
              <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">CONTACTO DEL SEGURO</th> 
            </tr>
          </thead>
          <tbody class="text-center" class="text-wrap">
          <tr>
          <td>${unit.unidad}</td>
          <td>${unit.modelo}</td>
          <td>${unit.placa}</td>
          <td>${unit.año}</td>
          <td>${unit.verificacion}</td>
          <td>${unit.poliza}</td>
          <td>${unit.inciso}</td>
          <td>${unit.contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre la Unidad" >${unit.comentarios.toUpperCase()}</textarea>
        </div>
          `;
          },
        });

       ajax({
          url: `${api.SUBITEMS1}5070`,
          method: "GET",
          cbSuccess: (conv) => {
            console.log(conv);
            console.log(e.target);
            d.querySelector(".modal-body").insertAdjacentHTML("beforeend", `
              <div class="container-fluid"> 
      
                 <table class="table table-sm" >
                 <thead class="table-dark text-center">
                   <tr class="text-wrap">
                     <th scope="col">REMOLQUE</th>
                     <th scope="col">TIPO</th>
                     <th scope="col">MODELO</th>
                     <th scope="col">PLACA</th>
                     <th scope="col">AÑO</th>
                     <th scope="col">VERIFICACION</th>
                     <th scope="col">NO. POLIZA</th>
                     <th scope="col">INCISO</th>
                     <th scope="col">CONTACTO DEL SEGURO</th> 
                   </tr>
                 </thead>
                 <tbody class="text-center" class="text-wrap">
                 <tr>
                 <td>${conv.caja}</td>
                 <td>${conv.modelo}</td>
                 <td>${conv.placa}</td>
                 <td>${conv.año}</td>
                 <td>${conv.verificacion}</td>
                 <td>${conv.poliza}</td>
                 <td>${conv.inciso}</td>
                 <td>${conv.contacto}</td>     
                 </tr>
               </tbody>      
              </table>

               <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre el Remolque">${conv.comentarios.toUpperCase()}</textarea>

                </div>` 
        
            );

            d.querySelector(".modal-footer").insertAdjacentHTML("afterend", ` 
          <button id="" data-unidad="" data-caja="" type="submit" class="btn btn-primary ">Actualizar</button>
          `);

        },
        });

       }
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
 
      }
      return;
    });

    d.addEventListener("submit", async (e) => {
      e.preventDefault();
      

      if (e.target.matches(".search-form")) {
        //console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();

        //console.log(query);

        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
          //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } else if (
            e.dataset.unit.includes(query) ||
            e.dataset.box.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
      } 
      
      else if (e.target.matches(".edit")) {
        //UPDATE
       // console.log(e.target);
        if (!e.target.id.value) {
          let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              unidad: e.target.unidad.value.toUpperCase(),
              caja: e.target.caja.value.toUpperCase(),
              cporte: e.target.cporte.value.toUpperCase(),
              tracking: e.target.tracking.value.toUpperCase(),
              bol: e.target.bol.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              operador: e.target.operador.value.toUpperCase(),
              cliente: e.target.cliente.value.toUpperCase(),
              fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
              ventana: e.target.ventana.value,
              llegada: e.target.llegada.value.toUpperCase(),
              status: e.target.status.value.toUpperCase(),
              x3: e.target.x3.checked,
              af: e.target.af.checked,
              ag: e.target.ag.checked,
              x1: e.target.x1.checked,
            }),
          };
         await ajax({
            url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}`,
            options,
            cbSuccess: (res) => {
              console.log(res);
            },
          });
          location.reload();
        }

        // console.log(e.target);
      }
    });

    d.addEventListener("keyup", (e) => {
      //  console.log(d.getElementById("ruta"));
      //limpiar busqueda
      let query = localStorage.getItem("apiSearch");
      if (e.key === "Escape") localStorage.removeItem("apiSearch");
      let item = d.querySelectorAll(".item");
      item.forEach((e) => {
        if (!query) {
          e.classList.remove("filter");
          return false;
        }
      });
    });
   

  }

  if (!hash || hash === "#/Inhouse") {
    
    await ajax({
      url: api.ITEMS,
      cbSuccess: (items) => {
        // console.log(items);
        // Orden por fecha y hora
        let orderItems = items.sort((o1, o2) => {
          if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
            return -1;
          } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
            return 1;
          } else {
            return 0;
          }
        });

        let html = "";
        orderItems.forEach((item) => (html += Item(item)));
        d.querySelector(".loader").style.display = "none";
        d.getElementById("table_body").insertAdjacentHTML("beforeend", html);
       
        //Helper de acceso a los items
        const $tr = d.querySelectorAll(".item");
        const newOrder = Array.from($tr);
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


      },
    });  

    d.addEventListener("click", async (e) => {
      //console.log(e.target);
      //LEER CSV / XLS
      /*if (e.target.matches(".import_csv")){
       //console.log(e.target);    
      }*/
      //GENERAR REPORTE XLS
      let date = new Date;
      if (e.target.matches(".modal_xls")){
      d.getElementById("exportModalXls").innerHTML = `
        <section id="thtable" class="thtable">
       <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">CAJA</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">C.PORTE</th>
        <th scope="col">TRACKING</th>
        <th scope="col">BOL / SHIPPER</th>
        <th scope="col">RUTA</th>
        <th scope="col">CLIENTE</th>
        <th scope="col">FECHA</th>
        <th scope="col">HORARIO</th>
        <th scope="col">LLEGADA</th>
        <th scope="col">ESTATUS</th>  
      </tr>
    </thead>
 
    <tbody id="table_body" class="body_table">
    </tbody>
    
  </table>
</section>
        `;      
      ajax({
          url: api.ITEMS,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);
            let orderItems = items.sort((o1, o2) => {
              if (o1.fecha < o2.fecha || o1.ventana < o2.ventana) {
                return -1;
              } else if (o1.fecha > o2.fecha || o1.ventana > o2.ventana) {
                return 1;
              } else {
                return 0;
              }
            });

            orderItems.forEach((item) => {
              d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXls(item));          
            });

            //Helper de acceso a los items
            const $tr = d.querySelectorAll(".item2");
              const newOrder = Array.from($tr);
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
        },
        });
        
      }
      if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
        console.log(e.target);

        let isConfirm = confirm("¿Eliminar Registro?");

        if (isConfirm) {
       await ajax({
            url: `${api.ITEMS}/${e.target.id}`,
            options: {
              method: "DELETE",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
            },
            cbSuccess: (res) => {
              //console.log(res);
            },
          });
          location.reload;
        }
      }
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
        //console.log(e.target.id);
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;

       await ajax({
          url: `${api.ITEMS}/${e.target.id}`,
          method: "GET",
          cbSuccess: (item) => {
            // console.log(item);
            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL/SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">FECHA</th>
            <th scope="col">HORARIO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">CHECKED</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
        <td><input name="caja" style="width: 60px;" type="text"   value="${item.caja}"></td>
        <td><input name="operador" style="width: 130px;" type="text"  value="${item.operador}" disabled></td>
        <td><input name="cporte" style="width: 70px;" type="text"  value="${item.cporte}"></td>
        <td><input name="tracking" style="width: 80px;" type="text"  value="${item.tracking}"></td>
        <td><input name="bol" style="width: 75px;" type="text"  value="${item.bol}"></td>
        <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" required></td>
        <td><input name="cliente" style="width: 95px;" type="text"  value="${item.cliente}"></td>
        <td><input name="fecha" type="text" style="width: 80px;"  value="${item.fecha}" disabled</td>
        <td><input name="ventana" type="time" name="hour" id="hour"  value="${item.ventana}"></td>
        <td>
        <select class="form-select form-select-sm" name="llegada" id="arribo">
        <option value="${item.llegada}">${item.llegada}</option> 
        <option value="A Tiempo">A Tiempo</option>  
        <option value="Tarde" >Tarde</option>
        <option value="Desfasada" >Desfasada</option>
        </select>
        </td>
        <td>
        <input name="status" style="width: 95px;" type="text"  value="${item.status}">
        </td>
        <td>
        <div class="form-check form-check-inline">
          <input name="x3" class="form-check-input" type="checkbox" id="inlineCheckbox1"${item.x3 ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox1">X3</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="af" class="form-check-input" type="checkbox" id="inlineCheckbox2"${item.af ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox2">AF</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="ag" class="form-check-input" type="checkbox" id="inlineCheckbox3"${item.ag ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox3">AG</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="x1" class="form-check-input" type="checkbox" id="inlineCheckbox4"${item.x1 ? "checked" : ""} >
          <label class="form-check-label" for="inlineCheckbox4">X1</label>
         </div>
        </td>    
        </tbody>
        
      </table>
      </div>
            `;
          },
        });

        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
      }
      if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        // console.log(e.target);
        
        ajax({
          url: `${api.SUBITEMS}1`,
          method: "GET",
          cbSuccess: (unit) => {
            console.log(unit);
            console.log(e.target);

            d.querySelector(".hidden").style.display = "none";
            d.querySelector("#exampleModal").style.height = "60vh";
            d.getElementById("exampleModalLabel").innerHTML = `Control Vehicular`;
            d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
              <th scope="col">VERIFICACION</th>
              <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">CONTACTO DEL SEGURO</th> 
            </tr>
          </thead>
          <tbody class="text-center" class="text-wrap">
          <tr>
          <td>${unit.unidad}</td>
          <td>${unit.modelo}</td>
          <td>${unit.placa}</td>
          <td>${unit.año}</td>
          <td>${unit.verificacion}</td>
          <td>${unit.poliza}</td>
          <td>${unit.inciso}</td>
          <td>${unit.contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre la Unidad" >${unit.comentarios.toUpperCase()}</textarea>
        </div>
          `;
          },
        });

       ajax({
          url: `${api.SUBITEMS1}5070`,
          method: "GET",
          cbSuccess: (conv) => {
            console.log(conv);
            console.log(e.target);
            d.querySelector(".modal-body").insertAdjacentHTML("beforeend", `
              <div class="container-fluid"> 
      
                 <table class="table table-sm" >
                 <thead class="table-dark text-center">
                   <tr class="text-wrap">
                     <th scope="col">REMOLQUE</th>
                     <th scope="col">TIPO</th>
                     <th scope="col">MODELO</th>
                     <th scope="col">PLACA</th>
                     <th scope="col">AÑO</th>
                     <th scope="col">VERIFICACION</th>
                     <th scope="col">NO. POLIZA</th>
                     <th scope="col">INCISO</th>
                     <th scope="col">CONTACTO DEL SEGURO</th> 
                   </tr>
                 </thead>
                 <tbody class="text-center" class="text-wrap">
                 <tr>
                 <td>${conv.caja}</td>
                 <td>${conv.modelo}</td>
                 <td>${conv.placa}</td>
                 <td>${conv.año}</td>
                 <td>${conv.verificacion}</td>
                 <td>${conv.poliza}</td>
                 <td>${conv.inciso}</td>
                 <td>${conv.contacto}</td>     
                 </tr>
               </tbody>      
              </table>

               <textarea name="textarea" rows="1" cols="150" class="mb-3" style="resize:none" placeholder="Comentarios de Sobre el Remolque">${conv.comentarios.toUpperCase()}</textarea>

                </div>` 
        
            );

        },
        });

       }
      if (e.target.matches(".reg")) {
        //  console.log(e.target);
        //MODAL REGISTRO DE VIAJES
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
        d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
        d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
            <th scope="col">UNIDAD</th>
            <th scope="col">CAJA</th>
            <th scope="col">OPERADOR</th>
            <th scope="col">C.PORTE</th>
            <th scope="col">TRACKING</th>
            <th scope="col">BOL/SHIPPER</th>
            <th scope="col">RUTA</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">FECHA</th>
            <th scope="col">HORARIO</th>
            <th scope="col">LLEGADA</th>
            <th scope="col">ESTATUS</th>
            <th scope="col">CHECKED</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text"></input></td>
        <td><input name="caja" style="width: 60px;" type="text"></input></td>
        <td><input name="operador" style="width: 130px;" type="text"></input></td>
        <td><input name="cporte" style="width: 70px;" type="text"></input></td>
        <td><input name="tracking" style="width: 80px;" type="text"></input></td>
        <td><input name="bol" style="width: 75px;" type="text"></input></td>
        <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
        <td><input id="cliente" name="cliente" style="width: 95px;" type="text"></input></td>
        <td><input name="fecha" type="date" style="width: 80px;" required></input></td>
        <td><input id="ventana" name="ventana" type="time" name="hour" id="hour"></td>
        <td>
        <select class="form-select form-select-sm" name="llegada" id="arribo">
         <option value="A Tiempo" selected>A Tiempo</option>
        <option value="Tarde" >Tarde</option>
        <option value="Desfasada" >Desfasada</option>
        </select>
        </td>
        <td>
        <input name="status" style="width: 95px;" type="text"  value="">
        </td>
        <td>
        <div class="form-check form-check-inline">
          <input name="x3" class="form-check-input" type="checkbox" id="inlineCheckbox1">
          <label class="form-check-label" for="inlineCheckbox1">X3</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="af" class="form-check-input" type="checkbox" id="inlineCheckbox2">
          <label class="form-check-label" for="inlineCheckbox2">AF</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="ag" class="form-check-input" type="checkbox" id="inlineCheckbox3">
          <label class="form-check-label" for="inlineCheckbox3">AG</label>
         </div>
         <div class="form-check form-check-inline">
          <input name="x1" class="form-check-input" type="checkbox" id="inlineCheckbox4">
          <label class="form-check-label" for="inlineCheckbox4">X1</label>
         </div>
        </td>    
        </tbody>
        
      </table>
      </div>
            `;
      }
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
 
      }
      return;
    });

    d.addEventListener("submit", async (e) => {
      e.preventDefault();
     

      if (e.target.matches(".search-form")) {
        //console.log(e.target);
        let query = localStorage.getItem("apiSearch").toUpperCase();

        //console.log(query);

        let item = d.querySelectorAll(".item");
            item.forEach((e) => {
          //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
          if (!query) {
            e.classList.remove("filter");
            return false;
          } else if (
            e.dataset.unit.includes(query) ||
            e.dataset.box.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
      }
      
      else if (e.target.matches(".register")) {
        //Create Register
        if (!e.target.id.value) {
          let options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              unidad: e.target.unidad.value.toUpperCase(),
              caja: e.target.caja.value.toUpperCase(),
              cporte: e.target.cporte.value.toUpperCase(),
              tracking: e.target.tracking.value.toUpperCase(),
              bol: e.target.bol.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              operador: e.target.operador.value.toUpperCase(),
              cliente: e.target.cliente.value.toUpperCase(),
              fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
              ventana: e.target.ventana.value,
              llegada: e.target.llegada.value.toUpperCase(),
              status: e.target.status.value.toUpperCase(),
              x3: e.target.x3.checked,
              af: e.target.af.checked,
              ag: e.target.ag.checked,
              x1: e.target.x1.checked,
            }),
          };
          await ajax({
            url: api.ITEMS,
            options,
            cbSuccess: (res) => {
              json = res.json();
            },
          });
          location.reload();
        }
        // console.log(e.target);
      } 
      
      else if (e.target.matches(".edit")) {
        //UPDATE
       // console.log(e.target);
        if (!e.target.id.value) {
          let options = {
            method: "PUT",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              unidad: e.target.unidad.value.toUpperCase(),
              caja: e.target.caja.value.toUpperCase(),
              cporte: e.target.cporte.value.toUpperCase(),
              tracking: e.target.tracking.value.toUpperCase(),
              bol: e.target.bol.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              operador: e.target.operador.value.toUpperCase(),
              cliente: e.target.cliente.value.toUpperCase(),
              fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
              ventana: e.target.ventana.value,
              llegada: e.target.llegada.value.toUpperCase(),
              status: e.target.status.value.toUpperCase(),
              x3: e.target.x3.checked,
              af: e.target.af.checked,
              ag: e.target.ag.checked,
              x1: e.target.x1.checked,
            }),
          };
         await ajax({
            url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}`,
            options,
            cbSuccess: (res) => {
              console.log(res);
            },
          });
          location.reload();
        }

        // console.log(e.target);
      }
    });

    d.addEventListener("keyup", (e) => {
      //  console.log(d.getElementById("ruta"));
      //limpiar busqueda
      let query = localStorage.getItem("apiSearch");
      if (e.key === "Escape") localStorage.removeItem("apiSearch");
      let item = d.querySelectorAll(".item");
      item.forEach((e) => {
        if (!query) {
          e.classList.remove("filter");
          return false;
        }
      });
    });

    }

  return 
}






/*

 d.querySelector("#importModalCsv").addEventListener('change', (e) => {
       console.log(e.target);

       
        function leerArchivo2(evt) {
         let file = evt.target.files[0];
         let reader = new FileReader();
         reader.onload = (e) => {
           // Cuando el archivo se terminó de cargar
            crearTabla(e.target.result);
         };
          // Leemos el contenido del archivo seleccionado
           reader.readAsText(file);
       }

    });
    

    */