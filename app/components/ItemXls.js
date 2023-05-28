export function ItemXls(item) {
    // console.log(item);
    
item = item[1];

    
    //ALERTA DE WARNING (RUTAS PENDIENTES)
       if(item.unidad === "" || item.caja === "" || item.ruta === "") {
          return `
          <tr class="item2 text-center align-middle" data-run="3" data-unit="${item.unidad}" data-box="${item.caja}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" style="${item.status.match("CANCELADA") ? "background-color: #ff6767;" : "background-color: rgb(245, 223, 124);"}">
              <td class="Unit">Int-${item.unidad}</td>
              <td >${item.caja}</td>
              <td>${item.operador}</td>
              <td>${item.cporte}</td>
              <td>${item.tracking}</td>
              <td>${item.bol}</td>
              <td>${item.ruta}</td>
              <td class="table-active">${item.cliente}</td>
              <td class="">${item.fecha}</td>
              <td class="">${item.ventana}</td>
              <td style="${item.llegada.match("DESFASADA") ? "background-color: rgb(245, 223, 124);" : ""}" >${item.llegada}</td>
              <td >${item.status}</td>
              </tr>
             `;
       }
    
    //ALERTA DE COMPLETE (RUTA COMPLETA)
    if(item.x1 === true && item.x1 === true && item.x1 === true && item.x1 === true) {
       return `
       <tr class="item2 text-center align-middle active-complete" data-run="2" data-unit="${item.unidad}" data-box="${item.caja}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" style="${item.status.match("COMPLE") ? "background-color: rgb(146, 225, 117);" : "background-color: rgb(146, 225, 117);"}">
           <td class="Unit">Int-${item.unidad}</td>
           <td >${item.caja}</td>
           <td>${item.operador}</td>
           <td style="${item.cporte === "" || item.status.match("PORTE") ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
           <td style="${item.tracking === "" || item.status.match("TRACK") ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
           <td style="${item.bol === "" || item.status.match("BOL") || item.status.match("SHIPPER") ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
           <td>${item.ruta}</td>
           <td class="table-active">${item.cliente}</td>
           <td >${item.fecha}</td>
           <td >${item.ventana}</td>
           <td style="${item.llegada === "TARDE" || item.llegada.match("DESFASADA") ? "background-color: rgb(245, 183, 124)" : ""}">${item.llegada}</td>
           <td style="${item.status.match("VALIDAR") ? "background-color: #ff6767;" : ""}">${item.status}</td>
           </tr>
          `;
    }
    
    //CORRIENDO
        return `
     <tr class="item2 text-center align-middle" data-run="0" data-unit="${item.unidad}" data-box="${item.caja}" data-track="${item.tracking}" data-ruta="${item.ruta}" data-cliente="${item.cliente}" style="${item.llegada.match("TIEMPO") || item.llegada.match("DESFASADA") || item.llegada.match("TARDE") ? "background-color:rgb(217, 241, 255);" : ""}">
         <td class="Unit">Int - ${item.unidad}</td>
         <td>${item.caja}</td>
         <td>${item.operador}</td>
         <td style="${item.cporte === "" ? "background-color: #ff6767;" : ""}" >${item.cporte}</td>
         <td style="${item.tracking === "" ? "background-color: #ff6767;" : ""}" >${item.tracking}</td>
         <td style="${item.bol === "" ? "background-color: #ff6767;" : ""}" >${item.bol}</td>
         <td>${item.ruta}</td>
         <td class="table-active">${item.cliente}</td>
         <td >${item.fecha}</td>
         <td >${item.ventana}</td>
         <td style="${item.llegada.match("DESFASADA") || item.llegada.match("TARDE") ? "background-color: rgb(245, 183, 124);" : ""}">${item.llegada}</td>
         <td >${item.status}</td>
         </tr>
               `;
    
    
    }
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.id}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-car" id="${item.id}"></i></button>