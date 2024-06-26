export function Item(item, keyUpdate) {
    let itemId, user = localStorage.username;

if(!keyUpdate){
   itemId = item[0];
   item = item[1];
} else {
   itemId = keyUpdate;
}



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
   if( item.status.match("DET") || item.status.match("ESP")){
      return "background-color: #791d1d; color: white;" ;
   }
  
  }

  const alertStatus = (item) => {


   if( item.status.match("TRANSITO") || item.status.match("ESPERA") || item.status.match("DETENIDO") || item.status.match("CARGANDO") || item.status.match("DESCARGANDO")){
      return "1" ;
   } else
   if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")){
      return "2" ;
   } else
   if (item.status.match("COMPLET")) {
      return "4" ;
   }
   if(item.status.match("CANCEL") || item.status.match("DRY") || item.status.match("TONU") || item.status.match("BROKE")){
      return "5";
   }
   else {
      return "";
   }
  }

  const filterUser = (item) => {
   if(user === "InhouseMX"){
      if(!item.cliente.match("FORD CUAUTITLAN")){
         return "display: none;"
      }
   }
   if(user === "InhouseHMO" || user === "TrafficH"){
      if(!item.cliente.match("FORD HERMOSILLO")){
         return "display: none;"
      } 
   }
   if(user === "InhouseTOL"){
      if(!item.cliente.match("STELLANTIS")){
         return "display: none;"
      }
   }
   if(item.status.includes("COMPLET")){         return 
   } else {
      return 
   }
   }

   
   if(item.ruta.match("CU") || item.ruta.match("HS") || item.ruta.match("RT")) { 
      return ``;
   }

//ALERTA DE WARNING (RUTAS PENDIENTES)
   if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")) {
      
      //console.log(item);
      return `
      <tr id="${itemId}" class="item ${travelStatus(item)} pending text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-cporte="${item.cporte}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-proveedor="${item.proveedor}" data-status="${item.status}" data-citaprogramada="${item.citaprogramada}" style="${filterUser(item)}">
          <td class="${item.unidad  ? "table-active1" : ""}" >${item.unidad}</td>
          <td class="${item.caja  ? "table-active1" : ""}">${item.caja}</td>
          <td class="${item.operador ? "table-active1" : ""}">${item.operador}</td>
          <td class="${item.cporte ? "table-active1" : ""}">${item.cporte}</td>
          <td>${item.tracking}</td>
          <td>${item.bol}</td>
          <td>${item.ruta}</td>
          <td class="table-active">${item.cliente}</td>
          <td class="table-active" >${item.proveedor}</td>
          <td class="">${item.citaprogramada}</td>
          <td class="">${item.llegadareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadareal}</td>
          <td class="">${item.salidareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidareal}</td>
          <td class="">${item.eta.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.eta}</td>
          <td class="">${item.llegadadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadadestino}</td>
          <td class="">${item.salidadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidadestino}</td>
          <td >${item.llegada}</td>
          <td >${item.status}</td>
          <td>${item.comentarios}</td>
          <td class="btn-hid" style="${user === "Public" || user === "CVehicular" || user === "Mtto"  ? "display: none;" : ""}">
          <button id="${item.unidad}" data-conveyance="${item.caja}" style="${item.unidad || item.caja ? "display: inline;" : "display: none;"}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>             
          </td>
       </tr>
         `;
   } else

   //CORRIENDO
   if(item.status.match("TRANSITO") || item.status.match("PROVEEDOR") || item.status.match("PLANTA") || item.status.match("DETENIDO") || item.status.match("CARGA") || item.status.match("ESPERA") || item.status.match("DESCARGANDO")) {

return `
<tr id="${itemId}" class="item active-run text-center align-middle" data-bs-toggle="" data-bs-target="#exampleModal" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-cporte="${item.cporte}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-proveedor="${item.proveedor}" data-status="${item.status}" data-citaprogramada="${item.citaprogramada}" style="${filterUser(item)}">
    <td class="Unit">${item.unidad}</td>
    <td>${item.caja}</td>
    <td>${item.operador}</td>
    <td style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
    <td style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
    <td style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
    <td>${item.ruta}</td>
    <td class="table-active">${item.cliente}</td>
    <td class="table-active" >${item.proveedor}</td>
    <td class="">${item.citaprogramada}</td>
    <td class="">${item.llegadareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadareal}</td>
    <td class="">${item.salidareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidareal}</td>
    <td class="">${item.eta.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.eta}</td>
    <td class="">${item.llegadadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadadestino}</td>
    <td class="">${item.salidadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidadestino}</td>
    <td style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
    <td style="${alertColor(item)}" >${item.status}</td>
    <td>${item.comentarios}</td>
    <td class="btn-hid" <td class="btn-hid" style="width: 7rem;${user === "Public" || user === "CVehicular" || user === "Mtto"  ? "display: none;" : ""}">
    <button id="${item.unidad}" data-conveyance="${item.caja}" style="${item.unidad || item.caja ? "display: inline;" : "display: none;"}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>  
    <button id="${itemId}" type="button" class="btn btn-sm btn-warning alert3" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-bell" id="${itemId}"></i></button>
    </td>
 </tr>
          `;
   } else {
      
   return ``;
   }




}



//BOTON CONTROL VEHICULAR <button id="${item.unidad}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button> <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>

/*
 <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" id="inlineCheckbox1" ${item.x3 ? "checked disabled" : "disabled"}>
      <label class="form-check-label" for="inlineCheckbox1">X3</label>
     </div>
     <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" id="inlineCheckbox2" ${item.af ? "checked disabled" : "disabled"}>
      <label class="form-check-label" for="inlineCheckbox2">AF</label>
     </div>
     <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" id="inlineCheckbox3" ${item.ag ? "checked disabled" : "disabled"}>
      <label class="form-check-label" for="inlineCheckbox3">AG</label>
     </div>
     <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" id="inlineCheckbox4" ${item.x1 ? "checked disabled" : "disabled"}>
      <label class="form-check-label" for="inlineCheckbox4">X1</label>
     </div>
     */