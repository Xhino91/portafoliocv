export function ItemV(conv) {

   
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
<tr class="item text-center align-middle" data-run="${orderRun(conv[1])}" data-conv="${conv[1].caja}">


<td style="font-weight: bold;">${conv[1].caja}</td>
<td>${conv[1].tipo}</td>
<td class="modelo">${conv[1].modelo}</td>
<td class="placa" >${conv[1].placa}</td>
<td class="año" >${conv[1].año}</td>
<td class="verificacion" >${conv[1].verificacion}</td>
<td class="poliza" >${conv[1].poliza}</td>
<td class="inciso">${conv[1].inciso}</td>
<td class="contacto">${conv[1].contacto}</td>
<td>${conv[1].circuito}</td>
<td>${conv[1].ruta}</td>
<td style="${orderUbi(conv[1])}" >${conv[1].ubicacion}</td> 
<td style="${alertStatus(conv[1])}" >${conv[1].comentarios}</td> 
<td  style="${window.location.hash === "#/Tracking" || window.location.hash === "#/Traffic" || window.location.hash === "#/Public"  ? "display: none;" : ""}"><button id="${conv[0]}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${conv[0]}"></i></button></td>    
</tr>
`;


}



//BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>