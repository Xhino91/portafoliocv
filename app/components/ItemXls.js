export function ItemXls(item) {
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
      if( item.status.match("PROVEEDOR") || item.status.match("ESP") || item.status.match("PLANT") || item.status.match("CARGANDO")){
         return "background-color: #00508d; color: white;" ;
      }
      if( item.status.match("DET") ){
         return "background-color: #791d1d; color: white;" ;
      }
     
     }
   
     const alertStatus = (item) => {
   
   
      if( item.status.match("PROVEEDOR") || item.status.match("TRANSITO") || item.status.match("PLANTA")){
         return "1" ;
      }
      if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")){
         return "2" ;
      } 
      if (item.status.match("COMPLET")) {
         return "3" ;
      }
      if(item.status.match("CANCEL")){
         return "4";
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
    

    
    //ALERTA DE WARNING (RUTAS PENDIENTES)
       if(item.status.match("PENDIENTE") || item.status.match("ACTIVA")) {
          return `
          <tr id="${itemId}" class="${travelStatus(item)} item2 text-center align-middle" data-run="${alertStatus(item)}"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-fechaf="${item.fecha}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" style="${item.status.match("CANCELADA") || item.status.match("BROK") ? "background-color: #ff6767;" : "background-color: rgb(245, 223, 124);"}">
              <td class="${item.unidad ? "table-active" : ""}">${item.unidad}</td>
              <td class="${item.caja ? "table-active" : ""}">${item.caja}</td>
              <td >${item.operador}</td>
              <td class="cporte" >${item.cporte}</td>
              <td class="track" class="${item.tracking ? "table-active" : ""}" >${item.tracking}</td>
              <td class="bol" class="${item.bol ? "table-active" : ""}" >${item.bol}</td>
              <td class="ruta" >${item.ruta}</td>
              <td class="table-active">${item.cliente}</td>
              <td class="fecha">${item.fecha}</td>
              <td class="ventana">${item.ventana}</td>
              <td class="llegada" style="${item.llegada.match("DESFASADA") ? "background-color: rgb(245, 223, 124);" : ""}" >${item.llegada}</td>
              <td style="${item.status.match("CRITICA") ? "background-color: #ff6767;;" : ""}">${item.status}</td>
              <td>
                  ${item.x3}
                 </td>
           </tr>
             `;
       }
    
    //ALERTA DE COMPLETE (RUTA COMPLETA)
       if(item.status.match("COMPLET")) {
       return `
       <tr id="${itemId}" style="display: none;" class="item2 text-center align-middle ${travelStatus(item)}" data-run="${alertStatus(item)}"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" >
           <td class="Unit">${item.unidad}</td>
           <td >${item.caja}</td>
           <td>${item.operador}</td>
           <td class="cporte" style="${item.cporte === "" || item.status.match("PORTE") ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
           <td class="track" style="${item.tracking === "" || item.status.match("TRACK") ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
           <td class="bol" style="${item.bol === "" || item.status.match("BOL") || item.status.match("SHIPPER")  ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
           <td class="ruta" >${item.ruta}</td>
           <td class="table-active">${item.cliente}</td>
           <td class="fecha" >${item.fecha}</td>
           <td class="ventana" >${item.ventana}</td>
           <td class="llegada" style="${item.llegada === "TARDE" || item.llegada.match("DESFASADA") ? "background-color: rgb(245, 183, 124)" : ""}">${item.llegada}</td>
           <td >${item.status}</td>
           <td>
          ${item.x3}
          </td>
        </tr>
          `;
       }
    
    //CORRIENDO
    if(item.status.match("TRANSITO") || item.status.match("PROVEEDOR") || item.status.match("PLANTA") ){
        return `
     <tr id="${itemId}" class="item2 active-run text-center align-middle" data-run="${alertStatus(item)}"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" style="${item.llegada.match("TIEMPO") || item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color:rgb(217, 241, 255);" : ""}">
         <td class="Unit">${item.unidad}</td>
         <td>${item.caja}</td>
         <td>${item.operador}</td>
         <td class="cporte" style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
         <td class="track" style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
         <td class="bol" style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
         <td class="ruta" >${item.ruta}</td>
         <td class="table-active">${item.cliente}</td>
         <td class="fecha" >${item.fecha}</td>
         <td class="ventana" >${item.ventana}</td>
         <td class="llegada" style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
         <td style="${alertColor(item)}" >${item.status}</td>
         <td>
          ${item.x3}
          </td>
      </tr>
               `;
            } else 
            if(item.status.match("CANCEL") ){
               return `
            <tr id="${itemId}" class="item2 active-error text-center align-middle" data-run="${alertStatus(item)}"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" style="${item.llegada.match("TIEMPO") || item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color:rgb(217, 241, 255);" : ""}">
                <td class="Unit">${item.unidad}</td>
                <td>${item.caja}</td>
                <td>${item.operador}</td>
                <td class="cporte" style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
                <td class="track" style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
                <td class="bol" style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
                <td class="ruta" >${item.ruta}</td>
                <td class="table-active">${item.cliente}</td>
                <td class="fecha" >${item.fecha}</td>
                <td class="ventana" >${item.ventana}</td>
                <td class="llegada" style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
                <td style="${alertColor(item)}" >${item.status}</td>
                <td>
                 ${item.x3}
                 </td>
             </tr>
                      `;
                   }
             
    
            return `
     <tr id="${itemId}" class="item2 ${travelStatus(item)} text-center align-middle" data-run="${alertStatus(item)}"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" style="${item.llegada.match("TIEMPO") || item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color:rgb(217, 241, 255);" : ""}">
         <td class="Unit">${item.unidad}</td>
         <td>${item.caja}</td>
         <td>${item.operador}</td>
         <td class="cporte" style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
         <td class="track" style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
         <td class="bol" style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
         <td class="ruta" >${item.ruta}</td>
         <td class="table-active">${item.cliente}</td>
         <td class="fecha" >${item.fecha}</td>
         <td class="ventana" >${item.ventana}</td>
         <td class="llegada" style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
         <td style="${alertColor(item)}" >${item.status}</td>
         <td>
          ${item.x3}
          </td>
      </tr>
               `;
    
    }
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.id}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-car" id="${item.id}"></i></button>