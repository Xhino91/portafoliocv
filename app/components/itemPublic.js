export function itemPublic(item) {
     //console.log(Object.values(item));

     let itemId = item[0];
     item = item[1];

     //console.log(item);


    
    //ALERTA DE WARNING (RUTAS PENDIENTES)
       if(item.unidad === "" || item.caja === "" || item.ruta === "") {
          return `
          <tr id="${itemId}" class="item text-center align-middle" data-run="2"  data-unit="${item.unidad}" data-box="${item.caja}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" style="${item.status.match("CANCELADA") || item.status.match("BROK") ? "background-color: #ff6767;" : "background-color: rgb(245, 223, 124);"}">
              <td class="Unit">Int-${item.unidad}</td>
              <td class="${item.caja ? "table-active" : ""}">${item.caja}</td>
              <td >${item.operador}</td>
              <td class="cporte" >${item.cporte}</td>
              <td class="track" class="${item.tracking ? "table-active" : ""}" >${item.tracking}</td>
              <td class="bol" class="${item.bol ? "table-active" : ""}" >${item.bol}</td>
              <td>${item.ruta}</td>
              <td class="table-active">${item.cliente}</td>
              <td class="">${item.fecha}</td>
              <td class="">${item.ventana}</td>
              <td class="llegada" style="${item.llegada.match("DESFASADA") ? "background-color: rgb(245, 223, 124);" : ""}" >${item.llegada}</td>
              <td style="${item.status.match("CRITICA") ? "background-color: #ff6767;;" : ""}">${item.status}</td>
              <td>
             
              </td>
           </tr>
             `;
       }
    
    //ALERTA DE COMPLETE (RUTA COMPLETA)
       if(item.x1 === true && item.x1 === true && item.x1 === true && item.x1 === true) {
       return `
       <tr id="${itemId}" class="item text-center align-middle active-complete" data-run="3"  data-unit="${item.unidad}" data-box="${item.caja}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" style="${item.status.match("COMPLE") ? "background-color: rgb(146, 225, 117);" : "background-color: rgb(146, 225, 117);"}">
           <td class="Unit">Int-${item.unidad}</td>
           <td >${item.caja}</td>
           <td>${item.operador}</td>
           <td class="cporte" style="${item.cporte === "" || item.status.match("PORTE") ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
           <td class="track" style="${item.tracking === "" || item.status.match("TRACK") ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
           <td class="bol" style="${item.bol === "" || item.status.match("BOL") || item.status.match("SHIPPER")  ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
           <td>${item.ruta}</td>
           <td class="table-active">${item.cliente}</td>
           <td >${item.fecha}</td>
           <td >${item.ventana}</td>
           <td class="llegada" style="${item.llegada === "TARDE" || item.llegada.match("DESFASADA") ? "background-color: rgb(245, 183, 124)" : ""}">${item.llegada}</td>
           <td style="${item.status.match("VALIDAR") ? "background-color: #ff6767;" : ""}">${item.status}</td>
           <td>
           
           </td>
        </tr>
          `;
       }
    
    //CORRIENDO
        return `
     <tr id="${itemId}" class="item text-center align-middle" data-run="0"  data-unit="${item.unidad}" data-box="${item.caja}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" style="${item.llegada.match("TIEMPO") || item.llegada.match("DESFASADA") || item.llegada.match("TARDE") ? "background-color:rgb(217, 241, 255);" : ""}">
         <td class="Unit">Int - ${item.unidad}</td>
         <td>${item.caja}</td>
         <td>${item.operador}</td>
         <td class="cporte" style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
         <td class="track" style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
         <td class="bol" style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
         <td>${item.ruta}</td>
         <td class="table-active">${item.cliente}</td>
         <td >${item.fecha}</td>
         <td >${item.ventana}</td>
         <td class="llegada" style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
         <td style="${item.status.match("TRANSITO") ? "background-color: #72aefd;" : "background-color: #c3d9e5"}">${item.status}</td>
         <td>
         <button id="${item.unidad}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>
      </tr>
               `;
    
    
    }
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>