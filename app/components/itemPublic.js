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
      if( item.status.match("PROVEEDOR") || item.status.match("ESP") || item.status.match("PLANT")){
         return "background-color: #00508d; color: white;" ;
      }
      if( item.status.match("DET") ){
         return "background-color: #791d1d; color: white;" ;
      }
     
      else {
        return "background-color: #c3d9e5" ;
       }
   
     }
   
     const alertStatus = (item) => {
   
   
     if( item.status.match("TRANSITO")){
         return "-1" ;
      } 
      if( item.status.match("PROVEEDOR") || item.status.match("ESPER")){
         return "" ;
      }
      if( item.status.match("DET") ){
         return "" ;
      } else {
         return "";
      }
     }

    

    
    //ALERTA DE WARNING (RUTAS PENDIENTES)
       if(item.unidad === "" || item.caja === "" || item.ruta === "" || item.operador === "") {
          return `
          <tr id="${itemId}" class="${travelStatus(item)} item text-center align-middle" data-run="2"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-fechaf="${item.fecha}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" style="${item.status.match("CANCELADA") || item.status.match("BROK") ? "background-color: #ff6767;" : "background-color: rgb(245, 223, 124);"}">
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
       if(item.x1 === true && item.x1 === true && item.x1 === true && item.x1 === true) {
       return `
       <tr id="${itemId}" style="display: none;" class="item text-center align-middle active-complete" data-run="3"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" >
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
        return `
     <tr id="${itemId}" class="item ${travelStatus(item)} text-center align-middle" data-run="${alertStatus(item)}"  data-unit="${item.unidad}" data-box="${item.caja}" data-operador="${item.operador}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" data-status="${item.status}" data-fechaf="${item.fecha}" style="${item.llegada.match("TIEMPO") || item.llegada.match("DESFASADA") || item.llegada.match("TARDE") || item.llegada.match("CRITICA") ? "background-color:rgb(217, 241, 255);" : ""}">
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
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>