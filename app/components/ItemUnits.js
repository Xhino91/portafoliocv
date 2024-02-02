export function ItemUnit(unit) {


  const alertStatus = (comit) => {


   if( comit.comentarios.match("MANTE") || comit.comentarios.match("FALLA") || comit.comentarios.match("DAÑ") || comit.comentarios.match("TIRADO") || comit.comentarios.match("CORRA")){
      return `
          background: #862828;
          color: white;
          font-weight: bold;

      ` ;
   }
   else {
      if( comit.comentarios.match("DISPONIBLE")){
    return  `
      background-color: #017d1a;
      color: white;
      font-weight: bold;
      `;
      }
      else {
         return  `
      background-color: #004c86;
      color: white;
      font-weight: bold;
      `;
      }
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

  //console.log(unit);


return  `
<tr class="item text-center align-middle" data-run="${orderRun(unit[1])}" data-unit="${unit[1].unidad}" data-circuito="${unit[1].circuito}" data-ubicacion="${unit[1].ubicacion}">


<td style="font-weight: bold;">${unit[1].unidad}</td>
<td>${unit[1].operador}</td>
<td class="modelo">${unit[1].modelo}</td>
<td class="placa" >${unit[1].placa}</td>
<td class="año" >${unit[1].año}</td>
<td class="verificacion" >${unit[1].verificacion}</td>
<td class="poliza" >${unit[1].poliza}</td>
<td class="inciso">${unit[1].inciso}</td>
<td class="contacto">${unit[1].contacto}</td>
<td>${unit[1].circuito}</td>
<td>${unit[1].fecha}</td>
<td style="${orderUbi(unit[1])}" >${unit[1].ubicacion}</td> 
<td style="${alertStatus(unit[1])}" >${unit[1].comentarios}</td> 
<td  style="${localStorage.username === "Public" ? "display: none;" : ""}">
<button id="${unit[0]}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${unit[0]}"></i></button>
<button id="${unit[0]}" type="button" class="btn btn-sm btn-danger delete" style="${window.location.hash === "#/CVehicular" ? "" : "display: none;"}"><i class="fa-solid fa-trash" id="${unit[0]}"></i></button>  
</td>

</tr>
`;


}



//BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-uniteyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-uniteyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>