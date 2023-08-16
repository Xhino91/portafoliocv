export function ItemXlsInvUnit(unit) {
  
   

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
   <tr class="item2 text-center align-middle" data-run="${orderRun(unit[1])}" data-unit="${unit[1].unidad}">
   
   
   <td style="font-weight: bold;">${unit[1].unidad}</td>
   <td>${unit[1].operador}</td>
   <td>${unit[1].modelo}</td>
   <td>${unit[1].placa}</td>
   <td>${unit[1].año}</td>
   <td>${unit[1].verificacion}</td>
   <td>${unit[1].poliza}</td>
   <td>${unit[1].inciso}</td>
   <td>${unit[1].contacto}</td>
   <td>${unit[1].circuito}</td>
   <td>${unit[1].fecha}</td>
   <td style="${orderUbi(unit[1])}" >${unit[1].ubicacion}</td> 
   <td style="${alertStatus(unit[1])}" >${unit[1].comentarios}</td> 
   </tr>
   `;
   
    
    
    }
    
    
    
    //BOTON CONTROL VEHICULAR <button id="${item.id}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-car" id="${item.id}"></i></button>