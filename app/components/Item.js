export function Item(item) {
//console.log(item);

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
   if( item.status.match("DET") || item.status.match("ESP")){
      return "background-color: #791d1d; color: white;" ;
   }
  
  }

  const alertStatus = (item) => {


   if( item.status.match("PROVEEDOR") || item.status.match("TRANSITO") || item.status.match("PLANTA") || item.status.match("ESPERA")){
      return "1" ;
   } else
   if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")){
      return "2" ;
   } else
   if (item.status.match("COMPLET")) {
      return "4" ;
   }
   if(item.status.match("CANCEL")){
      return "5";
   }
   else {
      return "";
   }
  }

  const filterUser = (item) => {
   if(localStorage.username === "InhouseHMO" || localStorage.username === "TrafficH"){
      if(item.cliente.includes("FORDH")){
         if(item.status.includes("COMPLET")){         return "display: none"
      } else {
         return 
      }
      } else {
         return "display: none"
      }
   } else
   if(localStorage.username === "InhouseMX"){
      if(item.cliente.includes("FORDC")){
         if(item.status.includes("COMPLET")){         return "display: none"
      } else {
         return 
      }
      } else {
         return "display: none"
      }
   } else
   if(localStorage.username === "InhouseTOL"){
      if(item.cliente.includes("FCA") || item.cliente.includes("BRP")){
         if(item.status.includes("COMPLET")){         return "display: none"
      } else {
         return 
      }
      } else {
         return "display: none"
      }
   } else
   if(localStorage.username === "InhouseGTO"){
      if(item.cliente.includes("MULTILOG")){  
         if(item.status.includes("COMPLET")){         return "display: none"
      } else {
         return 
      }
      } else {
         return "display: none"
      }
   } else
   if(localStorage.username === "Traffic"){
      if(item.cliente.includes("FORDH")){
         return "display: none" 
      } else {
         if(item.status.includes("COMPLET")){         return "display: none"
      } else {
         return 
      }
      }
   }
   else {
     if(item.status.includes("COMPLET")){         return 
      } else {
         return 
      }
   }
   }

   if (item.ruta.match("HS") || item.ruta.match("CU")) {
      return `
      <tr id="${itemId}" class="${travelStatus(item)} pending item text-center align-middle" data-run="3" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-hour="${item.ventana}" data-status="${item.status}" data-fechaf="${item.fecha}" style="${filterUser(item)}">
          <td class="${item.unidad ? "table-active" : ""}" >${item.unidad}</td>
          <td class="${item.caja ? "table-active" : ""}">${item.caja}</td>
          <td >${item.operador}</td>
          <td>${item.cporte}</td>
          <td class="${item.tracking ? "table-active" : ""}" >${item.tracking}</td>
          <td class="${item.bol ? "table-active" : ""}" >${item.bol}</td>
          <td>${item.ruta}</td>
          <td class="table-active">${item.cliente}</td>
          <td class="">${item.fecha}</td>
          <td class="">${item.ventana}</td>
          <td >${item.llegada}</td>
          <td >${item.status}</td>
          <td>
          ${item.x3}
          </td>
          <td>
             <button id="${itemId}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${itemId}"></i></button>
             <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/Traffic" ? "display: none;" : ""}"><i class="fa-solid fa-trash" id="${itemId}"></i></button>
             
          </td>
       </tr>
         `;
   }

//ALERTA DE WARNING (RUTAS PENDIENTES)
   if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")) {
      return `
      <tr id="${itemId}" class="${travelStatus(item)} pending item text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-hour="${item.ventana}" data-status="${item.status}" data-fechaf="${item.fecha}" style="${filterUser(item)}">
          <td class="${item.unidad ? "table-active" : ""}" >${item.unidad}</td>
          <td class="${item.caja ? "table-active" : ""}">${item.caja}</td>
          <td >${item.operador}</td>
          <td>${item.cporte}</td>
          <td class="${item.tracking ? "table-active" : ""}" >${item.tracking}</td>
          <td class="${item.bol ? "table-active" : ""}" >${item.bol}</td>
          <td>${item.ruta}</td>
          <td class="table-active">${item.cliente}</td>
          <td class="">${item.fecha}</td>
          <td class="">${item.ventana}</td>
          <td >${item.llegada}</td>
          <td >${item.status}</td>
          <td>
          ${item.x3}
          </td>
          <td>
             <button id="${itemId}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${itemId}"></i></button>
             <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/Traffic" || window.location.hash === "#/TrafficH" ? "display: none;" : ""}"><i class="fa-solid fa-trash" id="${itemId}"></i></button>
             
          </td>
       </tr>
         `;
   } else

//ALERTA DE COMPLETE (RUTA COMPLETA)
   if(item.status.match("COMPLET")) {
   return `
   <tr id="${itemId}" class="item text-center align-middle ${travelStatus(item)}" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" data-hour="${item.ventana}" style="${filterUser(item)}">
       <td class="Unit">${item.unidad}</td>
       <td >${item.caja}</td>
       <td>${item.operador}</td>
       <td style="${item.cporte === "" || item.status.match("PORTE") ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
       <td style="${item.tracking === "" || item.status.match("TRACK") ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
       <td style="${item.bol === "" || item.status.match("BOL") || item.status.match("SHIPPER")  ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
       <td>${item.ruta}</td>
       <td class="table-active">${item.cliente}</td>
       <td >${item.fecha}</td>
       <td >${item.ventana}</td>
       <td style="${item.llegada === "TARDE" || item.llegada.match("DESFASADA") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124)" : ""}">${item.llegada}</td>
       <td style="${item.status.match("VALIDAR") ? "background-color: #ff6767;" : ""}">${item.status}</td>
       <td>
       ${item.x3}
       </td>
       <td>
          <button id="${itemId}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${itemId}"></i></button>
          <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/Traffic" || window.location.hash === "#/TrafficH" ? "display: none;" : ""}";><i class="fa-solid fa-trash" id="${itemId}"></i></button>
       </td>
    </tr>
      `;
   } else

   //CORRIENDO
   if(item.status.match("TRANSITO") || item.status.match("PROVEEDOR") || item.status.match("PLANTA") || item.status.match("DETENIDO") || item.status.match("CARGA")) {

return `
<tr id="${itemId}" class="item active-run text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" data-hour="${item.ventana}" style="${filterUser(item)}">
    <td class="Unit">${item.unidad}</td>
    <td>${item.caja}</td>
    <td>${item.operador}</td>
    <td style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
    <td style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
    <td style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
    <td>${item.ruta}</td>
    <td class="table-active">${item.cliente}</td>
    <td >${item.fecha}</td>
    <td >${item.ventana}</td>
    <td style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
    <td style="${alertColor(item)}" >${item.status}</td>
    <td>
     ${item.x3}
    </td>
    <td>
       <button id="${itemId}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${itemId}"></i></button>
       <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/Traffic" || window.location.hash === "#/TrafficH" || window.location.hash === "#/InhouseTOL" || window.location.hash === "#/InhouseHMO" || window.location.hash === "#/InhouseGTO" || window.location.hash === "#/InhouseMX" || window.location.hash === "#/Tracking" ? "display: none;" : ""}"; ><i class="fa-solid fa-trash" id="${item.id}"></i></button>
    </td>
 </tr>
          `;
   } else

   if(item.status.match("CANCEL")) {
      return `
      <tr id="${itemId}" class="item active-error text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" data-hour="${item.ventana}" style="${filterUser(item)}">
          <td class="Unit">${item.unidad}</td>
          <td>${item.caja}</td>
          <td>${item.operador}</td>
          <td style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
          <td style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
          <td style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
          <td>${item.ruta}</td>
          <td class="table-active">${item.cliente}</td>
          <td >${item.fecha}</td>
          <td >${item.ventana}</td>
          <td style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
          <td style="${alertColor(item)}" >${item.status}</td>
          <td>
           ${item.x3}
          </td>
          <td>
             <button id="${itemId}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${itemId}"></i></button>
             <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/Traffic" || window.location.hash === "#/TrafficH" || window.location.hash === "#/InhouseTOL" || window.location.hash === "#/InhouseHMO" || window.location.hash === "#/InhouseGTO" || window.location.hash === "#/InhouseMX" || window.location.hash === "#/Tracking" ? "display: none;" : ""}"; ><i class="fa-solid fa-trash" id="${item.id}"></i></button>
          </td>
       </tr>
                `;
      
   } else {
      
   return `
   <tr id="${itemId}" class="item active-run text-center align-middle" data-run="${alertStatus(item)}" data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" data-hour="${item.ventana}" style="${filterUser(item)}">
       <td class="Unit">${item.unidad}</td>
       <td>${item.caja}</td>
       <td>${item.operador}</td>
       <td style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
       <td style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
       <td style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
       <td>${item.ruta}</td>
       <td class="table-active">${item.cliente}</td>
       <td >${item.fecha}</td>
       <td >${item.ventana}</td>
       <td style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
       <td style="${alertColor(item)}" >${item.status}</td>
       <td>
        ${item.x3}
       </td>
       <td>
          <button id="${itemId}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${itemId}"></i></button>
          <button id="${itemId}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/Traffic" || window.location.hash === "#/TrafficH" || window.location.hash === "#/InhouseTOL" || window.location.hash === "#/InhouseHMO" || window.location.hash === "#/InhouseGTO" || window.location.hash === "#/InhouseMX" || window.location.hash === "#/Tracking" ? "display: none;" : ""}"; ><i class="fa-solid fa-trash" id="${item.id}"></i></button>
       </td>
    </tr>
             `;
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