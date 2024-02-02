export function itemPublic(item) {
     //console.log(Object.values(item));

     let itemId = item[0];
     item = item[1];

     //console.log(item);
     const travelStatus = (item) => {
      if(item.status.match("COMPLET")) {
         return "active-complete";
      } 
      if(item.status.match("CANCEL")) {
         return "active-error";
      }
      if(item.status.match("")) {
         return "active-pending";
      }
      }
   
   const alertColor = (item) => {
   
      if( item.status.match("TRANSITO")){
         return "background-color: #72aefd;" ;
      }
      if( item.status.match("PROVEEDOR")  || item.status.match("PLANT") || item.status.match("CARGANDO")){
         return "background-color: #00508d; color: white;" ;
      }
      if( item.status.match("DET") || item.status.match("ESP") ){
         return "background-color: #791d1d; color: white;" ;
      }
     
     }
   
     const alertStatus = (item) => {


      if( item.status.match("PROVEEDOR") || item.status.match("TRANSITO") || item.status.match("PLANTA") || item.status.match("ESPERA") || item.status.match("CARGANDO")){
         return "1" ;
      } else
      if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")){
         return "2" ;
      } else
      if (item.status.match("COMPLET")) {
         return "4" ;
      }
      if(item.status.match("CANCEL") || item.status.match("DRY") || item.status.match("TONU")){
         return "5";
      }
      else {
         return "";
      }
     }
   
     const filterUser = (item) => {
      if(localStorage.username === "InhouseHMO"){
         if(item.cliente.includes("FORDH")){         return ""
         } else {
            return "display: none"
         }
      }
      if(localStorage.username === "InhouseMX"){
         if(item.cliente.includes("FORDC")){         return ""
         } else {
            return "display: none"
         }
      }
      if(localStorage.username === "InhouseTOL"){
         if(item.cliente.includes("FCA") || item.cliente.includes("BRP")){         return ""
         } else {
            return "display: none"
         }
      }
      if(localStorage.username === "InhouseGTO"){
         if(item.cliente.includes("MULTILOG")){         return ""
         } else {
            return "display: none"
         }
      }
      else {
         return ""
      }
      }
    

      if(item.ruta.match("CU") || item.ruta.match("HS") || item.ruta.match("RT")) { 
         return ``;
      } else
    
//ALERTA DE WARNING (RUTAS PENDIENTES)
   if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")) {
      
      //console.log(item);
      return `
      <tr id="${itemId}" class="item ${travelStatus(item)} pending text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-proveedor="${item.proveedor}" data-status="${item.status}" data-citaprogramada="${item.citaprogramada}" style="${filterUser(item)}">
          <td class="${item.unidad ? "table-active" : ""}" >${item.unidad}</td>
          <td class="${item.caja ? "table-active" : ""}">${item.caja}</td>
          <td >${item.operador}</td>
          <td class="cporte">${item.cporte}</td>
          <td class="track ${item.tracking ? "table-active" : ""}" >${item.tracking}</td>
          <td class="bol ${item.bol ? "table-active" : ""}" >${item.bol}</td>
          <td class="ruta">${item.ruta}</td>
          <td class="table-active">${item.cliente}</td>
          <td class="table-active" >${item.proveedor}</td>
          <td  class="cp">${item.citaprogramada}</td>
          <td  class="lr">${item.llegadareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadareal}</td>
          <td  class="sr">${item.salidareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidareal}</td>
          <td class="eta">${item.eta.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.eta}</td>
          <td  class="ld">${item.llegadadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadadestino}</td>
          <td  class="sd">${item.salidadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidadestino}</td>
          <td  class="llegada">${item.llegada}</td>
          <td >${item.status}</td>
          <td>${item.comentarios}</td>
       </tr>
         `;
   } else
   
   //CORRIENDO
   if(item.status.match("TRANSITO") || item.status.match("PROVEEDOR") || item.status.match("PLANTA") || item.status.match("DETENIDO") || item.status.match("CARGA")) {

return `
<tr id="${itemId}" class="item active-run text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-proveedor="${item.proveedor}" data-status="${item.status}" data-citaprogramada="${item.citaprogramada}" style="${filterUser(item)}">
    <td class="Unit">${item.unidad}</td>
    <td>${item.caja}</td>
    <td>${item.operador}</td>
    <td style="cporte ${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
    <td style="track ${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
    <td style="bol ${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
    <td class="ruta">${item.ruta}</td>
    <td class="table-active">${item.cliente}</td>
    <td class="table-active" >${item.proveedor}</td>
    <td  class="cp">${item.citaprogramada}</td>
    <td  class="lr">${item.llegadareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadareal}</td>
    <td  class="sr">${item.salidareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidareal}</td>
    <td class="eta">${item.eta.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.eta}</td>
    <td  class="ld">${item.llegadadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadadestino}</td>
    <td  class="sd">${item.salidadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidadestino}</td>
    <td class="llegada" style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
    <td style="${alertColor(item)}" >${item.status}</td>
    <td>${item.comentarios}</td>
 </tr>
          `;
   } else

   {      
   return ``;
   }

    }
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>