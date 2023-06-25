export function ItemV(conv) {


  const alertStatus = (comit) => {


   if( comit.comentarios.match("CRITIC") || comit.comentarios.match("FALLA") || comit.comentarios.match("DAÑ")){
      return `
          background: #dc3545;
          color: white;
          font-weight: bold;

      ` ;
   }  else {
      return "background: #69beff";
   }
  }


return  `
<tr class="item text-center align-middle" data-conv="${conv[1].caja}">


<td style="font-weight: bold;">${conv[1].caja}</td>
<td>${conv[1].tipo}</td>
<td>${conv[1].modelo}</td>
<td>${conv[1].placa}</td>
<td>${conv[1].año}</td>
<td>${conv[1].verificacion}</td>
<td>${conv[1].poliza}</td>
<td>${conv[1].inciso}</td>
<td>${conv[1].contacto}</td>
<td>${conv[1].ubicacion}</td> 
<td style="${alertStatus(conv[1])}" >${conv[1].comentarios}</td> 
<td  style="${window.location.hash === "#/Tracking" || window.location.hash === "#/Traffic"  ? "display: none;" : ""}"><button id="${conv[0]}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${conv[0]}"></i></button></td>    
</tr>
`;


}



//BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>