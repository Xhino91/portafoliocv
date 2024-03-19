export function ItemUnit(unit, keyUpdate) {
  let unitId, user = localStorage.username;

  if(!keyUpdate){
    unitId = unit[0];
    unit = unit[1];
 } else {
    unitId = keyUpdate;
 }
  
  const alertStatus = (comit) => {
    if (
      comit.comentarios.match("MANTE") ||
      comit.comentarios.match("FALLA") ||
      comit.comentarios.match("DAÑ") ||
      comit.comentarios.match("SINIES") ||
      comit.comentarios.match("CORRA")
    ) {
      return `
          background: #99171787;
          color: #620606;
         font-weight: bold;
      `;
    } else {
      if (comit.comentarios.match("DISPONIBLE")) {
        return `
           background-color: #017d1a4f;
           color: #094a09;
           font-weight: bold;
           `;
      } else {
        return ` 
        background-color: #f0e0cf;
        font-weight: bold;
           `;
      }
    }
  };

  const compareKM = (unit) => {
    // console.log((parseInt(unit[1].uservicio, 10) + 28000).toLocaleString());
    if (
      parseInt(unit.unidad, 10) >= 1 &&
      parseInt(unit.unidad, 10) <= 31
    ) {
      return {
        pservice: (parseInt(unit.uservicio, 10) + 28000),
        km: 28000,
      };
    } else if (
      parseInt(unit.unidad, 10) >= 33 &&
      parseInt(unit.unidad, 10) <= 258
    ) {
      return {
        pservice: (parseInt(unit.uservicio, 10) + 45000),
        km: 45000,
      };
    } else if (
      parseInt(unit.unidad, 10) >= 300 &&
      parseInt(unit.unidad, 10) <= 350
    ) {
      return {
        pservice: (parseInt(unit.uservicio, 10) + 60000),
        km: 60000,
      };
    } else if (
      parseInt(unit.unidad, 10) >= 400 &&
      parseInt(unit.unidad, 10) <= 450
    ) {
      return {
        pservice: (parseInt(unit.uservicio, 10) + 45000),
        km: 45000,
      };
    } else {
      return
    }
  };

  const alertService = (uservice, odometro) => {
  // console.log(uservice.pservice, odometro);
    if (uservice.km === 28000) {
      //console.log(uservice);
      if (uservice.pservice - odometro >= 2000) {
         return `
         background: #017d1a4f;
         font-weight: bold;
         color: #094a09;
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro >= 0) {
         return `
         background: #ee8e2875;
         font-weight: bold;
         color: #913c0af7;
         `;
       }
       if (uservice.pservice - odometro < 0) {
         return `
         background: #99171787;
         font-weight: bold;
         color: #620606;
         `;
       }
    } else
    if (uservice.km === 45000) {
      if (uservice.pservice - odometro >= 2000) {
         return `
         background: #017d1a4f;
         font-weight: bold;
         color: #094a09;
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro > 0) {
         return `
         background: #ee8e2875;
         font-weight: bold;
         color: #913c0af7;;
         `;
       }
       if (uservice.pservice - odometro <= 0) {
         return `
         background: #99171787;
         font-weight: bold;
         color: #620606;
         `;
       }
    } else
    if (uservice.km === 60000) {
      if (uservice.pservice - odometro >= 2000) {
         return `
         background: #017d1a4f;
         font-weight: bold;
         color: #094a09;
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro > 0) {
         return `
         background: #ee8e2875;
         font-weight: bold;
         color: #913c0af7;
         `;
       }
       if (uservice.pservice - odometro <= 0) {
         return `
         background: #99171787;
         font-weight: bold;
         color: #620606;
         `;
       }
    }
    

  };

  const mttoPreventive = (uservice, odometro) => {
   if (uservice.km === 28000) {
      //console.log(uservice);
      if (uservice.pservice - odometro >= 2000) {
         return `
         VIGENTE
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro >= 0) {
         return `
         PROGRAMAR
         `;
       }
       if (uservice.pservice - odometro < 0) {
         return `
         RELIZAR SERVICIO
         `;
       }
    } else
    if (uservice.km === 45000) {
      if (uservice.pservice - odometro >= 2000) {
         return `
         VIGENTE
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro > 0) {
         return `
         PROGRAMAR
         `;
       }
       if (uservice.pservice - odometro <= 0) {
         return `
         RELIZAR SERVICIO
         `;
       }
    } else
    if (uservice.km === 60000) {
      if (uservice.pservice - odometro >= 2000) {
         return `
         VIGENTE
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro > 0) {
         return `
         PROGRAMAR
         `;
       }
       if (uservice.pservice - odometro <= 0) {
         return `
         RELIZAR SERVICIO
         `;
       }
    }
  };


  //console.log(unit);

  return `
<tr id="${unitId}" class="item text-center align-middle" data-unit="${unit.unidad}" data-circuito="${unit.circuito}" data-ubicacion="${unit.ubicacion}">


<td style="font-weight: bold;">${unit.unidad}</td>
<td class="modelo">${unit.modelo}</td>
<td class="placa" >${unit.placa}</td>
<td class="año" >${unit.año}</td>
<td class="verificacion" >${unit.verificacion}</td>
<td class="poliza" >${unit.poliza}</td>
<td class="inciso">${unit.inciso}</td>
<td class="fechauserv" style="font-weight: bold;">${unit.linker}</td>
<td class="contacto" style="font-weight: bold;">${parseInt(unit.uservicio, 10).toLocaleString()}</td>
<td class="contacto" style="font-weight: bold;">${compareKM(unit).pservice.toLocaleString()}</td>
<td class="contacto" style="font-weight: bold;">${parseInt(unit.contacto, 10).toLocaleString()}</td>
<td class="contacto" style="${alertService(compareKM(unit), parseInt(unit.contacto, 10))}">${(compareKM(unit).pservice - parseInt(unit.contacto, 10))}</td>
<td class="contacto" style="${alertService(compareKM(unit), parseInt(unit.contacto, 10))}">${mttoPreventive(compareKM(unit), parseInt(unit.contacto, 10))}</td>
<td style="font-weight: bold;">${unit.circuito}</td>
<td style="font-weight: bold;">${unit.fecha}</td>
<td style="font-weight: bold; ${unit.ubicacion.match("TRANSITO") ? "background-color: #badfff;" : ""}" >${unit.ubicacion}</td> 
<td style="${alertStatus(unit)}" >${unit.comentarios}</td> 
<td class="btn-hid" style="${user === "Public" ? "display: none;" : ""}">
<button id="${unitId}" type="button" class="btn btn-sm btn-warning ordenServ" data-bs-toggle="" data-bs-target=""><i class="fa-solid fa-triangle-exclamation" id="${unitId}"></i></button>
<button id="${unitId}" type="button" class="btn btn-sm btn-danger delete" style="${user === "CVehicular" ? "" : "display: none;"}"><i class="fa-solid fa-trash" id="${unitId}"></i></button>  
</td>

</tr>
`;
}

//BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-uniteyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-uniteyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>
// <button id="${unit[0]}" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${unit[0]}"></i></button>