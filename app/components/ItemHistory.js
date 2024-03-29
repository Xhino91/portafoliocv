export function ItemHistory(item, keyUpdate) {
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
   if( item.status.match("COMPLETO")){
      return "background-color: #93e188";
   }
  
  }

  const alertStatus = (item) => {


 
   if (item.status.match("COMPLET")) {
      return "0" ;
   }
   if(item.status.match("CANCEL") || item.status.match("DRY") || item.status.match("TONU") || item.status.match("BROKE")){
      return "1";
   }
   else {
      return "";
   }
  }

  const filterUser = (item) => {
   return
   }

  
   
     
  
//ALERTA DE COMPLETE (RUTA COMPLETA)
   if(item.status.match("COMPLET")) {
   return `
   <tr id="${itemId}" class="item text-center align-middle ${travelStatus(item)}" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-cporte="${item.cporte}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-proveedor="${item.proveedor}" data-status="${item.status}" data-citaprogramada="${item.citaprogramada}" data-hour="${item.ventana}" style="${filterUser(item)}">
       <td class="Unit">${item.unidad}</td>
       <td >${item.caja}</td>
       <td>${item.operador}</td>
       <td style="${item.cporte === "" || item.status.match("PORTE") ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
       <td style="${item.tracking === "" || item.status.match("TRACK") ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
       <td style="${item.bol === "" || item.status.match("BOL") || item.status.match("SHIPPER")  ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
       <td>${item.ruta}</td>
       <td class="table-active">${item.cliente}</td>
       <td class="table-active" >${item.proveedor}</td>
       <td class="">${item.citaprogramada}</td>
       <td class="">${item.llegadareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadareal}</td>
       <td class="">${item.salidareal.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidareal}</td>
       <td class="">${item.eta.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.eta}</td>
       <td class="">${item.llegadadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.llegadadestino}</td>
       <td class="">${item.salidadestino.match("01/01/0001 00:00") ? "--/--/-- --:--" : item.salidadestino}</td>
       <td style="${item.llegada === "TARDE" || item.llegada.match("DESFASADA") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124)" : ""}">${item.llegada}</td>
       <td style="${alertColor(item)}">${item.status}</td>
       <td>${item.comentarios}</td>
       <td class="btn-hid" style="${user === "Public" || user === "CVehicular" || user === "Mtto"  ? "display: none;" : ""}">
          <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${user === "Traffic" || user === "TrafficH" ? "display: none;" : ""}"><i class="fa-solid fa-trash" id="${itemId}"></i></button>
       </td>
    </tr>
      `;
   } else

   if(item.status.match("CANCEL") || item.status.match("DRY") || item.status.match("TONU") || item.status.match("BROKE")) {
      return `
      <tr id="${itemId}" class="item active-error text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-cporte="${item.cporte}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-proveedor="${item.proveedor}" data-status="${item.status}" data-citaprogramada="${item.citaprogramada}"  style="${filterUser(item)}">
          <td class="Unit">${item.unidad}</td>
          <td>${item.caja}</td>
          <td>${item.operador}</td>
          <td >${item.cporte}</td>
          <td >${item.tracking}</td>
          <td >${item.bol}</td>
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
          <td class="btn-hid" style="${user === "Public" || user === "CVehicular" || user === "Mtto"  ? "display: none;" : ""}">
              <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${user === "Traffic" || user === "TrafficH" ? "display: none;" : ""}"><i class="fa-solid fa-trash" id="${itemId}"></i></button>
          </td>
       </tr>
                `;
      
   }else {
      
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