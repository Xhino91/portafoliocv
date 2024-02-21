export function ItemUnit(unit) {
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
         font-weight: bold;
      `;
    } else {
      if (comit.comentarios.match("DISPONIBLE")) {
        return `
           background-color: #017d1a4f;
           font-weight: bold;
           `;
      } else {
        return `
        font-weight: bold;
           `;
      }
    }
  };

  const compareKM = (unit) => {
    // console.log((parseInt(unit[1].uservicio, 10) + 28000).toLocaleString());
    if (
      parseInt(unit[1].unidad, 10) >= 1 &&
      parseInt(unit[1].unidad, 10) <= 31
    ) {
      return {
        pservice: (parseInt(unit[1].uservicio, 10) + 28000),
        km: 28000,
      };
    } else if (
      parseInt(unit[1].unidad, 10) >= 33 &&
      parseInt(unit[1].unidad, 10) <= 258
    ) {
      return {
        pservice: (parseInt(unit[1].uservicio, 10) + 45000),
        km: 45000,
      };
    } else if (
      parseInt(unit[1].unidad, 10) >= 300 &&
      parseInt(unit[1].unidad, 10) <= 307
    ) {
      return {
        pservice: (parseInt(unit[1].uservicio, 10) + 60000),
        km: 60000,
      };
    } else if (
      parseInt(unit[1].unidad, 10) >= 400 &&
      parseInt(unit[1].unidad, 10) <= 410
    ) {
      return {
        pservice: (parseInt(unit[1].uservicio, 10) + 45000),
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
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro >= 0) {
         return `
         background: #ee8e2875;
         font-weight: bold;
         `;
       }
       if (uservice.pservice - odometro < 0) {
         return `
         background: #99171787;
         font-weight: bold;
         `;
       }
    } else
    if (uservice.km === 45000) {
      if (uservice.pservice - odometro >= 2000) {
         return `
         background: #017d1a4f;
         font-weight: bold;
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro > 0) {
         return `
         background: #ee8e2875;
         font-weight: bold;
         `;
       }
       if (uservice.pservice - odometro <= 0) {
         return `
         background: #99171787;
         font-weight: bold;
         `;
       }
    } else
    if (uservice.km === 60000) {
      if (uservice.pservice - odometro >= 2000) {
         return `
         background: #017d1a4f;
         font-weight: bold;
         `;
       } else if (uservice.pservice - odometro < 2000 && uservice.pservice - odometro > 0) {
         return `
         background: #ee8e2875;
         font-weight: bold;
         `;
       }
       if (uservice.pservice - odometro <= 0) {
         return `
         background: #99171787;
         font-weight: bold;
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
<tr id="${unit[0]}" class="item text-center align-middle" data-unit="${
    unit[1].unidad
  }" data-circuito="${unit[1].circuito}" data-ubicacion="${unit[1].ubicacion}">


<td style="font-weight: bold;">${unit[1].unidad}</td>
<td>${unit[1].operador}</td>
<td class="modelo">${unit[1].modelo}</td>
<td class="placa" >${unit[1].placa}</td>
<td class="año" >${unit[1].año}</td>
<td class="verificacion" >${unit[1].verificacion}</td>
<td class="poliza" >${unit[1].poliza}</td>
<td class="inciso">${unit[1].inciso}</td>
<td class="contacto">${parseInt(unit[1].uservicio, 10).toLocaleString()}</td>
<td class="contacto">${compareKM(unit).pservice.toLocaleString()}</td>
<td class="contacto">${parseInt(unit[1].contacto, 10).toLocaleString()}</td>
<td class="contacto">${parseInt(unit[1].linker, 10).toLocaleString()}</td>
<td class="contacto" style="${alertService(compareKM(unit), parseInt(unit[1].contacto, 10))}">${mttoPreventive(compareKM(unit), parseInt(unit[1].contacto, 10))}</td>
<td>${unit[1].circuito}</td>
<td>${unit[1].fecha}</td>
<td style="" >${unit[1].ubicacion}</td> 
<td style="${alertStatus(unit[1])}" >${unit[1].comentarios}</td> 
<td class="btn-hid" style="${
    localStorage.username === "Public" ? "display: none;" : ""
  }">
<button id="${
    unit[0]
  }" type="button" class="btn btn-sm btn-primary edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-pencil" id="${
    unit[0]
  }"></i></button>
<button id="${
    unit[0]
  }" type="button" class="btn btn-sm btn-danger delete" style="${
    localStorage.username === "CVehicular" || localStorage.username === "Mtto" ? "" : "display: none;"
  }"><i class="fa-solid fa-trash" id="${unit[0]}"></i></button>  
</td>

</tr>
`;
}

//BOTON CONTROL VEHICULAR <button id="${item.unidad}" style="${item.unidad || item.caja ? "display: inherit;" : "display: none;"}" data-uniteyance="${item.caja}" type="button" class="btn btn-sm btn-dark control" data-bs-toggle="modal" data-bs-target="#controlModal"><i data-uniteyance="${item.caja}" class="fa-solid fa-car" id="${item.unidad}"></i></button>
