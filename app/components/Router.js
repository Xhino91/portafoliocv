import api from "../helpers/wp_api.js";
import { ajax } from "../helpers/ajax.js";
import { Item } from "./Item.js";
import { generar_xls } from "../helpers/generar_xls.js";
import { crearTabla } from "./template_con_csv.js";
import { ItemXls } from "./ItemXls.js";
import { renderTablePublic } from "./renderTablePublic.js";
import { renderTable } from "./renderTable.js";
import { renderTableCV } from "./renderTableCV.js";
import { ItemXlsInvConv } from "./ItemXlsInvConv.js";
import { ItemXlsInvUnit } from "./ItemXlsInvUnit.js";
import { renderTableUnits } from "./renderTableUnits.js";



export async function Router() {
  const d = document,
       w = window;
d.addEventListener("keyup", e => {
  //console.log(e);
  if(e.key === "Escape"){
    location.reload();
  }
});

  let { hash } = w.location;   
  let newArray, listenItemsArray;

  if (!hash || hash === "#" || hash === "#/") {
    return;
  } else

  if (!hash || hash === "#/Public") { 
    localStorage.tabViajes = true;  
    localStorage.tabConveyance = false;
    localStorage.tabUnit = false;  

      await ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {   
          newArray = items;
          //console.log(itemsArray)   
          renderTablePublic(newArray);
        },
      });

      const updateData = setInterval(  () => {
        
        ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {
            
              //console.log(Object.values(items));
                listenItemsArray = Object.values(items);
                let firstArray = Object.values(newArray);
                 // console.log(Object.entries(itemsArray).length);

                 if(listenItemsArray.length === firstArray.length){

                  
                    for (let i = 0; i < firstArray.length; i++) {
                      let e = firstArray[i];
                       let e2 = listenItemsArray[i];
                
                     if( e.fecha != e2.fecha || e.caja != e2.caja 
                      || e.unidad != e2.unidad || e.bol != e2.bol 
                      || e.af != e2.af || e.ag != e2.ag 
                      || e.cliente != e2.cliente || e.cporte != e2.cporte
                      || e.tracking != e2.tracking || e.llegada != e2.llegada
                      || e.status != e2.status || e.ventana != e2.ventana
                      || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                      ) {
                       // console.log("UPDATE");
                        
                        renderTablePublic(items);
                       }
       
                     }
                   } 
                   else {
                    //console.log("UPDATE");
                   
                    renderTablePublic(items);
                   }


               
               //console.log(listenItemsArray);
             }       
          })

      }, 5000);

      updateData;

     setInterval(() => {
        location.reload();
      }, 300000);


      let sectionActive = () => {
        d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";

          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";

          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
         };
            
   if(localStorage.tabViajes){
              sectionActive();
            }
        

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

      
     await ajax({
          url: `${api.ITEMS}.json`,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);
            let itemsArray = Object.entries(items);
          
            //console.log(itemsArray);
  
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
      if (e.target.matches(".cancelXls")){
        location.reload();
      }
      if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        //console.log(e.target);
       await ajax({
        url: `${api.SUBITEMS}.json`,
        method: "GET",
        cbSuccess: (unit) => {
       
         // console.log(e.target);
         let unitArray = Object.entries(unit);
         

         unitArray.forEach(unit => {
          if(e.target.id === unit[1].unidad){

            d.getElementById("controlModal").style.height = "60vh";
            d.querySelector(".control-modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">OPERADOR</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
              <th scope="col">VERIFICACION</th>
              <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">KILOMETRAJE</th> 
            </tr>
          </thead>
          <tbody class="text-center" class="text-wrap">
          <tr>
          <td>${unit[1].unidad}</td>
          <td>${unit[1].operador}</td>
          <td>${unit[1].modelo}</td>
          <td>${unit[1].placa}</td>
          <td>${unit[1].año}</td>
          <td>${unit[1].verificacion}</td>
          <td>${unit[1].poliza}</td>
          <td>${unit[1].inciso}</td>
          <td>${unit[1].contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
        </div>
          `;

         d.getElementById("controlV").dataset.unit = unit[0];

         

          } 
         });

        },
      });

      await ajax({
        url: `${api.SUBITEMS1}.json`,
        method: "GET",
        cbSuccess: (conv) => {
        
         let convArray = Object.entries(conv);
         
         convArray.forEach(conv => {
        
          if(e.target.dataset.conveyance === conv[1].caja){

            d.getElementById("controlModal").style.height = "50vh";
            d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
            <div class="container-fluid"> 
    
               <table class="table table-sm" >
               <thead class="table-dark text-center">
                 <tr class="text-wrap">
                 <th scope="col">CAJA</th>
                 <th scope="col">TIPO</th>
                 <th scope="col">MODELO</th>
                 <th class="placa" scope="col">PLACA</th>
                 <th class="año" scope="col">AÑO</th>
                 <th class="verificacion" scope="col">VERIFICACION</th>
                 <th class="poliza" scope="col">NO. POLIZA</th>
                 <th class="inciso" scope="col">INCISO</th>
                 <th class="contacto" scope="col">MARCHAMO</th>
                 <th scope="col">CIRCUITO</th>
                 <th scope="col">FECHA</th>
                 <th scope="col">UBICACION</th> 
                 <th scope="col">ESTATUS</th>
                 </tr>
               </thead>
               <tbody class="text-center text-wrap" >
        <td>${conv[1].caja}</td>
        <td>${conv[1].tipo}</td>
        <td>${conv[1].modelo}</td>
        <td class="placa" >${conv[1].placa}</td>
        <td class="año" >${conv[1].año}</td>
        <td  class="verificacion" >${conv[1].verificacion}</td>
        <td class="poliza" >${conv[1].poliza}</td>
        <td class="inciso">${conv[1].inciso}</td>
        <td class="contacto">${conv[1].contacto}</td>
        <td>${conv[1].circuito}</td>
        <td><input name="fecha" style="background: #69beff; font-weight: bold; color: black; width: 200px;" type="text"  value="${conv[1].fecha}" disabled></td>
        <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black; width: 200px;"  type="text"  value="${conv[1].ubicacion}" disabled></td>
        <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 200px; background-color: #862828; color: white; font-weight: bold;" : "width: 200px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}" disabled></td>  
        </tbody>   
        </table>
   
              </div>` 
      
          );

          d.getElementById("controlV").dataset.conveyance = conv[0];
            
          }
        
        });

      
       
          
        }

      });

      d.querySelector("#controlV").style.display= "none";

      }
      if (e.target.matches(".tablero")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTablePublic(newArray);
          },
        });

        d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
      }
      if (e.target.matches(".cajas")) {
        clearInterval(updateData);
        localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;



        await ajax({
          url: `${api.SUBITEMS1}.json`,
          cbSuccess: (items) => {   
            newArray = items;
          //  console.log(newArray)   
           renderTableCV(newArray);
          },
        });

        d.getElementById("cajas").style.color = "#ffffffe8";
        d.getElementById("cajas").style.backgroundColor = "#10438e";
        d.getElementById("cajas").style.borderColor = "#094fb5";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
        
      }
      if (e.target.matches(".unidades")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;


        await ajax({
          url: `${api.SUBITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
      //      console.log(newArray);   
            renderTableUnits(newArray);
          },
        });

        d.getElementById("unidades").style.color = "#ffffffe8";
        d.getElementById("unidades").style.backgroundColor = "#10438e";
        d.getElementById("unidades").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
      }
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
        generar_xls('table_xls', 'Reporte');
 
      }
      
      
      return;
    });
    
    d.addEventListener("submit", (e) => {
      e.preventDefault();
       clearInterval(updateData);
           //console.log(e.target);

      if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
        console.log(e.target);
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
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.fechaf.includes(query) ||
            e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
      }

      else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
    //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();

    //  console.log(query);

       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
     } 

     else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
      console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();

      //console.log(query);

      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
          e.classList.add("filter");
        }
                      });
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

 
   } else

 if (!hash || hash === "#/Tracking") {
    localStorage.tabConveyance = false;
    localStorage.tabUnit = false;
    localStorage.tabViajes = true;
     
    await ajax({
      url: `${api.ITEMS}.json`,
      cbSuccess: (items) => {   
        newArray = items;
        //console.log(itemsArray)   
        renderTable(newArray);
      },
    });

    const updateData = setInterval(  () => {
      
      ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {
          
            //console.log(Object.values(items));
              listenItemsArray = Object.values(items);
              let firstArray = Object.values(newArray);
               // console.log(Object.entries(itemsArray).length);

               if(listenItemsArray.length === firstArray.length){

                
                  for (let i = 0; i < firstArray.length; i++) {
                    let e = firstArray[i];
                     let e2 = listenItemsArray[i];
              
                   if( e.fecha != e2.fecha || e.caja != e2.caja 
                    || e.unidad != e2.unidad || e.bol != e2.bol 
                    || e.af != e2.af || e.ag != e2.ag 
                    || e.cliente != e2.cliente || e.cporte != e2.cporte
                    || e.tracking != e2.tracking || e.llegada != e2.llegada
                    || e.status != e2.status || e.ventana != e2.ventana
                    || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                    ) {
                    //  console.log("UPDATE")
                    renderTable(items);
                     }
     
                   }
                 } 
                 else {
                 // console.log("UPDATE");
                 renderTable(items);

                  
                 }


             
             //console.log(listenItemsArray);
           }       
        })

    }, 5000);
       
    updateData;


    let sectionActive = () => {
      d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
       };

       if(localStorage.tabViajes){
        sectionActive();
      }

 
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
         <th scope="col">FECHA</th>
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

         await ajax({
          url: `${api.ITEMS}.json`,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);

            let itemsArray = Object.entries(items);
         
           //console.log(itemsArray);
 
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


         if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
          
          d.getElementById("exportModalXls").innerHTML = `

          <section id="thtable" class="thtable">
          <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
          <th scope="col">VERIFICACION</th>
          <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>  
          </tr>
          </thead>
   
          <tbody id="table_body" class="body_table">
          </tbody>
      
          </table>
          </section>
          `; 
          
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
 
              let itemsArray = Object.entries(items);
           
             //console.log(itemsArray);
   
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
 
  
              orderItems.forEach((item) => {
                d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
              });
  
               //Helper de acceso a los items
                 const $tr = d.querySelectorAll(".item2");
                  const newOrder = Array.from($tr);

              // console.log($tr);
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
        
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
          d.getElementById("exportModalXls").innerHTML = `

        <section id="thtable" class="thtable">
       <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
        </tr>
      <tr style="background-color:black; color:white;">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">KILOMETRAJE</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>  
      </tr>
    </thead>
 
    <tbody id="table_body" class="body_table">
    </tbody>
    
  </table>
</section>
        `; 
         
          await ajax({
            url: `${api.SUBITEMS}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
 
              let itemsArray = Object.entries(items);
           
             //console.log(itemsArray);
   
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
 
  
              orderItems.forEach((item) => {
                d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
              });
  
               //Helper de acceso a los items
                 const $tr = d.querySelectorAll(".item2");
                  const newOrder = Array.from($tr);

              // console.log($tr);
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
       }
       if (e.target.matches(".cancelXls") || e.target.matches(".report")){
        location.reload();
      }
       if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
        // console.log(e.target);
 
         let isConfirm = confirm("¿Eliminar Registro?");
 
         if (isConfirm) {
          await ajax({
             url: `${api.ITEMS}/${e.target.id}.json`,
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
           location.reload();
         }
       }
       if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
       
        const tabConv = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th id="cajas" scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
          <th scope="col">VERIFICACION</th>
          <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
      <td><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 150px; background-color: #69beff;"  value="${item.contacto}"></td>
      <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 90px; background-color: #69beff;" type="text"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        const tabUnit = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 100px; background-color: #69beff;"  value="${item.contacto}"></td>
      <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 100px; background-color: #69beff;" type="text"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        //  console.log();
         if(localStorage.tabViajes === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
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
              <th scope="col">COMENTARIOS</th>
        
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
          <option value="Tarde">Tarde</option>
          <option value="Desfasada">Desfasada</option>
          <option value="Critica">Critica</option>
          </select>
          </td>
          <td>
          <input name="status" style="width: 130px;" type="text"  value="${item.status}">
          </td>
          <td>
          <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
            },
          });
         }
         if(localStorage.tabConveyance === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
          await ajax({
            url: `${api.SUBITEMS1}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              tabConv(item);
            },
          });
         }
         if(localStorage.tabUnit === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
        
          await ajax({
            url: `${api.SUBITEMS}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              tabUnit(item);
            },
          });

         }

       }
       if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        // console.log(e.target);

      
        await ajax({
          url: `${api.SUBITEMS}.json`,
          method: "GET",
          cbSuccess: (unit) => {
         
           // console.log(e.target);
           let unitArray = Object.entries(unit);
           

           unitArray.forEach(unit => {
            if(e.target.id === unit[1].unidad){

              d.getElementById("controlModal").style.height = "60vh";
            d.querySelector(".control-modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">OPERADOR</th>
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
          <td>${unit[1].unidad}</td>
          <td>${unit[1].operador}</td>
          <td>${unit[1].modelo}</td>
          <td>${unit[1].placa}</td>
          <td>${unit[1].año}</td>
          <td>${unit[1].verificacion}</td>
          <td>${unit[1].poliza}</td>
          <td>${unit[1].inciso}</td>
          <td>${unit[1].contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
        </div>
          `;

         d.getElementById("controlV").dataset.unit = unit[0];

         

            } 
           });

          },
        });

        await ajax({
          url: `${api.SUBITEMS1}.json`,
          method: "GET",
          cbSuccess: (conv) => {
          
           let convArray = Object.entries(conv);
           
           convArray.forEach(conv => {
          
            if(e.target.dataset.conveyance === conv[1].caja){

              d.getElementById("controlModal").style.height = "45vh";
              d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
              <div class="container-fluid"> 
      
                 <table class="table table-sm" >
                 <thead class="table-dark text-center">
                   <tr class="text-wrap">
                   <th scope="col">CAJA</th>
                   <th scope="col">TIPO</th>
                   <th scope="col">MODELO</th>
                   <th scope="col">PLACA</th>
                   <th scope="col">AÑO</th>
                   <th scope="col">VERIFICACION</th>
                   <th scope="col">NO. POLIZA</th>
                   <th scope="col">INCISO</th>
                   <th scope="col">CONTACTO DEL SEGURO</th>
                   <th scope="col">CIRCUITO</th>
                   <th scope="col">FECHA</th>
                   <th scope="col">UBICACION</th> 
                   <th scope="col">ESTATUS</th>
                   </tr>
                 </thead>
                 <tbody class="text-center text-wrap" >
          <td>${conv[1].caja}</td>
          <td>${conv[1].tipo}</td>
          <td>${conv[1].modelo}</td>
          <td>${conv[1].placa}</td>
          <td>${conv[1].año}</td>
          <td>${conv[1].verificacion}</td>
          <td>${conv[1].poliza}</td>
          <td>${conv[1].inciso}</td>
          <td>${conv[1].contacto}</td>
          <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
          <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
          <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
          <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
          </tbody>      
                </div>` 
        
            );

            d.getElementById("controlV").dataset.conveyance = conv[0];
              
            }
          
          });

        
         
            
          }

        });
    


       }
       if (e.target.matches(".tablero")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTable(newArray);
          },
        });

        d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
      }
      if (e.target.matches(".cajas")) {
        clearInterval(updateData);
        localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.SUBITEMS1}.json`,
          cbSuccess: (items) => {   
            newArray = items;
          //  console.log(newArray)   
           renderTableCV(newArray);
          },
        });

        d.getElementById("cajas").style.color = "#ffffffe8";
        d.getElementById("cajas").style.backgroundColor = "#10438e";
        d.getElementById("cajas").style.borderColor = "#094fb5";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
        
      }
      if (e.target.matches(".unidades")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;


        await ajax({
          url: `${api.SUBITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
      //      console.log(newArray);   
            renderTableUnits(newArray);
          },
        });

        d.getElementById("unidades").style.color = "#ffffffe8";
        d.getElementById("unidades").style.backgroundColor = "#10438e";
        d.getElementById("unidades").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
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
            <th scope="col">COMENTARIOS</th>
      
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
        <input name="x3" style="width: 130px;" type="text"  value="">
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
       clearInterval(updateData);
    // console.log(e.target);
     let change = d.getElementById("cajas").classList;
    // console.log(change);
    if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.fechaf.includes(query) ||
            e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
                      });
      }
      else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
  //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

  //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
      } 
      else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
   // console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

    //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
    //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } 
      else if (e.dataset.unit.includes(query) ||
      e.dataset.circuito.includes(query) ||
      e.dataset.ubicacion.includes(query)
      ) {
        e.classList.remove("filter");
      } 
      else {
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
               x3: e.target.x3.value.toUpperCase()
             }),
           };
         await ajax({
             url: `${api.ITEMS}.json`,
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

        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
        }    
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
          
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
    
    
        } 
        else if(localStorage.tabViajes === "true") {
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
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
                x3: e.target.x3.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
             //   console.log(res);
              },
            });
            location.reload();
          }
        }
          }

      else if (e.target.matches(".update")) {
          //console.log(e.target);

        //UPDATE
         //console.log(e.target.textarea[0].value.toUpperCase());
         //console.log(e.target.textarea[1].value.toUpperCase());

         let keyUnit = d.getElementById("controlV").dataset.unit;
         let keyConv = d.getElementById("controlV").dataset.conveyance;

        // console.log(keyUnit);

         
         if (!e.target.id.value) {
         
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              comentarios: e.target.textarea.value.toUpperCase()
            }),
          };

            await ajax({
               url: `${api.SUBITEMS}/${keyUnit}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });

           options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };

            await ajax({
               url: `${api.SUBITEMS1}/${keyConv}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });

             location.reload();
        }
        

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

     
   } else

 if (!hash || hash === "#/Traffic") {
      localStorage.tabConveyance = false;
      localStorage.tabUnit = false;
      localStorage.tabViajes = true;
     
    await ajax({
      url: `${api.ITEMS}.json`,
      cbSuccess: (items) => {   
        newArray = items;
        //console.log(newArray)   
        renderTable(newArray);
      },
    });

    const updateData = setInterval(  () => {
      
      ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {
          
            //console.log(Object.values(items));
              listenItemsArray = Object.values(items);
              let firstArray = Object.values(newArray);
               // console.log(Object.entries(itemsArray).length);

               if(listenItemsArray.length === firstArray.length){

                
                  for (let i = 0; i < firstArray.length; i++) {
                    let e = firstArray[i];
                     let e2 = listenItemsArray[i];
              
                   if( e.fecha != e2.fecha || e.caja != e2.caja 
                    || e.unidad != e2.unidad || e.bol != e2.bol 
                    || e.af != e2.af || e.ag != e2.ag 
                    || e.cliente != e2.cliente || e.cporte != e2.cporte
                    || e.tracking != e2.tracking || e.llegada != e2.llegada
                    || e.status != e2.status || e.ventana != e2.ventana
                    || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                    ) {
                    //  console.log("UPDATE")
                    renderTable(items);
                     }
     
                   }
                 } 
                 else {
                 // console.log("UPDATE");
                 renderTable(items);

                  
                 }


             
             //console.log(listenItemsArray);
           }       
        })

    }, 5000);
       
    updateData;


    let sectionActive = () => {
      d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
       };

       if(localStorage.tabViajes){
        sectionActive();
      }


    d.addEventListener("click", async (e) => {
      d.getElementById("cajas").classList.add("change");
      let change = d.getElementById("cajas").classList;
     
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

      
      await ajax({
          url: `${api.ITEMS}.json`,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);
            let itemsArray = Object.entries(items);
          
            //console.log(itemsArray);
  
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
      if (e.target.matches(".cancelXls") || e.target.matches(".report")){
        location.reload();
      }
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {

        const tabConv = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th id="cajas" scope="col">CAJA</th>
        <th class="tipo" scope="col">TIPO</th>
        <th class="modelo" scope="col">MODELO</th>
        <th class="placa" scope="col">PLACA</th>
        <th class="año" scope="col">AÑO</th>
        <th class="verificacion" scope="col">VERIFICACION</th>
        <th class="poliza" scope="col">NO. POLIZA</th>
        <th class="inciso" scope="col">INCISO</th>
        <th class="contacto" scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
      <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
      <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
      <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
      <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
      <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 90px; background-color: #69beff;"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        const tabUnit = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
      <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 100px; background-color: #69beff;"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        //  console.log();
         if(localStorage.tabViajes === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
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
              <th scope="col">COMENTARIOS</th>
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap" >
          <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}"></td>
          <td><input name="caja" style="width: 60px;" type="text"   value="${item.caja}"></td>
          <td><input name="operador" style="width: 130px;" type="text"  value="${item.operador}"></td>
          <td><input name="cporte" style="width: 70px;" type="text"  value="${item.cporte}"></td>
          <td><input name="tracking" style="width: 80px;" type="text"  value="${item.tracking}" disabled></td>
          <td><input name="bol" style="width: 75px;" type="text"  value="${item.bol}"></td>
          <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" disabled></td>
          <td><input name="cliente" style="width: 95px;" type="text"  value="${item.cliente}" disabled></td>
          <td><input name="fecha" type="text" style="width: 80px;"  value="${item.fecha}" disabled></td>
          <td><input name="ventana" type="time" name="hour" id="hour"  value="${item.ventana}" disabled></td>
          <td>
          <select class="form-select form-select-sm" name="llegada" id="arribo">
          <option value="${item.llegada}">${item.llegada}</option> 
          <option value="A Tiempo">A Tiempo</option>  
          <option value="Tarde" >Tarde</option>
          <option value="Desfasada" >Desfasada</option>
          <option value="Critica" >Critica</option>
          </select>
          </td>
          <td>
          <input name="status" style="width: 95px;" type="text"  value="${item.status}">
          </td>
          <td>
          <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
            },
          });
         }
         if(localStorage.tabConveyance === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
          await ajax({
            url: `${api.SUBITEMS1}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              tabConv(item);
            },
          });
         }
         if(localStorage.tabUnit === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
        
          await ajax({
            url: `${api.SUBITEMS}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              tabUnit(item);
            },
          });

         }
          
      }
      if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        // console.log(e.target);
       
        await ajax({
          url: `${api.SUBITEMS}.json`,
          method: "GET",
          cbSuccess: (unit) => {
         
           // console.log(e.target);
           let unitArray = Object.entries(unit);
           

           unitArray.forEach(unit => {
            if(e.target.id === unit[1].unidad){

              d.getElementById("controlModal").style.height = "60vh";
            d.querySelector(".control-modal-body").innerHTML = `
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
              <th scope="col">KILOMETRAJE</th> 
            </tr>
          </thead>
          <tbody class="text-center" class="text-wrap">
          <tr>
          <td>${unit[1].unidad}</td>
          <td>${unit[1].modelo}</td>
          <td>${unit[1].placa}</td>
          <td>${unit[1].año}</td>
          <td>${unit[1].verificacion}</td>
          <td>${unit[1].poliza}</td>
          <td>${unit[1].inciso}</td>
          <td>${unit[1].contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
        </div>
          `;

         d.getElementById("controlV").dataset.unit = unit[0];

         

            } 
           });

          },
        });

        await ajax({
          url: `${api.SUBITEMS1}.json`,
          method: "GET",
          cbSuccess: (conv) => {
          
           let convArray = Object.entries(conv);
           
           convArray.forEach(conv => {
          
            if(e.target.dataset.conveyance === conv[1].caja){

              d.getElementById("controlModal").style.height = "45vh";
              d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
              <div class="container-fluid"> 
      
                 <table class="table table-sm" >
                 <thead class="table-dark text-center">
                   <tr class="text-wrap">
                   <th scope="col">CAJA</th>
                   <th scope="col">TIPO</th>
                   <th scope="col">MODELO</th>
                   <th scope="col">PLACA</th>
                   <th scope="col">AÑO</th>
                   <th scope="col">VERIFICACION</th>
                   <th scope="col">NO. POLIZA</th>
                   <th scope="col">INCISO</th>
                   <th scope="col">MARCHAMO</th>
                   <th scope="col">CIRCUITO</th>
                   <th scope="col">RUTA</th>
                   <th scope="col">UBICACION</th> 
                   <th scope="col">ESTATUS</th>
                   </tr>
                 </thead>
                 <tbody class="text-center text-wrap" >
          <td>${conv[1].caja}</td>
          <td>${conv[1].tipo}</td>
          <td>${conv[1].modelo}</td>
          <td>${conv[1].placa}</td>
          <td>${conv[1].año}</td>
          <td>${conv[1].verificacion}</td>
          <td>${conv[1].poliza}</td>
          <td>${conv[1].inciso}</td>
          <td>${conv[1].contacto}</td>
          <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
          <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].ruta}"></td>
          <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
          <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
          </tbody>      
                </div>` 
        
            );

            d.getElementById("controlV").dataset.conveyance = conv[0];
              
            }
          
          });

        
         
            
          }

        });
      

       }
       if (e.target.matches(".tablero")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTable(newArray);
          },
        });

        d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
      }
       if (e.target.matches(".cajas")) {
        clearInterval(updateData);
        localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;



        await ajax({
          url: `${api.SUBITEMS1}.json`,
          cbSuccess: (items) => {   
            newArray = items;
          //  console.log(newArray)   
           renderTableCV(newArray);
          },
        });

        d.getElementById("cajas").style.color = "#ffffffe8";
        d.getElementById("cajas").style.backgroundColor = "#10438e";
        d.getElementById("cajas").style.borderColor = "#094fb5";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
        
      }
      if (e.target.matches(".unidades")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;


        await ajax({
          url: `${api.SUBITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
      //      console.log(newArray);   
            renderTableUnits(newArray);
          },
        });

        d.getElementById("unidades").style.color = "#ffffffe8";
        d.getElementById("unidades").style.backgroundColor = "#10438e";
        d.getElementById("unidades").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
      }
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
 
      }
      return;
    });

    d.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearInterval(updateData);
   // console.log(e.target);
    let change = d.getElementById("cajas").classList;
      
       // console.log(change);
       if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.fechaf.includes(query) ||
            e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
    //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
  
    //  console.log(query);
  
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
     // console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
  
      //console.log(query);
  
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
          e.classList.add("filter");
        }
                      });
        }  
      
        else if (e.target.matches(".edit")) {
       
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
          }    
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
            
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
  
  
          } 
          else if(localStorage.tabViajes === "true") {
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
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
                  x3: e.target.x3.value.toUpperCase()
                  
                }),
              };
             await ajax({
                url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
               //   console.log(res);
                },
              });
              location.reload();
            }
          }
         
        }

      else if (e.target.matches(".update")) {
        //console.log(e.target);

      //UPDATE
       //console.log(e.target.textarea[0].value.toUpperCase());
       //console.log(e.target.textarea[1].value.toUpperCase());

       let keyUnit = d.getElementById("controlV").dataset.unit;
       let keyConv = d.getElementById("controlV").dataset.conveyance;

      // console.log(keyUnit);

       
       if (!e.target.id.value) {
       
        let options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            comentarios: e.target.textarea.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS}/${keyUnit}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

         options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
              circuito: e.target.circuito.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              ubicacion: e.target.ubicacion.value.toUpperCase(),
              comentarios: e.target.comentarios.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS1}/${keyConv}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

           location.reload();
      }
      

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
   

  } else

  if (!hash || hash === "#/TrafficH") {
    localStorage.tabConveyance = false;
    localStorage.tabUnit = false;
    localStorage.tabViajes = true;
   
  await ajax({
    url: `${api.ITEMS}.json`,
    cbSuccess: (items) => {   
      newArray = items;
      //console.log(newArray)   
      renderTable(newArray);
    },
  });

  const updateData = setInterval(  () => {
    
    ajax({
      url: `${api.ITEMS}.json`,
      cbSuccess: (items) => {
        
          //console.log(Object.values(items));
            listenItemsArray = Object.values(items);
            let firstArray = Object.values(newArray);
             // console.log(Object.entries(itemsArray).length);

             if(listenItemsArray.length === firstArray.length){

              
                for (let i = 0; i < firstArray.length; i++) {
                  let e = firstArray[i];
                   let e2 = listenItemsArray[i];
            
                 if( e.fecha != e2.fecha || e.caja != e2.caja 
                  || e.unidad != e2.unidad || e.bol != e2.bol 
                  || e.af != e2.af || e.ag != e2.ag 
                  || e.cliente != e2.cliente || e.cporte != e2.cporte
                  || e.tracking != e2.tracking || e.llegada != e2.llegada
                  || e.status != e2.status || e.ventana != e2.ventana
                  || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                  ) {
                  //  console.log("UPDATE")
                  renderTable(items);
                   }
   
                 }
               } 
               else {
               // console.log("UPDATE");
               renderTable(items);

                
               }


           
           //console.log(listenItemsArray);
         }       
      })

  }, 5000);
     
  updateData;


  let sectionActive = () => {
    d.getElementById("tablero").style.color = "#ffffffe8";
      d.getElementById("tablero").style.backgroundColor = "#10438e";
      d.getElementById("tablero").style.borderColor = "#094fb5";

      d.getElementById("cajas").style.color = "";
      d.getElementById("cajas").style.backgroundColor = "";
      d.getElementById("cajas").style.borderColor = "";

      d.getElementById("unidades").style.color = "";
      d.getElementById("unidades").style.backgroundColor = "";
      d.getElementById("unidades").style.borderColor = "";
     };

     if(localStorage.tabViajes){
      sectionActive();
    }


  d.addEventListener("click", async (e) => {
    d.getElementById("cajas").classList.add("change");
    let change = d.getElementById("cajas").classList;
   
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

    
    await ajax({
        url: `${api.ITEMS}.json`,
        method: "GET",
        cbSuccess: (items) => {
          //console.log(items);
          let itemsArray = Object.entries(items);
        
          //console.log(itemsArray);

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
    if (e.target.matches(".cancelXls") || e.target.matches(".report")){
      location.reload();
    }
    if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {

      const tabConv = (item) => {

        d.getElementById("formulario").classList.add("edit");
        d.getElementById("formulario").classList.remove("register");
        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
        d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid"> 
        <table class="table table-sm" >
    <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th id="cajas" scope="col">CAJA</th>
      <th class="tipo" scope="col">TIPO</th>
      <th class="modelo" scope="col">MODELO</th>
      <th class="placa" scope="col">PLACA</th>
      <th class="año" scope="col">AÑO</th>
      <th class="verificacion" scope="col">VERIFICACION</th>
      <th class="poliza" scope="col">NO. POLIZA</th>
      <th class="inciso" scope="col">INCISO</th>
      <th class="contacto" scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap" >
    <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
    <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
    <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
    <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
    <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
    <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
    <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
    <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
    <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
    <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
    <td><input name="fecha" style="width: 90px; background-color: #69beff;"  value="${item.fecha}"></td>
    <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
    <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
    </tbody>
    
  </table>
  </div>
        `;
      }

      const tabUnit = (item) => {

        d.getElementById("formulario").classList.add("edit");
        d.getElementById("formulario").classList.remove("register");
        d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
        d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid"> 
        <table class="table table-sm" >
    <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
  <th scope="col">OPERADOR</th>
  <th scope="col">MODELO</th>
  <th scope="col">PLACA</th>
  <th scope="col">AÑO</th>
   <th scope="col">VERIFICACION</th>
   <th scope="col">NO. POLIZA</th>
  <th scope="col">INCISO</th>
  <th scope="col">KILOMETRAJE</th>
  <th scope="col">CIRCUITO</th>
  <th scope="col">FECHA</th>
  <th scope="col">UBICACION</th> 
  <th scope="col">ESTATUS</th>

      </tr>
    </thead>
    <tbody class="text-center text-wrap" >
    <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
    <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
    <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
    <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
    <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
    <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
    <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
    <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
    <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
    <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
    <td><input name="fecha" style="width: 100px; background-color: #69beff;"  value="${item.fecha}"></td>
    <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
    <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
    </tbody>
    
  </table>
  </div>
        `;
      }

      //  console.log();
       if(localStorage.tabViajes === "true"){
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;
       await ajax({
          url: `${api.ITEMS}/${e.target.id}.json`,
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
            <th scope="col">COMENTARIOS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}"></td>
        <td><input name="caja" style="width: 60px;" type="text"   value="${item.caja}"></td>
        <td><input name="operador" style="width: 130px;" type="text"  value="${item.operador}"></td>
        <td><input name="cporte" style="width: 70px;" type="text"  value="${item.cporte}"></td>
        <td><input name="tracking" style="width: 80px;" type="text"  value="${item.tracking}" disabled></td>
        <td><input name="bol" style="width: 75px;" type="text"  value="${item.bol}"></td>
        <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" disabled></td>
        <td><input name="cliente" style="width: 95px;" type="text"  value="${item.cliente}" disabled></td>
        <td><input name="fecha" type="text" style="width: 80px;"  value="${item.fecha}" disabled></td>
        <td><input name="ventana" type="time" name="hour" id="hour"  value="${item.ventana}" disabled></td>
        <td>
        <select class="form-select form-select-sm" name="llegada" id="arribo">
        <option value="${item.llegada}">${item.llegada}</option> 
        <option value="A Tiempo">A Tiempo</option>  
        <option value="Tarde" >Tarde</option>
        <option value="Desfasada" >Desfasada</option>
        <option value="Critica" >Critica</option>
        </select>
        </td>
        <td>
        <input name="status" style="width: 95px;" type="text"  value="${item.status}">
        </td>
        <td>
        <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
        </td>    
        </tbody>
        
      </table>
      </div>
            `;
          },
        });
       }
       if(localStorage.tabConveyance === "true"){
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;
        await ajax({
          url: `${api.SUBITEMS1}/${e.target.id}.json`,
          method: "GET",
          cbSuccess: (item) => {
            // console.log(item);
            tabConv(item);
          },
        });
       }
       if(localStorage.tabUnit === "true"){
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;
      
        await ajax({
          url: `${api.SUBITEMS}/${e.target.id}.json`,
          method: "GET",
          cbSuccess: (item) => {
            // console.log(item);
            tabUnit(item);
          },
        });

       }
        
    }
    if (e.target.matches(".control") || e.target.matches(".fa-car")) {
      // console.log(e.target);
     
      await ajax({
        url: `${api.SUBITEMS}.json`,
        method: "GET",
        cbSuccess: (unit) => {
       
         // console.log(e.target);
         let unitArray = Object.entries(unit);
         

         unitArray.forEach(unit => {
          if(e.target.id === unit[1].unidad){

            d.getElementById("controlModal").style.height = "60vh";
          d.querySelector(".control-modal-body").innerHTML = `
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
            <th scope="col">KILOMETRAJE</th> 
          </tr>
        </thead>
        <tbody class="text-center" class="text-wrap">
        <tr>
        <td>${unit[1].unidad}</td>
        <td>${unit[1].modelo}</td>
        <td>${unit[1].placa}</td>
        <td>${unit[1].año}</td>
        <td>${unit[1].verificacion}</td>
        <td>${unit[1].poliza}</td>
        <td>${unit[1].inciso}</td>
        <td>${unit[1].contacto}</td>     
        </tr>   
        </tbody>      
      </table>

      <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
      </div>
        `;

       d.getElementById("controlV").dataset.unit = unit[0];

       

          } 
         });

        },
      });

      await ajax({
        url: `${api.SUBITEMS1}.json`,
        method: "GET",
        cbSuccess: (conv) => {
        
         let convArray = Object.entries(conv);
         
         convArray.forEach(conv => {
        
          if(e.target.dataset.conveyance === conv[1].caja){

            d.getElementById("controlModal").style.height = "45vh";
            d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
            <div class="container-fluid"> 
    
               <table class="table table-sm" >
               <thead class="table-dark text-center">
                 <tr class="text-wrap">
                 <th scope="col">CAJA</th>
                 <th scope="col">TIPO</th>
                 <th scope="col">MODELO</th>
                 <th scope="col">PLACA</th>
                 <th scope="col">AÑO</th>
                 <th scope="col">VERIFICACION</th>
                 <th scope="col">NO. POLIZA</th>
                 <th scope="col">INCISO</th>
                 <th scope="col">MARCHAMO</th>
                 <th scope="col">CIRCUITO</th>
                 <th scope="col">RUTA</th>
                 <th scope="col">UBICACION</th> 
                 <th scope="col">ESTATUS</th>
                 </tr>
               </thead>
               <tbody class="text-center text-wrap" >
        <td>${conv[1].caja}</td>
        <td>${conv[1].tipo}</td>
        <td>${conv[1].modelo}</td>
        <td>${conv[1].placa}</td>
        <td>${conv[1].año}</td>
        <td>${conv[1].verificacion}</td>
        <td>${conv[1].poliza}</td>
        <td>${conv[1].inciso}</td>
        <td>${conv[1].contacto}</td>
        <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
        <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].ruta}"></td>
        <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
        <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
        </tbody>      
              </div>` 
      
          );

          d.getElementById("controlV").dataset.conveyance = conv[0];
            
          }
        
        });

      
       
          
        }

      });
    

     }
     if (e.target.matches(".tablero")) {
      clearInterval(updateData);
      localStorage.tabConveyance = false;
      localStorage.tabViajes = true;
    localStorage.tabUnit = false;


      await ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {   
          newArray = items;
          //console.log(itemsArray)   
          renderTable(newArray);
        },
      });

      d.getElementById("tablero").style.color = "#ffffffe8";
      d.getElementById("tablero").style.backgroundColor = "#10438e";
      d.getElementById("tablero").style.borderColor = "#094fb5";

      d.getElementById("cajas").style.color = "";
      d.getElementById("cajas").style.backgroundColor = "";
      d.getElementById("cajas").style.borderColor = "";

      d.getElementById("unidades").style.color = "";
      d.getElementById("unidades").style.backgroundColor = "";
      d.getElementById("unidades").style.borderColor = "";
    }
     if (e.target.matches(".cajas")) {
      clearInterval(updateData);
      localStorage.tabConveyance = true;
      localStorage.tabViajes = false;
    localStorage.tabUnit = false;



      await ajax({
        url: `${api.SUBITEMS1}.json`,
        cbSuccess: (items) => {   
          newArray = items;
        //  console.log(newArray)   
         renderTableCV(newArray);
        },
      });

      d.getElementById("cajas").style.color = "#ffffffe8";
      d.getElementById("cajas").style.backgroundColor = "#10438e";
      d.getElementById("cajas").style.borderColor = "#094fb5";

      d.getElementById("tablero").style.color = "";
      d.getElementById("tablero").style.backgroundColor = "";
      d.getElementById("tablero").style.borderColor = "";

      d.getElementById("unidades").style.color = "";
      d.getElementById("unidades").style.backgroundColor = "";
      d.getElementById("unidades").style.borderColor = "";
      
    }
    if (e.target.matches(".unidades")) {
      clearInterval(updateData);
      localStorage.tabConveyance = false;
      localStorage.tabViajes = false;
      localStorage.tabUnit = true;


      await ajax({
        url: `${api.SUBITEMS}.json`,
        cbSuccess: (items) => {   
          newArray = items;
    //      console.log(newArray);   
          renderTableUnits(newArray);
        },
      });

      d.getElementById("unidades").style.color = "#ffffffe8";
      d.getElementById("unidades").style.backgroundColor = "#10438e";
      d.getElementById("unidades").style.borderColor = "#094fb5";

      d.getElementById("cajas").style.color = "";
      d.getElementById("cajas").style.backgroundColor = "";
      d.getElementById("cajas").style.borderColor = "";

      d.getElementById("tablero").style.color = "";
      d.getElementById("tablero").style.backgroundColor = "";
      d.getElementById("tablero").style.borderColor = "";
    }
    if(e.target.matches(".generar_xls")){
      //let $dataTable = d.getElementById("table_xls");
          generar_xls('table_xls', 'Reporte');

    }
    return;
  });

  d.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInterval(updateData);
 // console.log(e.target);
  let change = d.getElementById("cajas").classList;
    
     // console.log(change);
     if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
          e.dataset.operador.includes(query) ||
          e.dataset.track.includes(query) ||
          e.dataset.ruta.includes(query) ||
          e.dataset.cliente.includes(query) ||
          e.dataset.fechaf.includes(query) ||
          e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
                      });
      }
      else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
  //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

  //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
      } 
      else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
   // console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

    //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
    //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } 
      else if (e.dataset.unit.includes(query) ||
      e.dataset.circuito.includes(query) ||
      e.dataset.ubicacion.includes(query)
      ) {
        e.classList.remove("filter");
      } 
      else {
        e.classList.add("filter");
      }
                    });
      }  
    
      else if (e.target.matches(".edit")) {
     
        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
        }    
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
          
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }


        } 
        else if(localStorage.tabViajes === "true") {
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
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
                x3: e.target.x3.value.toUpperCase()
                
              }),
            };
           await ajax({
              url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
             //   console.log(res);
              },
            });
            location.reload();
          }
        }
       
      }

    else if (e.target.matches(".update")) {
      //console.log(e.target);

    //UPDATE
     //console.log(e.target.textarea[0].value.toUpperCase());
     //console.log(e.target.textarea[1].value.toUpperCase());

     let keyUnit = d.getElementById("controlV").dataset.unit;
     let keyConv = d.getElementById("controlV").dataset.conveyance;

    // console.log(keyUnit);

     
     if (!e.target.id.value) {
     
      let options = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          comentarios: e.target.textarea.value.toUpperCase()
        }),
      };

        await ajax({
           url: `${api.SUBITEMS}/${keyUnit}.json`,
          options,
          cbSuccess: (res) => {
           // console.log(res);
         },
      });

       options = {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            circuito: e.target.circuito.value.toUpperCase(),
            ruta: e.target.ruta.value.toUpperCase(),
            ubicacion: e.target.ubicacion.value.toUpperCase(),
            comentarios: e.target.comentarios.value.toUpperCase()
        }),
      };

        await ajax({
           url: `${api.SUBITEMS1}/${keyConv}.json`,
          options,
          cbSuccess: (res) => {
           // console.log(res);
         },
      });

         location.reload();
    }
    

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
 

} else

 if (!hash || hash === "#/InhouseTOL") {
    localStorage.tabConveyance = false;
    localStorage.tabUnit = false;
    localStorage.tabViajes = true;
     
    await ajax({
      url: `${api.ITEMS}.json`,
      cbSuccess: (items) => {   
        newArray = items;
        //console.log(itemsArray)   
        renderTable(newArray);
      },
    });

    const updateData = setInterval(  () => {
      
      ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {
          
            //console.log(Object.values(items));
              listenItemsArray = Object.values(items);
              let firstArray = Object.values(newArray);
               // console.log(Object.entries(itemsArray).length);

               if(listenItemsArray.length === firstArray.length){

                
                  for (let i = 0; i < firstArray.length; i++) {
                    let e = firstArray[i];
                     let e2 = listenItemsArray[i];
              
                   if( e.fecha != e2.fecha || e.caja != e2.caja 
                    || e.unidad != e2.unidad || e.bol != e2.bol 
                    || e.af != e2.af || e.ag != e2.ag 
                    || e.cliente != e2.cliente || e.cporte != e2.cporte
                    || e.tracking != e2.tracking || e.llegada != e2.llegada
                    || e.status != e2.status || e.ventana != e2.ventana
                    || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                    ) {
                     // console.log("UPDATE")
                     renderTable(items);
                     }
     
                   }
                 } 
                 else {
                //  console.log("UPDATE");
                renderTable(items);
                  
                 }


             
             //console.log(listenItemsArray);
           }       
        })

    }, 5000);
        
    updateData;

    let sectionActive = () => {
      d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
       };

       if(localStorage.tabViajes){
        sectionActive();
      }


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
       await ajax({
          url: `${api.ITEMS}.json`,
          method: "GET",
          cbSuccess: (items) => {
            //console.log(items);
            let itemsArray = Object.entries(items);
          
            //console.log(itemsArray);
  
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

        if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
          d.getElementById("exportModalXls").innerHTML = `

          <section id="thtable" class="thtable">
         <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">CAJA</th>
        <th scope="col">TIPO</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">MARCHAMO/th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>  
        </tr>
      </thead>
   
      <tbody id="table_body" class="body_table">
      </tbody>
      
    </table>
  </section>
          `; 
          
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
 
              let itemsArray = Object.entries(items);
           
             //console.log(itemsArray);
   
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
 
  
              orderItems.forEach((item) => {
                d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
              });
  
               //Helper de acceso a los items
                 const $tr = d.querySelectorAll(".item2");
                  const newOrder = Array.from($tr);

              // console.log($tr);
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
        
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
          d.getElementById("exportModalXls").innerHTML = `

        <section id="thtable" class="thtable">
       <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
        </tr>
      <tr style="background-color:black; color:white;">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">KILOMETRAJE</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>  
      </tr>
    </thead>
 
    <tbody id="table_body" class="body_table">
    </tbody>
    
  </table>
</section>
        `; 
         
          await ajax({
            url: `${api.SUBITEMS}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
 
              let itemsArray = Object.entries(items);
           
             //console.log(itemsArray);
   
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
 
  
              orderItems.forEach((item) => {
                d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
              });
  
               //Helper de acceso a los items
                 const $tr = d.querySelectorAll(".item2");
                  const newOrder = Array.from($tr);

              // console.log($tr);
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
        
      }
      if (e.target.matches(".cancelXls") || e.target.matches(".report")){
        location.reload();
      }
      if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
        console.log(e.target);

        let isConfirm = confirm("¿Eliminar Registro?");

        if (isConfirm) {
       await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
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

        const tabConv = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th id="cajas" scope="col">CAJA</th>
        <th class="tipo" scope="col">TIPO</th>
        <th class="modelo" scope="col">MODELO</th>
        <th class="placa" scope="col">PLACA</th>
        <th class="año" scope="col">AÑO</th>
        <th class="verificacion" scope="col">VERIFICACION</th>
        <th class="poliza" scope="col">NO. POLIZA</th>
        <th class="inciso" scope="col">INCISO</th>
        <th class="contacto" scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
      <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
      <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
      <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
      <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
      <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 90px; background-color: #69beff;"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        const tabUnit = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
      <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 100px; background-color: #69beff;"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        //  console.log();
         if(localStorage.tabViajes === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
         await ajax({
            url: `${api.ITEMS}/${e.target.id}.json`,
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
              <th scope="col">COMENTARIOS</th>
        
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
          <option value="Critica" >Critica</option>
          </select>
          </td>
          <td>
          <input name="status" style="width: 95px;" type="text"  value="${item.status}">
          </td>
          <td>
          <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
          </td>    
          </tbody>
          
        </table>
        </div>
              `;
            },
          });
         }
         if(localStorage.tabConveyance === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
          await ajax({
            url: `${api.SUBITEMS1}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              tabConv(item);
            },
          });
         }
         if(localStorage.tabUnit === "true"){
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
        
          await ajax({
            url: `${api.SUBITEMS}/${e.target.id}.json`,
            method: "GET",
            cbSuccess: (item) => {
              // console.log(item);
              tabUnit(item);
            },
          });

         }
          
      }
      if (e.target.matches(".control") || e.target.matches(".fa-car")) {
        // console.log(e.target);

      
        await ajax({
          url: `${api.SUBITEMS}.json`,
          method: "GET",
          cbSuccess: (unit) => {
         
           // console.log(e.target);
           let unitArray = Object.entries(unit);
           

           unitArray.forEach(unit => {
            if(e.target.id === unit[1].unidad){

              d.getElementById("controlModal").style.height = "60vh";
            d.querySelector(".control-modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
          <thead class="table-dark text-center">
            <tr class="text-wrap">
              <th scope="col">UNIDAD</th>
              <th scope="col">OPERADOR</th>
              <th scope="col">MODELO</th>
              <th scope="col">PLACA</th>
              <th scope="col">AÑO</th>
              <th scope="col">VERIFICACION</th>
              <th scope="col">NO. POLIZA</th>
              <th scope="col">INCISO</th>
              <th scope="col">KILOMETRAJE</th> 
            </tr>
          </thead>
          <tbody class="text-center" class="text-wrap">
          <tr>
          <td>${unit[1].unidad}</td>
          <td>${unit[1].operador}</td>
          <td>${unit[1].modelo}</td>
          <td>${unit[1].placa}</td>
          <td>${unit[1].año}</td>
          <td>${unit[1].verificacion}</td>
          <td>${unit[1].poliza}</td>
          <td>${unit[1].inciso}</td>
          <td>${unit[1].contacto}</td>     
          </tr>   
          </tbody>      
        </table>

        <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
        </div>
          `;

         d.getElementById("controlV").dataset.unit = unit[0];

         

            } 
           });

          },
        });

        await ajax({
          url: `${api.SUBITEMS1}.json`,
          method: "GET",
          cbSuccess: (conv) => {
          
           let convArray = Object.entries(conv);
           
           convArray.forEach(conv => {
          
            if(e.target.dataset.conveyance === conv[1].caja){

              d.getElementById("controlModal").style.height = "45vh";
              d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
              <div class="container-fluid"> 
      
                 <table class="table table-sm" >
                 <thead class="table-dark text-center">
                   <tr class="text-wrap">
                   <th scope="col">CAJA</th>
                   <th scope="col">TIPO</th>
                   <th scope="col">MODELO</th>
                   <th scope="col">PLACA</th>
                   <th scope="col">AÑO</th>
                   <th scope="col">VERIFICACION</th>
                   <th scope="col">NO. POLIZA</th>
                   <th scope="col">INCISO</th>
                   <th scope="col">MARCHAMO</th>
                   <th scope="col">CIRCUITO</th>
                   <th scope="col">FECHA</th>
                   <th scope="col">UBICACION</th> 
                   <th scope="col">ESTATUS</th>
                   </tr>
                 </thead>
                 <tbody class="text-center text-wrap" >
          <td>${conv[1].caja}</td>
          <td>${conv[1].tipo}</td>
          <td>${conv[1].modelo}</td>
          <td>${conv[1].placa}</td>
          <td>${conv[1].año}</td>
          <td>${conv[1].verificacion}</td>
          <td>${conv[1].poliza}</td>
          <td>${conv[1].inciso}</td>
          <td>${conv[1].contacto}</td>
          <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
          <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
          <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
          <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
          </tbody>      
                </div>` 
        
            );

            d.getElementById("controlV").dataset.conveyance = conv[0];
              
            }
          
          });

        
         
            
          }

        });
    


       }
       if (e.target.matches(".tablero")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
            //console.log(itemsArray)   
            renderTable(newArray);
          },
        });

        d.getElementById("tablero").style.color = "#ffffffe8";
        d.getElementById("tablero").style.backgroundColor = "#10438e";
        d.getElementById("tablero").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
      }
      if (e.target.matches(".cajas")) {
        clearInterval(updateData);
        localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;


        await ajax({
          url: `${api.SUBITEMS1}.json`,
          cbSuccess: (items) => {   
            newArray = items;
          //  console.log(newArray)   
           renderTableCV(newArray);
          },
        });

        d.getElementById("cajas").style.color = "#ffffffe8";
        d.getElementById("cajas").style.backgroundColor = "#10438e";
        d.getElementById("cajas").style.borderColor = "#094fb5";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";

        d.getElementById("unidades").style.color = "";
        d.getElementById("unidades").style.backgroundColor = "";
        d.getElementById("unidades").style.borderColor = "";
        
      }
      if (e.target.matches(".unidades")) {
        clearInterval(updateData);
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;


        await ajax({
          url: `${api.SUBITEMS}.json`,
          cbSuccess: (items) => {   
            newArray = items;
      //      console.log(newArray);   
            renderTableUnits(newArray);
          },
        });

        d.getElementById("unidades").style.color = "#ffffffe8";
        d.getElementById("unidades").style.backgroundColor = "#10438e";
        d.getElementById("unidades").style.borderColor = "#094fb5";

        d.getElementById("cajas").style.color = "";
        d.getElementById("cajas").style.backgroundColor = "";
        d.getElementById("cajas").style.borderColor = "";

        d.getElementById("tablero").style.color = "";
        d.getElementById("tablero").style.backgroundColor = "";
        d.getElementById("tablero").style.borderColor = "";
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
            <th scope="col">COMENTARIOS</th>
      
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
        <input name="x3" style="width: 130px;" type="text"  value="">
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
       clearInterval(updateData);
    // console.log(e.target);
     let change = d.getElementById("cajas").classList;
    // console.log(change);
      if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.fechaf.includes(query) ||
            e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
                      });
      }
      else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
  //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

  //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
      } 
      else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
  //  console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

    //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
    //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } 
      else if (e.dataset.unit.includes(query) ||
      e.dataset.circuito.includes(query) ||
      e.dataset.ubicacion.includes(query)
      ) {
        e.classList.remove("filter");
      } 
      else {
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
              x3: e.target.x3.value.toUpperCase()
            }),
          };
          await ajax({
            url: `${api.ITEMS}.json`,
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
       
        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
        }    
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
          
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
               circuito: e.target.circuito.value.toUpperCase(),
               fecha: e.target.fecha.value.toUpperCase(),
               ubicacion: e.target.ubicacion.value.toUpperCase(),
               comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }


        } 
        else if(localStorage.tabViajes === "true") {
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
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
                x3: e.target.x3.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
             //   console.log(res);
              },
            });
            location.reload();
          }
        }
       
      }
      else if (e.target.matches(".update")) {
        //console.log(e.target);

      //UPDATE
       //console.log(e.target.textarea[0].value.toUpperCase());
       //console.log(e.target.textarea[1].value.toUpperCase());

       let keyUnit = d.getElementById("controlV").dataset.unit;
       let keyConv = d.getElementById("controlV").dataset.conveyance;

      // console.log(keyUnit);

       
       if (!e.target.id.value) {
       
        let options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            comentarios: e.target.textarea.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS}/${keyUnit}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

         options = {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
              circuito: e.target.circuito.value.toUpperCase(),
              ruta: e.target.ruta.value.toUpperCase(),
              ubicacion: e.target.ubicacion.value.toUpperCase(),
              comentarios: e.target.comentarios.value.toUpperCase()
          }),
        };

          await ajax({
             url: `${api.SUBITEMS1}/${keyConv}.json`,
            options,
            cbSuccess: (res) => {
             // console.log(res);
           },
        });

           location.reload();
      }
      

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

    } else

 if (!hash || hash === "#/InhouseHMO") {
      localStorage.tabConveyance = false;
      localStorage.tabUnit = false;
      localStorage.tabViajes = true;
       
      await ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {   
          newArray = items;
          //console.log(itemsArray)   
          renderTable(newArray);
        },
      });
  
      const updateData = setInterval(  () => {
        
        ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {
            
              //console.log(Object.values(items));
                listenItemsArray = Object.values(items);
                let firstArray = Object.values(newArray);
                 // console.log(Object.entries(itemsArray).length);
  
                 if(listenItemsArray.length === firstArray.length){
  
                  
                    for (let i = 0; i < firstArray.length; i++) {
                      let e = firstArray[i];
                       let e2 = listenItemsArray[i];
                
                     if( e.fecha != e2.fecha || e.caja != e2.caja 
                      || e.unidad != e2.unidad || e.bol != e2.bol 
                      || e.af != e2.af || e.ag != e2.ag 
                      || e.cliente != e2.cliente || e.cporte != e2.cporte
                      || e.tracking != e2.tracking || e.llegada != e2.llegada
                      || e.status != e2.status || e.ventana != e2.ventana
                      || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                      ) {
                       // console.log("UPDATE")
                       renderTable(items);
                       }
       
                     }
                   } 
                   else {
                  //  console.log("UPDATE");
                  renderTable(items);
                    
                   }
  
  
               
               //console.log(listenItemsArray);
             }       
          })
  
      }, 5000);
          
      updateData;
  
      let sectionActive = () => {
        d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
         };
  
         if(localStorage.tabViajes){
          sectionActive();
        }
  
  
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
         await ajax({
            url: `${api.ITEMS}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
              let itemsArray = Object.entries(items);
            
              //console.log(itemsArray);
    
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
  
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
            d.getElementById("exportModalXls").innerHTML = `
  
            <section id="thtable" class="thtable">
           <table class="table table-hover table-sm" id="table_xls">
            <thead class="table-dark text-center align-middle">
            <tr style="background-color:black; color:white;">
            <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
            </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>  
          </tr>
        </thead>
     
        <tbody id="table_body" class="body_table">
        </tbody>
        
      </table>
    </section>
            `; 
            
            await ajax({
              url: `${api.SUBITEMS1}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
            d.getElementById("exportModalXls").innerHTML = `
  
          <section id="thtable" class="thtable">
         <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>  
        </tr>
      </thead>
   
      <tbody id="table_body" class="body_table">
      </tbody>
      
    </table>
  </section>
          `; 
           
            await ajax({
              url: `${api.SUBITEMS}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
        }
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
          location.reload();
        }
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
          console.log(e.target);
  
          let isConfirm = confirm("¿Eliminar Registro?");
  
          if (isConfirm) {
         await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
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

          const tabConv = (item) => {

            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th id="cajas" scope="col">CAJA</th>
          <th class="tipo" scope="col">TIPO</th>
          <th class="modelo" scope="col">MODELO</th>
          <th class="placa" scope="col">PLACA</th>
          <th class="año" scope="col">AÑO</th>
          <th class="verificacion" scope="col">VERIFICACION</th>
          <th class="poliza" scope="col">NO. POLIZA</th>
          <th class="inciso" scope="col">INCISO</th>
          <th class="contacto" scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
        <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
        <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
        <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
        <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
        <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
        <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
        <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
        <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
        <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
        <td><input name="fecha" style="width: 90px; background-color: #69beff;"  value="${item.fecha}"></td>
        <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
        <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
        </tbody>
        
      </table>
      </div>
            `;
          }
  
          const tabUnit = (item) => {
  
            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">KILOMETRAJE</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
        <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
        <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
        <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
        <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
        <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
        <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
        <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
        <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
        <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
        <td><input name="fecha" style="width: 100px; background-color: #69beff;"  value="${item.fecha}"></td>
        <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
        <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
        </tbody>
        
      </table>
      </div>
            `;
          }
  
          //  console.log();
           if(localStorage.tabViajes === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
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
                <th scope="col">COMENTARIOS</th>
          
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
            <option value="Critica" >Critica</option>
            </select>
            </td>
            <td>
            <input name="status" style="width: 95px;" type="text"  value="${item.status}">
            </td>
            <td>
            <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
            </td>    
            </tbody>
            
          </table>
          </div>
                `;
              },
            });
           }
           if(localStorage.tabConveyance === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
            await ajax({
              url: `${api.SUBITEMS1}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabConv(item);
              },
            });
           }
           if(localStorage.tabUnit === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
          
            await ajax({
              url: `${api.SUBITEMS}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabUnit(item);
              },
            });
  
           }
            
        }
        if (e.target.matches(".control") || e.target.matches(".fa-car")) {
          // console.log(e.target);
  
        
          await ajax({
            url: `${api.SUBITEMS}.json`,
            method: "GET",
            cbSuccess: (unit) => {
           
             // console.log(e.target);
             let unitArray = Object.entries(unit);
             
  
             unitArray.forEach(unit => {
              if(e.target.id === unit[1].unidad){
  
                d.getElementById("controlModal").style.height = "60vh";
              d.querySelector(".control-modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
            <thead class="table-dark text-center">
              <tr class="text-wrap">
                <th scope="col">UNIDAD</th>
                <th scope="col">OPERADOR</th>
                <th scope="col">MODELO</th>
                <th scope="col">PLACA</th>
                <th scope="col">AÑO</th>
                <th scope="col">VERIFICACION</th>
                <th scope="col">NO. POLIZA</th>
                <th scope="col">INCISO</th>
                <th scope="col">KILOMETRAJE</th> 
              </tr>
            </thead>
            <tbody class="text-center" class="text-wrap">
            <tr>
            <td>${unit[1].unidad}</td>
            <td>${unit[1].operador}</td>
            <td>${unit[1].modelo}</td>
            <td>${unit[1].placa}</td>
            <td>${unit[1].año}</td>
            <td>${unit[1].verificacion}</td>
            <td>${unit[1].poliza}</td>
            <td>${unit[1].inciso}</td>
            <td>${unit[1].contacto}</td>     
            </tr>   
            </tbody>      
          </table>
  
          <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
          </div>
            `;
  
           d.getElementById("controlV").dataset.unit = unit[0];
  
           
  
              } 
             });
  
            },
          });
  
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            method: "GET",
            cbSuccess: (conv) => {
            
             let convArray = Object.entries(conv);
             
             convArray.forEach(conv => {
            
              if(e.target.dataset.conveyance === conv[1].caja){
  
                d.getElementById("controlModal").style.height = "45vh";
                d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
                <div class="container-fluid"> 
        
                   <table class="table table-sm" >
                   <thead class="table-dark text-center">
                     <tr class="text-wrap">
                     <th scope="col">CAJA</th>
                     <th scope="col">TIPO</th>
                     <th scope="col">MODELO</th>
                     <th scope="col">PLACA</th>
                     <th scope="col">AÑO</th>
                     <th scope="col">VERIFICACION</th>
                     <th scope="col">NO. POLIZA</th>
                     <th scope="col">INCISO</th>
                     <th scope="col">CONTACTO DEL SEGURO</th>
                     <th scope="col">CIRCUITO</th>
                     <th scope="col">FECHA</th>
                     <th scope="col">UBICACION</th> 
                     <th scope="col">ESTATUS</th>
                     </tr>
                   </thead>
                   <tbody class="text-center text-wrap" >
            <td>${conv[1].caja}</td>
            <td>${conv[1].tipo}</td>
            <td>${conv[1].modelo}</td>
            <td>${conv[1].placa}</td>
            <td>${conv[1].año}</td>
            <td>${conv[1].verificacion}</td>
            <td>${conv[1].poliza}</td>
            <td>${conv[1].inciso}</td>
            <td>${conv[1].contacto}</td>
            <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
            <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
            <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
            <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
            </tbody>      
                  </div>` 
          
              );
  
              d.getElementById("controlV").dataset.conveyance = conv[0];
                
              }
            
            });
  
          
           
              
            }
  
          });
      
  
  
         }
         if (e.target.matches(".tablero")) {
          clearInterval(updateData);
          localStorage.tabConveyance = false;
          localStorage.tabViajes = true;
        localStorage.tabUnit = false;
  
  
          await ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
              //console.log(itemsArray)   
              renderTable(newArray);
            },
          });
  
          d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
        }
        if (e.target.matches(".cajas")) {
          clearInterval(updateData);
          localStorage.tabConveyance = true;
          localStorage.tabViajes = false;
        localStorage.tabUnit = false;
  
  
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            cbSuccess: (items) => {   
              newArray = items;
            //  console.log(newArray)   
             renderTableCV(newArray);
            },
          });
  
          d.getElementById("cajas").style.color = "#ffffffe8";
          d.getElementById("cajas").style.backgroundColor = "#10438e";
          d.getElementById("cajas").style.borderColor = "#094fb5";
  
          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
          
        }
        if (e.target.matches(".unidades")) {
          clearInterval(updateData);
          localStorage.tabConveyance = false;
          localStorage.tabViajes = false;
          localStorage.tabUnit = true;
  
  
          await ajax({
            url: `${api.SUBITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
        //      console.log(newArray);   
              renderTableUnits(newArray);
            },
          });
  
          d.getElementById("unidades").style.color = "#ffffffe8";
          d.getElementById("unidades").style.backgroundColor = "#10438e";
          d.getElementById("unidades").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
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
              <th scope="col">COMENTARIOS</th>
        
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
          <input name="x3" style="width: 130px;" type="text"  value="">
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
         clearInterval(updateData);
      // console.log(e.target);
       let change = d.getElementById("cajas").classList;
      // console.log(change);
        if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
              e.dataset.operador.includes(query) ||
              e.dataset.track.includes(query) ||
              e.dataset.ruta.includes(query) ||
              e.dataset.cliente.includes(query) ||
              e.dataset.fechaf.includes(query) ||
              e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
    //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
  
    //  console.log(query);
  
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
    //  console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
  
      //console.log(query);
  
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
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
                x3: e.target.x3.value.toUpperCase()
              }),
            };
            await ajax({
              url: `${api.ITEMS}.json`,
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
         
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
          }    
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
            
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                 circuito: e.target.circuito.value.toUpperCase(),
                 fecha: e.target.fecha.value.toUpperCase(),
                 ubicacion: e.target.ubicacion.value.toUpperCase(),
                 comentarios: e.target.comentarios.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
                 // console.log(res);
                },
              });
              location.reload();
            }
  
  
          } 
          else if(localStorage.tabViajes === "true") {
            if (!e.target.id.value) {
              let options = {
                method: "PATCH",
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
                  x3: e.target.x3.value.toUpperCase()
                }),
              };
             await ajax({
                url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
                options,
                cbSuccess: (res) => {
               //   console.log(res);
                },
              });
              location.reload();
            }
          }
         
        }
        else if (e.target.matches(".update")) {
          //console.log(e.target);
  
        //UPDATE
         //console.log(e.target.textarea[0].value.toUpperCase());
         //console.log(e.target.textarea[1].value.toUpperCase());
  
         let keyUnit = d.getElementById("controlV").dataset.unit;
         let keyConv = d.getElementById("controlV").dataset.conveyance;
  
        // console.log(keyUnit);
  
         
         if (!e.target.id.value) {
         
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              comentarios: e.target.textarea.value.toUpperCase()
            }),
          };
  
            await ajax({
               url: `${api.SUBITEMS}/${keyUnit}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });
  
           options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
  
            await ajax({
               url: `${api.SUBITEMS1}/${keyConv}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });
  
             location.reload();
        }
        
  
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
  
    } else

 if (!hash || hash === "#/InhouseMX") {
      localStorage.tabConveyance = false;
      localStorage.tabUnit = false;
      localStorage.tabViajes = true;
       
      await ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {   
          newArray = items;
          //console.log(itemsArray)   
          renderTable(newArray);
        },
      });
  
      const updateData = setInterval(  () => {
        
        ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {
            
              //console.log(Object.values(items));
                listenItemsArray = Object.values(items);
                let firstArray = Object.values(newArray);
                 // console.log(Object.entries(itemsArray).length);
  
                 if(listenItemsArray.length === firstArray.length){
  
                  
                    for (let i = 0; i < firstArray.length; i++) {
                      let e = firstArray[i];
                       let e2 = listenItemsArray[i];
                
                     if( e.fecha != e2.fecha || e.caja != e2.caja 
                      || e.unidad != e2.unidad || e.bol != e2.bol 
                      || e.af != e2.af || e.ag != e2.ag 
                      || e.cliente != e2.cliente || e.cporte != e2.cporte
                      || e.tracking != e2.tracking || e.llegada != e2.llegada
                      || e.status != e2.status || e.ventana != e2.ventana
                      || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                      ) {
                       // console.log("UPDATE")
                       renderTable(items);
                       }
       
                     }
                   } 
                   else {
                  //  console.log("UPDATE");
                  renderTable(items);
                    
                   }
  
  
               
               //console.log(listenItemsArray);
             }       
          })
  
      }, 5000);
          
      updateData;
  
      let sectionActive = () => {
        d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
         };
  
         if(localStorage.tabViajes){
          sectionActive();
        }
  
  
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
         await ajax({
            url: `${api.ITEMS}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
              let itemsArray = Object.entries(items);
            
              //console.log(itemsArray);
    
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
  
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
            d.getElementById("exportModalXls").innerHTML = `
  
            <section id="thtable" class="thtable">
           <table class="table table-hover table-sm" id="table_xls">
            <thead class="table-dark text-center align-middle">
            <tr style="background-color:black; color:white;">
            <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
            </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>  
          </tr>
        </thead>
     
        <tbody id="table_body" class="body_table">
        </tbody>
        
      </table>
    </section>
            `; 
            
            await ajax({
              url: `${api.SUBITEMS1}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
            d.getElementById("exportModalXls").innerHTML = `
  
          <section id="thtable" class="thtable">
         <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">KILOMETRAJE</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>  
        </tr>
      </thead>
   
      <tbody id="table_body" class="body_table">
      </tbody>
      
    </table>
  </section>
          `; 
           
            await ajax({
              url: `${api.SUBITEMS}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
        }
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
          location.reload();
        }
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
          console.log(e.target);
  
          let isConfirm = confirm("¿Eliminar Registro?");
  
          if (isConfirm) {
         await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
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
       
          const tabConv = (item) => {

            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th id="cajas" scope="col">CAJA</th>
          <th class="tipo" scope="col">TIPO</th>
          <th class="modelo" scope="col">MODELO</th>
          <th class="placa" scope="col">PLACA</th>
          <th class="año" scope="col">AÑO</th>
          <th class="verificacion" scope="col">VERIFICACION</th>
          <th class="poliza" scope="col">NO. POLIZA</th>
          <th class="inciso" scope="col">INCISO</th>
          <th class="contacto" scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
        <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
        <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
        <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
        <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
        <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
        <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
        <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
        <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
        <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
        <td><input name="fecha" style="width: 90px; background-color: #69beff;"  value="${item.fecha}"></td>
        <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
        <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
        </tbody>
        
      </table>
      </div>
            `;
          }
  
          const tabUnit = (item) => {
  
            d.getElementById("formulario").classList.add("edit");
            d.getElementById("formulario").classList.remove("register");
            d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
            d.querySelector(".modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
        <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">KILOMETRAJE</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
          </tr>
        </thead>
        <tbody class="text-center text-wrap" >
        <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
        <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
        <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
        <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
        <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
        <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
        <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
        <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
        <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
        <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
        <td><input name="fecha" style="width: 100px; background-color: #69beff;"  value="${item.fecha}"></td>
        <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
        <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
        </tbody>
        
      </table>
      </div>
            `;
          }

          //  console.log();
           if(localStorage.tabViajes === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
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
                <th scope="col">COMENTARIOS</th>
          
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
            <option value="Critica" >Critica</option>
            </select>
            </td>
            <td>
            <input name="status" style="width: 95px;" type="text"  value="${item.status}">
            </td>
            <td>
            <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
            </td>    
            </tbody>
            
          </table>
          </div>
                `;
              },
            });
           }
           if(localStorage.tabConveyance === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
            await ajax({
              url: `${api.SUBITEMS1}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabConv(item);
              },
            });
           }
           if(localStorage.tabUnit === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
          
            await ajax({
              url: `${api.SUBITEMS}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabUnit(item);
              },
            });
  
           }
  
         }
        if (e.target.matches(".control") || e.target.matches(".fa-car")) {
          // console.log(e.target);
  
        
          await ajax({
            url: `${api.SUBITEMS}.json`,
            method: "GET",
            cbSuccess: (unit) => {
           
             // console.log(e.target);
             let unitArray = Object.entries(unit);
             
  
             unitArray.forEach(unit => {
              if(e.target.id === unit[1].unidad){
  
                d.getElementById("controlModal").style.height = "60vh";
              d.querySelector(".control-modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
            <thead class="table-dark text-center">
              <tr class="text-wrap">
                <th scope="col">UNIDAD</th>
                <th scope="col">OPERADOR</th>
                <th scope="col">MODELO</th>
                <th scope="col">PLACA</th>
                <th scope="col">AÑO</th>
                <th scope="col">VERIFICACION</th>
                <th scope="col">NO. POLIZA</th>
                <th scope="col">INCISO</th>
                <th scope="col">MARCHAMO</th> 
              </tr>
            </thead>
            <tbody class="text-center" class="text-wrap">
            <tr>
            <td>${unit[1].unidad}</td>
            <td>${unit[1].operador}</td>
            <td>${unit[1].modelo}</td>
            <td>${unit[1].placa}</td>
            <td>${unit[1].año}</td>
            <td>${unit[1].verificacion}</td>
            <td>${unit[1].poliza}</td>
            <td>${unit[1].inciso}</td>
            <td>${unit[1].contacto}</td>     
            </tr>   
            </tbody>      
          </table>
  
          <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
          </div>
            `;
  
           d.getElementById("controlV").dataset.unit = unit[0];
  
           
  
              } 
             });
  
            },
          });
  
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            method: "GET",
            cbSuccess: (conv) => {
            
             let convArray = Object.entries(conv);
             
             convArray.forEach(conv => {
            
              if(e.target.dataset.conveyance === conv[1].caja){
  
                d.getElementById("controlModal").style.height = "45vh";
                d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
                <div class="container-fluid"> 
        
                   <table class="table table-sm" >
                   <thead class="table-dark text-center">
                     <tr class="text-wrap">
                     <th scope="col">CAJA</th>
                     <th scope="col">TIPO</th>
                     <th scope="col">MODELO</th>
                     <th scope="col">PLACA</th>
                     <th scope="col">AÑO</th>
                     <th scope="col">VERIFICACION</th>
                     <th scope="col">NO. POLIZA</th>
                     <th scope="col">INCISO</th>
                     <th scope="col">CONTACTO DEL SEGURO</th>
                     <th scope="col">CIRCUITO</th>
                     <th scope="col">FECHA</th>
                     <th scope="col">UBICACION</th> 
                     <th scope="col">ESTATUS</th>
                     </tr>
                   </thead>
                   <tbody class="text-center text-wrap" >
            <td>${conv[1].caja}</td>
            <td>${conv[1].tipo}</td>
            <td>${conv[1].modelo}</td>
            <td>${conv[1].placa}</td>
            <td>${conv[1].año}</td>
            <td>${conv[1].verificacion}</td>
            <td>${conv[1].poliza}</td>
            <td>${conv[1].inciso}</td>
            <td>${conv[1].contacto}</td>
            <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
            <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
            <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
            <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
            </tbody>      
                  </div>` 
          
              );
  
              d.getElementById("controlV").dataset.conveyance = conv[0];
                
              }
            
            });
  
          
           
              
            }
  
          });
      
  
  
         }
         if (e.target.matches(".tablero")) {
          clearInterval(updateData);
          localStorage.tabConveyance = false;
          localStorage.tabViajes = true;
        localStorage.tabUnit = false;
  
  
          await ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
              //console.log(itemsArray)   
              renderTable(newArray);
            },
          });
  
          d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
        }
        if (e.target.matches(".cajas")) {
          clearInterval(updateData);
          localStorage.tabConveyance = true;
          localStorage.tabViajes = false;
        localStorage.tabUnit = false;
  
  
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            cbSuccess: (items) => {   
              newArray = items;
            //  console.log(newArray)   
             renderTableCV(newArray);
            },
          });
  
          d.getElementById("cajas").style.color = "#ffffffe8";
          d.getElementById("cajas").style.backgroundColor = "#10438e";
          d.getElementById("cajas").style.borderColor = "#094fb5";
  
          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
          
        }
        if (e.target.matches(".unidades")) {
          clearInterval(updateData);
          localStorage.tabConveyance = false;
          localStorage.tabViajes = false;
          localStorage.tabUnit = true;
  
  
          await ajax({
            url: `${api.SUBITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
        //      console.log(newArray);   
              renderTableUnits(newArray);
            },
          });
  
          d.getElementById("unidades").style.color = "#ffffffe8";
          d.getElementById("unidades").style.backgroundColor = "#10438e";
          d.getElementById("unidades").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
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
              <th scope="col">COMENTARIOS</th>
        
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
          <input name="x3" style="width: 130px;" type="text"  value="">
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
         clearInterval(updateData);
      // console.log(e.target);
       let change = d.getElementById("cajas").classList;
      // console.log(change);
        if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
              e.dataset.operador.includes(query) ||
              e.dataset.track.includes(query) ||
              e.dataset.ruta.includes(query) ||
              e.dataset.cliente.includes(query) ||
              e.dataset.fechaf.includes(query) ||
              e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
    //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
  
    //  console.log(query);
  
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
    //  console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
  
      //console.log(query);
  
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
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
                x3: e.target.x3.value.toUpperCase()
              }),
            };
          await ajax({
              url: `${api.ITEMS}.json`,
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
 
         if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
           if (!e.target.id.value) {
             let options = {
               method: "PATCH",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
            await ajax({
               url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
               options,
               cbSuccess: (res) => {
                // console.log(res);
               },
             });
             location.reload();
           }
         }    
         if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
           
           if (!e.target.id.value) {
             let options = {
               method: "PATCH",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
            await ajax({
               url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
               options,
               cbSuccess: (res) => {
                // console.log(res);
               },
             });
             location.reload();
           }
     
     
         } 
         else if(localStorage.tabViajes === "true") {
           if (!e.target.id.value) {
             let options = {
               method: "PATCH",
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
                 x3: e.target.x3.value.toUpperCase()
               }),
             };
            await ajax({
               url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
               options,
               cbSuccess: (res) => {
              //   console.log(res);
               },
             });
             location.reload();
           }
         }
           }
        else if (e.target.matches(".update")) {
          //console.log(e.target);
  
        //UPDATE
         //console.log(e.target.textarea[0].value.toUpperCase());
         //console.log(e.target.textarea[1].value.toUpperCase());
  
         let keyUnit = d.getElementById("controlV").dataset.unit;
         let keyConv = d.getElementById("controlV").dataset.conveyance;
  
        // console.log(keyUnit);
  
         
         if (!e.target.id.value) {
         
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              comentarios: e.target.textarea.value.toUpperCase()
            }),
          };
  
            await ajax({
               url: `${api.SUBITEMS}/${keyUnit}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });
  
           options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
  
            await ajax({
               url: `${api.SUBITEMS1}/${keyConv}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });
  
             location.reload();
        }
        
  
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
  
    } else
  
 if (!hash || hash === "#/InhouseGTO") {
      localStorage.tabConveyance = false;
      localStorage.tabUnit = false;
      localStorage.tabViajes = true;
       
      await ajax({
        url: `${api.ITEMS}.json`,
        cbSuccess: (items) => {   
          newArray = items;
          //console.log(itemsArray)   
          renderTable(newArray);
        },
      });
  
      const updateData = setInterval(  () => {
        
        ajax({
          url: `${api.ITEMS}.json`,
          cbSuccess: (items) => {
            
              //console.log(Object.values(items));
                listenItemsArray = Object.values(items);
                let firstArray = Object.values(newArray);
                 // console.log(Object.entries(itemsArray).length);
  
                 if(listenItemsArray.length === firstArray.length){
  
                  
                    for (let i = 0; i < firstArray.length; i++) {
                      let e = firstArray[i];
                       let e2 = listenItemsArray[i];
                
                     if( e.fecha != e2.fecha || e.caja != e2.caja 
                      || e.unidad != e2.unidad || e.bol != e2.bol 
                      || e.af != e2.af || e.ag != e2.ag 
                      || e.cliente != e2.cliente || e.cporte != e2.cporte
                      || e.tracking != e2.tracking || e.llegada != e2.llegada
                      || e.status != e2.status || e.ventana != e2.ventana
                      || e.x1 != e2.x1 || e.x3 != e2.x3 || e.operador != e2.operador
                      ) {
                       // console.log("UPDATE")
                       renderTable(items);
                       }
       
                     }
                   } 
                   else {
                  //  console.log("UPDATE");
                  renderTable(items);
                    
                   }
  
  
               
               //console.log(listenItemsArray);
             }       
          })
  
      }, 5000);
          
      updateData;
  
      let sectionActive = () => {
        d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
         };
  
         if(localStorage.tabViajes){
          sectionActive();
        }
  
  
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
         await ajax({
            url: `${api.ITEMS}.json`,
            method: "GET",
            cbSuccess: (items) => {
              //console.log(items);
              let itemsArray = Object.entries(items);
            
              //console.log(itemsArray);
    
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
  
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
            d.getElementById("exportModalXls").innerHTML = `
  
            <section id="thtable" class="thtable">
           <table class="table table-hover table-sm" id="table_xls">
            <thead class="table-dark text-center align-middle">
            <tr style="background-color:black; color:white;">
            <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
            </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>  
          </tr>
        </thead>
     
        <tbody id="table_body" class="body_table">
        </tbody>
        
      </table>
    </section>
            `; 
            
            await ajax({
              url: `${api.SUBITEMS1}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
            d.getElementById("exportModalXls").innerHTML = `
  
          <section id="thtable" class="thtable">
         <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">KILOMETRAJE</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>  
        </tr>
      </thead>
   
      <tbody id="table_body" class="body_table">
      </tbody>
      
    </table>
  </section>
          `; 
           
            await ajax({
              url: `${api.SUBITEMS}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
        }
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
          location.reload();
        }
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
          console.log(e.target);
  
          let isConfirm = confirm("¿Eliminar Registro?");
  
          if (isConfirm) {
         await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
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
       
           const tabConv = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th id="cajas" scope="col">CAJA</th>
        <th class="tipo" scope="col">TIPO</th>
        <th class="modelo" scope="col">MODELO</th>
        <th class="placa" scope="col">PLACA</th>
        <th class="año" scope="col">AÑO</th>
        <th class="verificacion" scope="col">VERIFICACION</th>
        <th class="poliza" scope="col">NO. POLIZA</th>
        <th class="inciso" scope="col">INCISO</th>
        <th class="contacto" scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" disabled></td>
      <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}" disabled></td>
      <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}" disabled></td>
      <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}" disabled></td>
      <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" disabled></td>
      <td><input name="circuito" style="width: 130px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 90px; background-color: #69beff;"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text"  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        const tabUnit = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" disabled></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" disabled></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" disabled></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" disabled></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" disabled></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" disabled></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}" disabled></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}" disabled></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" disabled></td>
      <td><input name="circuito" style="width: 150px; background-color: #69beff;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 100px; background-color: #69beff;"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; background-color: #69beff;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; background-color: #69beff;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }
  
          //  console.log();
           if(localStorage.tabViajes === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
           await ajax({
              url: `${api.ITEMS}/${e.target.id}.json`,
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
                <th scope="col">COMENTARIOS</th>
          
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
            <option value="Critica" >Critica</option>
            </select>
            </td>
            <td>
            <input name="status" style="width: 95px;" type="text"  value="${item.status}">
            </td>
            <td>
            <input name="x3" style="width: 130px;" type="text"  value="${item.x3}">
            </td>    
            </tbody>
            
          </table>
          </div>
                `;
              },
            });
           }
           if(localStorage.tabConveyance === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
            await ajax({
              url: `${api.SUBITEMS1}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabConv(item);
              },
            });
           }
           if(localStorage.tabUnit === "true"){
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;
          
            await ajax({
              url: `${api.SUBITEMS}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabUnit(item);
              },
            });
  
           }
  
         }
        if (e.target.matches(".control") || e.target.matches(".fa-car")) {
          // console.log(e.target);
  
        
          await ajax({
            url: `${api.SUBITEMS}.json`,
            method: "GET",
            cbSuccess: (unit) => {
           
             // console.log(e.target);
             let unitArray = Object.entries(unit);
             
  
             unitArray.forEach(unit => {
              if(e.target.id === unit[1].unidad){
  
                d.getElementById("controlModal").style.height = "60vh";
              d.querySelector(".control-modal-body").innerHTML = `
            <div class="container-fluid"> 
            <table class="table table-sm" >
            <thead class="table-dark text-center">
              <tr class="text-wrap">
                <th scope="col">UNIDAD</th>
                <th scope="col">OPERADOR</th>
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
            <td>${unit[1].unidad}</td>
            <td>${unit[1].operador}</td>
            <td>${unit[1].modelo}</td>
            <td>${unit[1].placa}</td>
            <td>${unit[1].año}</td>
            <td>${unit[1].verificacion}</td>
            <td>${unit[1].poliza}</td>
            <td>${unit[1].inciso}</td>
            <td>${unit[1].contacto}</td>     
            </tr>   
            </tbody>      
          </table>
  
          <input name="textarea" rows="1" cols="500" class="mb-3 commit" style="width: 1000px; background: #69beff; font-weight: bold; color: black;" placeholder="Comentarios de Sobre la Unidad" value="${unit[1].comentarios.toUpperCase()}">
          </div>
            `;
  
           d.getElementById("controlV").dataset.unit = unit[0];
  
           
  
              } 
             });
  
            },
          });
  
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            method: "GET",
            cbSuccess: (conv) => {
            
             let convArray = Object.entries(conv);
             
             convArray.forEach(conv => {
            
              if(e.target.dataset.conveyance === conv[1].caja){
  
                d.getElementById("controlModal").style.height = "45vh";
                d.querySelector(".control-modal-body").insertAdjacentHTML("beforeend", `
                <div class="container-fluid"> 
        
                   <table class="table table-sm" >
                   <thead class="table-dark text-center">
                     <tr class="text-wrap">
                     <th scope="col">CAJA</th>
                     <th scope="col">TIPO</th>
                     <th scope="col">MODELO</th>
                     <th scope="col">PLACA</th>
                     <th scope="col">AÑO</th>
                     <th scope="col">VERIFICACION</th>
                     <th scope="col">NO. POLIZA</th>
                     <th scope="col">INCISO</th>
                     <th scope="col">CONTACTO DEL SEGURO</th>
                     <th scope="col">CIRCUITO</th>
                     <th scope="col">FECHA</th>
                     <th scope="col">UBICACION</th> 
                     <th scope="col">ESTATUS</th>
                     </tr>
                   </thead>
                   <tbody class="text-center text-wrap" >
            <td>${conv[1].caja}</td>
            <td>${conv[1].tipo}</td>
            <td>${conv[1].modelo}</td>
            <td>${conv[1].placa}</td>
            <td>${conv[1].año}</td>
            <td>${conv[1].verificacion}</td>
            <td>${conv[1].poliza}</td>
            <td>${conv[1].inciso}</td>
            <td>${conv[1].contacto}</td>
            <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].circuito}"></td>
            <td><input name="ruta" style="background: #69beff; font-weight: bold; color: black;" type="text"  value="${conv[1].fecha}"></td>
            <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"  type="text"  value="${conv[1].ubicacion}"></td>
            <td><input name="comentarios" style="${conv[1].comentarios.match("DAÑ") || conv[1].comentarios.match("FALLA") || conv[1].comentarios.match("CRITIC") ? "width: 300px; background-color: #862828; color: white; font-weight: bold;" : "width: 300px; background: #69beff; font-weight: bold; color: black;"}"  type="text""  value="${conv[1].comentarios}"></td>  
            </tbody>      
                  </div>` 
          
              );
  
              d.getElementById("controlV").dataset.conveyance = conv[0];
                
              }
            
            });
  
          
           
              
            }
  
          });
      
  
  
         }
         if (e.target.matches(".tablero")) {
          clearInterval(updateData);
          localStorage.tabConveyance = false;
          localStorage.tabViajes = true;
        localStorage.tabUnit = false;
  
  
          await ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
              //console.log(itemsArray)   
              renderTable(newArray);
            },
          });
  
          d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
        }
        if (e.target.matches(".cajas")) {
          clearInterval(updateData);
          localStorage.tabConveyance = true;
          localStorage.tabViajes = false;
        localStorage.tabUnit = false;
  
  
          await ajax({
            url: `${api.SUBITEMS1}.json`,
            cbSuccess: (items) => {   
              newArray = items;
            //  console.log(newArray)   
             renderTableCV(newArray);
            },
          });
  
          d.getElementById("cajas").style.color = "#ffffffe8";
          d.getElementById("cajas").style.backgroundColor = "#10438e";
          d.getElementById("cajas").style.borderColor = "#094fb5";
  
          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
  
          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
          
        }
        if (e.target.matches(".unidades")) {
          clearInterval(updateData);
          localStorage.tabConveyance = false;
          localStorage.tabViajes = false;
          localStorage.tabUnit = true;
  
  
          await ajax({
            url: `${api.SUBITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
        //      console.log(newArray);   
              renderTableUnits(newArray);
            },
          });
  
          d.getElementById("unidades").style.color = "#ffffffe8";
          d.getElementById("unidades").style.backgroundColor = "#10438e";
          d.getElementById("unidades").style.borderColor = "#094fb5";
  
          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";
  
          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
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
              <th scope="col">COMENTARIOS</th>
        
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
          <input name="x3" style="width: 130px;" type="text"  value="">
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
         clearInterval(updateData);
      // console.log(e.target);
       let change = d.getElementById("cajas").classList;
      // console.log(change);
        if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
              e.dataset.operador.includes(query) ||
              e.dataset.track.includes(query) ||
              e.dataset.ruta.includes(query) ||
              e.dataset.cliente.includes(query) ||
              e.dataset.fechaf.includes(query) ||
              e.dataset.status.includes(query)
          ) {
            e.classList.remove("filter");
          } else {
            e.classList.add("filter");
          }
                        });
        }
        else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
    //   console.log(e.target);
       let query = localStorage.getItem("apiSearch").toUpperCase();
  
    //  console.log(query);
  
       let item = d.querySelectorAll(".item");
           item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
         if (!query) {
           e.classList.remove("filter");
           return false;
         } 
         else if (e.dataset.conv.includes(query) ||
         e.dataset.circuito.includes(query) ||
         e.dataset.ubicacion.includes(query)
         ) {
           e.classList.remove("filter");
         } 
         else {
           e.classList.add("filter");
         }
                       });
        } 
        else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
    //  console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();
  
      //console.log(query);
  
      let item = d.querySelectorAll(".item");
          item.forEach((e) => {
      //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } 
        else if (e.dataset.unit.includes(query) ||
        e.dataset.circuito.includes(query) ||
        e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } 
        else {
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
                x3: e.target.x3.value.toUpperCase()
              }),
            };
          await ajax({
              url: `${api.ITEMS}.json`,
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
 
         if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
           if (!e.target.id.value) {
             let options = {
               method: "PATCH",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
            await ajax({
               url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
               options,
               cbSuccess: (res) => {
                // console.log(res);
               },
             });
             location.reload();
           }
         }    
         if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
           
           if (!e.target.id.value) {
             let options = {
               method: "PATCH",
               headers: {
                 "Content-type": "application/json; charset=utf-8",
               },
               body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
               }),
             };
            await ajax({
               url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
               options,
               cbSuccess: (res) => {
                // console.log(res);
               },
             });
             location.reload();
           }
     
     
         } 
         else if(localStorage.tabViajes === "true") {
           if (!e.target.id.value) {
             let options = {
               method: "PATCH",
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
                 x3: e.target.x3.value.toUpperCase()
               }),
             };
            await ajax({
               url: `${api.ITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
               options,
               cbSuccess: (res) => {
              //   console.log(res);
               },
             });
             location.reload();
           }
         }
           }
        else if (e.target.matches(".update")) {
          //console.log(e.target);
  
        //UPDATE
         //console.log(e.target.textarea[0].value.toUpperCase());
         //console.log(e.target.textarea[1].value.toUpperCase());
  
         let keyUnit = d.getElementById("controlV").dataset.unit;
         let keyConv = d.getElementById("controlV").dataset.conveyance;
  
        // console.log(keyUnit);
  
         
         if (!e.target.id.value) {
         
          let options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              comentarios: e.target.textarea.value.toUpperCase()
            }),
          };
  
            await ajax({
               url: `${api.SUBITEMS}/${keyUnit}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });
  
           options = {
            method: "PATCH",
            headers: {
              "Content-type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                circuito: e.target.circuito.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
            }),
          };
  
            await ajax({
               url: `${api.SUBITEMS1}/${keyConv}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
             },
          });
  
             location.reload();
        }
        
  
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
  
    } else

 if (!hash || hash === "#/CVehicular") {
  localStorage.tabConveyance = true;
  localStorage.tabUnit = false;
  localStorage.tabViajes = false;
     
      await ajax({
        url: `${api.SUBITEMS1}.json`,
        cbSuccess: (items) => {   
          newArray = items;
        //  console.log(newArray)   
         renderTableCV(newArray);
        },
      });

    let sectionActive = () => {
  d.getElementById("cajas").style.color = "#ffffffe8";
  d.getElementById("cajas").style.backgroundColor = "#10438e";
  d.getElementById("cajas").style.borderColor = "#094fb5";

  d.getElementById("tablero").style.color = "";
  d.getElementById("tablero").style.backgroundColor = "";
  d.getElementById("tablero").style.borderColor = "";

  d.getElementById("unidades").style.color = "";
  d.getElementById("unidades").style.backgroundColor = "";
  d.getElementById("unidades").style.borderColor = "";

   };
      
      if(localStorage.tabConveyance){
        sectionActive();
      }

  
      d.addEventListener("click", async (e) => {      
        //console.log(e.target);
        //LEER CSV / XLS
        /*if (e.target.matches(".import_csv")){
         //console.log(e.target);    
        }*/
        //GENERAR REPORTE XLS
        let date = new Date;
        if (e.target.matches(".modal_xls")){
          
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "false"){
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
            await ajax({
             url: `${api.ITEMS}.json`,
             method: "GET",
             cbSuccess: (items) => {
               //console.log(items);
   
               let itemsArray = Object.entries(items);
            
              //console.log(itemsArray);
    
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

          if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
            d.getElementById("exportModalXls").innerHTML = `

            <section id="thtable" class="thtable">
           <table class="table table-hover table-sm" id="table_xls">
            <thead class="table-dark text-center align-middle">
            <tr style="background-color:black; color:white;">
            <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
            </tr>
          <tr style="background-color:black; color:white;">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">CONTACTO DEL SEGURO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>  
          </tr>
        </thead>
     
        <tbody id="table_body" class="body_table">
        </tbody>
        
      </table>
    </section>
            `; 
            
            await ajax({
              url: `${api.SUBITEMS1}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvConv(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
          if(localStorage.tabConveyance === "false" && localStorage.tabUnit === "true"){
            d.getElementById("exportModalXls").innerHTML = `

          <section id="thtable" class="thtable">
         <table class="table table-hover table-sm" id="table_xls">
          <thead class="table-dark text-center align-middle">
          <tr style="background-color:black; color:white;">
          <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
          </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">OPERADOR</th>
        <th scope="col">MODELO</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
         <th scope="col">VERIFICACION</th>
         <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">CONTACTO DEL SEGURO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>  
        </tr>
      </thead>
   
      <tbody id="table_body" class="body_table">
      </tbody>
      
    </table>
  </section>
          `; 
           
            await ajax({
              url: `${api.SUBITEMS}.json`,
              method: "GET",
              cbSuccess: (items) => {
                //console.log(items);
   
                let itemsArray = Object.entries(items);
             
               //console.log(itemsArray);
     
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
   
    
                orderItems.forEach((item) => {
                  d.getElementById("table_body").insertAdjacentHTML("beforeend", ItemXlsInvUnit(item));          
                });
    
                 //Helper de acceso a los items
                   const $tr = d.querySelectorAll(".item2");
                    const newOrder = Array.from($tr);
  
                // console.log($tr);
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
          
          
        }
        if (e.target.matches(".cancelXls") || e.target.matches(".report")){
          location.reload();
        }
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
         console.log(e.target);
  
          let isConfirm = confirm("¿Eliminar Registro?");
  
          if(localStorage.tabConveyance === "true") {
            if (isConfirm) {
              await ajax({
                 url: `${api.SUBITEMS1}/${e.target.id}.json`,
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
               location.reload();
             }
          } else if (localStorage.tabUnit === "true") {
            if (isConfirm) {
              await ajax({
                 url: `${api.SUBITEMS}/${e.target.id}.json`,
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
               location.reload();
             }
          } else {
            return;
          }

          


        }
        if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
         // console.log(e.target);

         const tabConv = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th id="cajas" scope="col">CAJA</th>
        <th class="tipo" scope="col">TIPO</th>
        <th class="modelo" scope="col">MODELO</th>
        <th class="placa" scope="col">PLACA</th>
        <th class="año" scope="col">AÑO</th>
        <th class="verificacion" scope="col">VERIFICACION</th>
        <th class="poliza" scope="col">NO. POLIZA</th>
        <th class="inciso" scope="col">INCISO</th>
        <th class="contacto" scope="col">MARCHAMO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>
    
        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}"></td>
      <td class="tipo"><input name="tipo" style="width: 60px;" type="text"   value="${item.tipo}"></td>
      <td class="modelo"><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}"></td>
      <td class="placa"><input name="placa" style="width: 70px;" type="text"  value="${item.placa}"></td>
      <td class="año"><input name="año" style="width: 45px;" type="text"  value="${item.año}"></td>
      <td class="verificacion"><input name="verificacion" style="width: 100px;" type="text"  value="${item.verificacion}"></td>
      <td class="poliza"><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}"></td>
      <td class="inciso"><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}"></td>
      <td class="contacto"><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}"></td>
      <td><input name="circuito" style="width: 130px;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 90px; type="text" value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px; type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px; type="text"  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

        const tabUnit = (item) => {

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
        <tr class="text-wrap">
        <th scope="col">UNIDAD</th>
    <th scope="col">OPERADOR</th>
    <th scope="col">MODELO</th>
    <th scope="col">PLACA</th>
    <th scope="col">AÑO</th>
     <th scope="col">VERIFICACION</th>
     <th scope="col">NO. POLIZA</th>
    <th scope="col">INCISO</th>
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}"></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}"></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}"></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}"></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}"></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}"></td>
      <td><input name="poliza" style="width: 150px;" type="text"  value="${item.poliza}"></td>
      <td><input name="inciso" style="width: 45px;" type="text"  value="${item.inciso}"></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}"></td>
      <td><input name="circuito" style="width: 150px;" type="text"  value="${item.circuito}"></td>
      <td><input name="fecha" style="width: 100px;"  type="text"  value="${item.fecha}"></td>
      <td><input name="ubicacion" style="width: 150px;" type="text"  value="${item.ubicacion}"></td>
      <td><input name="comentarios" style="width: 250px;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
        }

          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
  
         
          if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false"){
            await ajax({
              url: `${api.SUBITEMS1}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabConv(item);
              },
            });
          } if(localStorage.tabUnit === "true" && localStorage.tabConveyance === "false"){
            
            await ajax({
              url: `${api.SUBITEMS}/${e.target.id}.json`,
              method: "GET",
              cbSuccess: (item) => {
                // console.log(item);
                tabUnit(item);
              },
            });
          } else {
            //console.log(localStorage.tabConveyance,localStorage.tabUnit);
          }
      
  
        }  
        if (e.target.matches(".remolque")) {
          //  console.log(e.target);

          const tabConv = ()=> {
            //MODAL
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("formulario").classList.add("register");
          d.getElementById("formulario").classList.remove("edit");
          d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
          d.getElementById("exampleModalLabel").classList.add("convoy");
          d.getElementById("exampleModalLabel").classList.remove("convoy");
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">CAJA</th>
          <th scope="col">TIPO</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">MARCHAMO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap">
        <td><input name="caja" style="width: 35px;" type="text"></td>
        <td><input name="tipo" style="width: 60px;" type="text"></td>
        <td><input name="modelo" style="width: 130px;" type="text"></td>
        <td><input name="placa" style="width: 70px;" type="text"></td>
        <td><input name="año" style="width: 80px;" type="text"></td>
        <td><input name="verificacion" style="width: 75px;" type="text"></td>
        <td><input name="poliza" style="width: 75px;" type="text"></td>
        <td><input name="inciso" style="width: 95px;" type="text"></td>
        <td><input name="contacto" type="text" style="width: 80px;"></input></td>
        <td><input name="circuito" type="text"></td>
        <td><input name="fecha" type="date"></td>
        <td><input name="ubicacion" type="text"></td>
        <td><input name="comentarios" type="text"></td>  
        </tbody>
          
        </table>
        </div>
              `;
          };      

          tabConv();
          
        }
        if (e.target.matches(".unidad")) {
          const tabUnit = ()=> {
            //MODAL
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("formulario").classList.add("register");
          d.getElementById("formulario").classList.remove("edit");
          d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
          d.getElementById("exampleModalLabel").classList.add("unit");
          d.getElementById("exampleModalLabel").classList.remove("convoy");
          d.querySelector(".modal-body").innerHTML = `
              <div class="container-fluid"> 
              <table class="table table-sm" >
          <thead class="table-dark text-center">
          <tr class="text-wrap">
          <th scope="col">UNIDAD</th>
          <th scope="col">OPERADOR</th>
          <th scope="col">MODELO</th>
          <th scope="col">PLACA</th>
          <th scope="col">AÑO</th>
           <th scope="col">VERIFICACION</th>
           <th scope="col">NO. POLIZA</th>
          <th scope="col">INCISO</th>
          <th scope="col">CONTACTO DEL SEGURO</th>
          <th scope="col">CIRCUITO</th>
          <th scope="col">FECHA</th>
          <th scope="col">UBICACION</th> 
          <th scope="col">ESTATUS</th>
      
          </tr>
        </thead>
        <tbody class="text-center text-wrap">
        <td><input name="unidad" style="width: 35px;" type="text"></td>
        <td><input name="operador" style="width: 60px;" type="text"></td>
        <td><input name="modelo" style="width: 130px;" type="text"></td>
        <td><input name="placa" style="width: 70px;" type="text"></td>
        <td><input name="año" style="width: 80px;" type="text"></td>
        <td><input name="verificacion" style="width: 75px;" type="text"></td>
        <td><input name="poliza" style="width: 75px;" type="text"></td>
        <td><input name="inciso" style="width: 95px;" type="text"></td>
        <td><input name="contacto" type="text" style="width: 80px;"></td>
        <td><input name="circuito" type="text"></td>
        <td><input name="fecha" type="date"></td>
        <td><input name="ubicacion" type="text"></td>
        <td><input name="comentarios" type="text"></td>  
        </tbody>
          
        </table>
        </div>
              `;
          };

          tabUnit();
        }   
        if (e.target.matches(".tablero")) {
          localStorage.tabViajes = true;
          localStorage.tabConveyance = false;
        localStorage.tabUnit = false;

          await ajax({
            url: `${api.ITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
              //console.log(itemsArray)   
              renderTablePublic(newArray);
            },
          });

          d.getElementById("tablero").style.color = "#ffffffe8";
          d.getElementById("tablero").style.backgroundColor = "#10438e";
          d.getElementById("tablero").style.borderColor = "#094fb5";

          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";

          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
        }
        if (e.target.matches(".cajas")) {
          localStorage.tabViajes = false;
          localStorage.tabConveyance = true;
        localStorage.tabUnit = false;


          await ajax({
            url: `${api.SUBITEMS1}.json`,
            cbSuccess: (items) => {   
              newArray = items;
            //  console.log(newArray)   
             renderTableCV(newArray);
            },
          });

          d.getElementById("cajas").style.color = "#ffffffe8";
          d.getElementById("cajas").style.backgroundColor = "#10438e";
          d.getElementById("cajas").style.borderColor = "#094fb5";

          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";

          d.getElementById("unidades").style.color = "";
          d.getElementById("unidades").style.backgroundColor = "";
          d.getElementById("unidades").style.borderColor = "";
          
        }
        if (e.target.matches(".unidades")) {
          localStorage.tabViajes = false;
          localStorage.tabConveyance = false;
          localStorage.tabUnit = true;
  

          await ajax({
            url: `${api.SUBITEMS}.json`,
            cbSuccess: (items) => {   
              newArray = items;
        //      console.log(newArray);   
              renderTableUnits(newArray);
            },
          });

          d.getElementById("unidades").style.color = "#ffffffe8";
          d.getElementById("unidades").style.backgroundColor = "#10438e";
          d.getElementById("unidades").style.borderColor = "#094fb5";

          d.getElementById("cajas").style.color = "";
          d.getElementById("cajas").style.backgroundColor = "";
          d.getElementById("cajas").style.borderColor = "";

          d.getElementById("tablero").style.color = "";
          d.getElementById("tablero").style.backgroundColor = "";
          d.getElementById("tablero").style.borderColor = "";
        }
        if(e.target.matches(".generar_xls")){
          //let $dataTable = d.getElementById("table_xls");
              generar_xls('table_xls', 'Reporte');
              location.reload();
        }
        return;
      });

      d.addEventListener("submit", async (e) => {
        e.preventDefault();
     // console.log(e.target);
          if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
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
            e.dataset.operador.includes(query) ||
            e.dataset.track.includes(query) ||
            e.dataset.ruta.includes(query) ||
            e.dataset.cliente.includes(query) ||
            e.dataset.fechaf.includes(query) ||
            e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
                      });
    }

    else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
  //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

  //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
     //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
   } 

   else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
    console.log(e.target);
    let query = localStorage.getItem("apiSearch").toUpperCase();

    //console.log(query);

    let item = d.querySelectorAll(".item");
        item.forEach((e) => {
    //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
      if (!query) {
        e.classList.remove("filter");
        return false;
      } 
      else if (e.dataset.unit.includes(query) ||
      e.dataset.circuito.includes(query) ||
      e.dataset.ubicacion.includes(query)
      ) {
        e.classList.remove("filter");
      } 
      else {
        e.classList.add("filter");
      }
                    });
  }
        
        else if (e.target.matches(".register")) {

          let regModal = d.getElementById("exampleModalLabel");
          //Create Register
          console.log(regModal);
          if(regModal.textContent.includes("Remolque")){
            if (!e.target.id.value) {
              let options = {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  caja: e.target.caja.value.toUpperCase(),
                  tipo: e.target.tipo.value.toUpperCase(),
                  modelo: e.target.modelo.value.toUpperCase(),
                  placa: e.target.placa.value.toUpperCase(),
                  año: e.target.año.value.toUpperCase(),
                  verificacion: e.target.verificacion.value.toUpperCase(),
                  poliza: e.target.poliza.value.toUpperCase(),
                  inciso: e.target.inciso.value.toUpperCase(),
                  contacto: e.target.contacto.value.toUpperCase(),
                  circuito: e.target.circuito.value.toUpperCase(),
                  fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                  ubicacion: e.target.ubicacion.value.toUpperCase(),
                  comentarios: e.target.comentarios.value.toUpperCase()
                  
                }),
              };
            await ajax({
                url: `${api.SUBITEMS1}.json`,
                options,
                cbSuccess: (res) => {
                 // json = res.json();
                },
              });
              location.reload();
            }
          } if(regModal.textContent.includes("Unidad")){
            if (!e.target.id.value) {
              let options = {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                  unidad: e.target.unidad.value.toUpperCase(),
                  operador: e.target.operador.value.toUpperCase(),
                  modelo: e.target.modelo.value.toUpperCase(),
                  placa: e.target.placa.value.toUpperCase(),
                  año: e.target.año.value.toUpperCase(),
                  verificacion: e.target.verificacion.value.toUpperCase(),
                  poliza: e.target.poliza.value.toUpperCase(),
                  inciso: e.target.inciso.value.toUpperCase(),
                  contacto: e.target.contacto.value.toUpperCase(),
                  circuito: e.target.circuito.value.toUpperCase(),
                  fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                  ubicacion: e.target.ubicacion.value.toUpperCase(),
                  comentarios: e.target.comentarios.value.toUpperCase()
                  
                }),
              };
            await ajax({
                url: `${api.SUBITEMS}.json`,
                options,
                cbSuccess: (res) => {
                 // json = res.json();
                },
              });
              location.reload();
            }
          }
          
          // console.log(e.target);
        } 
        
        else if (e.target.matches(".edit")) {
          //UPDATE
        //  console.log(e.target.comentarios);
        
        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                caja: e.target.caja.value.toUpperCase(),
                tipo: e.target.tipo.value.toUpperCase(),
                modelo: e.target.modelo.value.toUpperCase(),
                placa: e.target.placa.value.toUpperCase(),
                año: e.target.año.value.toUpperCase(),
                verificacion: e.target.verificacion.value.toUpperCase(),
                poliza: e.target.poliza.value.toUpperCase(),
                inciso: e.target.inciso.value.toUpperCase(),
                contacto: e.target.contacto.value.toUpperCase(),
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS1}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
        }
        if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
          if (!e.target.id.value) {
            let options = {
              method: "PATCH",
              headers: {
                "Content-type": "application/json; charset=utf-8",
              },
              body: JSON.stringify({
                unidad: e.target.unidad.value.toUpperCase(),
                operador: e.target.operador.value.toUpperCase(),
                modelo: e.target.modelo.value.toUpperCase(),
                placa: e.target.placa.value.toUpperCase(),
                año: e.target.año.value.toUpperCase(),
                verificacion: e.target.verificacion.value.toUpperCase(),
                poliza: e.target.poliza.value.toUpperCase(),
                inciso: e.target.inciso.value.toUpperCase(),
                contacto: e.target.contacto.value.toUpperCase(),
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,"$3/$2/$1"),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase()
              }),
            };
           await ajax({
              url: `${api.SUBITEMS}/${d.getElementById("bt-save").dataset.value}.json`,
              options,
              cbSuccess: (res) => {
               // console.log(res);
              },
            });
            location.reload();
          }
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

      else {
        return 
      }

 
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










    /*
    
    if(hash === "#/Inhouse" && change[3] === "change"){
             //console.log(e.target.id);
            d.querySelector(".hidden").style.display = "block";
            d.getElementById("bt-save").dataset.value = `${e.target.id}`;

                 await ajax({
           url: `${api.ITEMS}/${e.target.id}.json`,
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
  <option value="Critica" >Critica</option>
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
             } else {
            
            //  console.log(e.target.id);
          d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
  
         await ajax({
            url: `${api.SUBITEMS1}/${e.target.id}.json`,
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
            <th scope="col">CAJA</th>
            <th scope="col">TIPO</th>
            <th scope="col">MODELO</th>
            <th scope="col">PLACA</th>
            <th scope="col">AÑO</th>
             <th scope="col">VERIFICACION</th>
             <th scope="col">NO. POLIZA</th>
            <th scope="col">INCISO</th>
            <th scope="col">CONTACTO DEL SEGURO</th>
            <th scope="col">CIRCUITO</th>
            <th scope="col">FECHA</th>
            <th scope="col">UBICACION</th> 
            <th scope="col">ESTATUS</th>
        
            </tr>
          </thead>
          <tbody class="text-center text-wrap" >
          <td>${item.caja}</td>
          <td>${item.tipo}</td>
          <td>${item.modelo}</td>
          <td>${item.placa}</td>
          <td>${item.año}</td>
          <td>${item.verificacion}</td>
          <td>${item.poliza}</td>
          <td>${item.inciso}</td>
          <td>${item.contacto}</td>
          <td><input name="circuito" style="background: #69beff; font-weight: bold; color: black;"   type="text"  value="${item.circuito}"></td>
          <td><input name="fecha" style="background: #69beff; font-weight: bold; color: black;"   type="text"  value="${item.fecha}"></td>
          <td><input name="ubicacion" style="background: #69beff; font-weight: bold; color: black;"   type="text"  value="${item.ubicacion}"></td>
          <td><input name="comentarios" style="background: #69beff; font-weight: bold; color: black;"   type="text""  value="${item.comentarios}"></td>  
          </tbody>
          
        </table>
        </div>
              `;
            },
          });

           }


            <select class="form-select form-select-sm" name="estatus" id="estatus">
          <option value="${item.status}">${item.status}</option> 
          <option value="En transito">En transito a proveedor</option>
          <option value="En transito">En transito a fordc</option>
          <option value="En transito">En transito a fordh</option>
          <option value="En transito">En transito a fca</option>
          <option value="En transito">En transito a fca</option>
          <option value="Detenido">Detenido</option>
          <option value="Cargando">Cargando</option>
          <option value="Espera de Carga">Espera de carga</option>
          <option value="Descargando">Descargando</option>
          <option value="Descargando">Espera de descarga</option>
          <option value="Descargando"></option>
           
              */
