export function ItemV(conv) {
   //console.log(conv);
   
  const alertStatus = (comit) => {


   if( comit.comentarios.match("MANTE") || comit.comentarios.match("FALLA") || comit.comentarios.match("DAÑ") || comit.comentarios.match("CORRA")){
      return `
          background: #99171787;
          color: #620606;
          font-weight: bold;

      ` ;
   }
   else {
      if( comit.comentarios.match("DISPONIBLE")){
         return  `
           background-color: #017d1a4f;
           color: #094a09;
           font-weight: bold;
           `;
           }
           else {
              return  `
              background-color: #f0e0cf;
           font-weight: bold;
           `;
           }
   }
  }

  
  const colorUbi = (ubi) => { 
   if(ubi.ubicacion.match("TRANSITO")){
      return `
      background-color: #badfff;
      font-weight: bold;
      `;
   }
   else {
      return `
      font-weight: bold;
      `;
   }
  }

  function diasTranscurridos(desdeFecha) {
   let partesFecha = desdeFecha.split("/");
   let dia = parseInt(partesFecha[0]);
   let mes = parseInt(partesFecha[1]) - 1; 
   let anio = parseInt(partesFecha[2]);
   let fechaRegistrada = new Date(anio, mes, dia);
   let fechaActual = new Date();
   let diferenciaEnMilisegundos = fechaActual - fechaRegistrada;
   let diasTranscurridos = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));

   return diasTranscurridos;
}
  

return  `
<tr id="${conv[0]}" class="item text-center align-middle"  data-conv="${conv[1].caja}" data-circuito="${conv[1].circuito}" data-ubicacion="${conv[1].ubicacion}">


<td style="font-weight: bold;">${conv[1].caja}</td>
<td>${conv[1].tipo}</td>
<td class="modelo">${conv[1].modelo}</td>
<td class="placa" >${conv[1].placa}</td>
<td class="año" >${conv[1].año}</td>
<td class="verificacion" >${conv[1].verificacion}</td>
<td class="poliza" >${conv[1].poliza}</td>
<td class="inciso">${conv[1].inciso}</td>
<td class="contacto" style="font-weight: bold;">${conv[1].contacto}</td>
<td style="font-weight: bold;" >${conv[1].circuito}</td>
<td style="font-weight: bold;" >${conv[1].fecha}</td>
<td style="${diasTranscurridos(conv[1].fecha) > 3 ? "background-color: #99171787; color: #620606; font-weight: bold; width: 15px;" : "background-color: #017d1a4f; color: #094a09; font-weight: bold; width: 15px;"}">${diasTranscurridos(conv[1].fecha)}</td>
<td style="${colorUbi(conv[1])}" >${conv[1].ubicacion}</td> 
<td style="${alertStatus(conv[1])}" >${conv[1].comentarios}</td>
<td >${conv[1].reporte}</td> 
<td class="btn-hid" style="${localStorage.username === "Public"  ? "display: none;" : ""}">
       <button id="${conv[0]}" type="button" class="btn btn-sm btn-warning ordenServ" data-bs-toggle="" data-bs-target=""><i class="fa-solid fa-triangle-exclamation" id="${conv[0]}"></i></button>
       <button id="${conv[0]}" type="button" class="btn btn-sm btn-danger delete" style="${localStorage.username === "CVehicular" ? "" : "display: none;"}"><i class="fa-solid fa-trash" id="${conv[0]}"></i></button>
</td>    
</tr>
`;


}



//BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-conveyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-conveyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>