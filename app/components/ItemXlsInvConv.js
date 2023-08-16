export function ItemXlsInvConv(conv) {
  
   

   const alertStatus = (comit) => {


      if( comit.comentarios.match("CRITIC") || comit.comentarios.match("FALLA") || comit.comentarios.match("DAÑ")){
         return `
             background: #862828;
             color: white;
             font-weight: bold;
   
         ` ;
      }
      else {
         return "background: #69beff";
      }
     }
   
     const orderRun = (item) => {
   
   
      if( item.ubicacion.match("TRANSITO") || item.ubicacion.match("PROVEEDOR") || item.ubicacion.match("PLANTA")){
         return "0" ;
      } else {
         return "1";
      }
     }
   
     const orderUbi = (ubi) => { 
      if(ubi.ubicacion.match("TRANSITO") || ubi.ubicacion.match("PROVEEDOR") || ubi.ubicacion.match("PLANTA")){
         return `
         background-color: #004c86;
         color: white;
         font-weight: bold;
         `;
      }
      if(ubi.ubicacion.match("PATIO")){
         return `
         background-color: #845a35;
         color: white;
         
         `;
      }
      if(ubi.ubicacion.match("BP") || ubi.ubicacion.match("FCA" || ubi.ubicacion.match("CSAP"))){
         return `
         background-color: #6a6a6a;
         color: white;
         `;
      }
      else {
         return
      }
     }
   
   
   return  `
   <tr class="item2 text-center align-middle" data-run="${orderRun(conv[1])}" data-conv="${conv[1].caja}">
   
   
   <td style="font-weight: bold;">${conv[1].caja}</td>
   <td>${conv[1].tipo}</td>
   <td>${conv[1].modelo}</td>
   <td>${conv[1].placa}</td>
   <td>${conv[1].año}</td>
   <td>${conv[1].verificacion}</td>
   <td>${conv[1].poliza}</td>
   <td>${conv[1].inciso}</td>
   <td>${conv[1].contacto}</td>
   <td>${conv[1].circuito}</td>
   <td>${conv[1].fecha}</td>
   <td style="${orderUbi(conv[1])}" >${conv[1].ubicacion}</td> 
   <td style="${alertStatus(conv[1])}" >${conv[1].comentarios}</td> 
   </tr>
   `;
   
    
    
    }
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.id}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-car" id="${item.id}"></i></button>