import {
  getDatabase,
  ref,
  get,
  onValue,
  onChildChanged,
  update
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { tabActive } from "./tabActive.js";
import { renderTableCV } from "./renderTableCV.js";
import { ItemV } from "./ItemV.js";


 export function cargarVistaRemolques(user) {
  const db = getDatabase(), d = document;
  const refItems = ref(db, "subitem1");
  let modal = document.getElementById("myModal");
  let keyUpdate = null,
  updateValue = {};  
  tabActive("cajas"); 

  get(refItems)
  .then((snapshot) => {
      if (snapshot.exists()) {
      const data = snapshot.val();
      renderTableCV(data); 
     } else {
       console.log("No se encontraron datos.");
     }
    })
  .catch((error) => {
      console.error("Error al obtener los datos:", error);
       });

   function updateItem (updateValue, keyUpdate){
     if (!updateValue || !keyUpdate ) return;
     if(!d.getElementById(`${keyUpdate}`) || d.getElementById(`${keyUpdate}`) === null) return;

         d.getElementById(`${keyUpdate}`).innerHTML = `${ItemV(updateValue, keyUpdate)}`;
         d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
       setTimeout(function () {
         d.getElementById(`${keyUpdate}`).classList.remove("parpadeo");
       }, 1000); 
      
     }


    if(localStorage.tabConveyance === "true" && localStorage.tabUnit === "false" && localStorage.tabViajes === "false"){
      onChildChanged(refItems, (snapshot) => {
        updateValue = snapshot.val();
        keyUpdate = snapshot.key;

        updateItem(updateValue, keyUpdate);
       });

       d.addEventListener("click", async (e) => {
        if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
          if (localStorage.tabConveyance === "true"){
            let keyDelete = `/subitem1/${e.target.id}`,
            isConfirm = confirm("¿Eliminar Registro?");
    
            if (isConfirm) {
            await  remove(ref(db, `/subitem1/${e.target.id}`))
            .then(()=>{
              const refItems = ref(db, keyDelete);
              onValue(refItems, (snapshot) => {
                let res = snapshot.val();
                  renderTableCV(res);
                  keyDelete = ``;
              });
            })
            .catch(error => {
              console.error('Error al intentar eliminar:', error);
            });
            }
          }
        }
      });
    

       d.addEventListener("dblclick", (e) => {
        
        if(e.target.parentNode.tagName === "TR"){
          if (localStorage.tabConveyance === "true") {
          if(localStorage.username === "Public") return null;
          const db = getDatabase(),
          refRem = ref(db, `subitem1/${e.target.parentNode.id}`);

          if(!e.target.parentNode.id) return;
              onValue(refRem, (snapshot) => {
             let item = snapshot.val();
              d.getElementById("formulario-tr").dataset.value = `${e.target.parentNode.id}`;
              d.querySelector(".modal-body-tr").innerHTML = `
      <div class="container-fluid font"> 
      <table class="table table-sm " >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th id="cajas" scope="col">CAJA</th>
      <th scope="col">TIPO</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
      <th scope="col">VERIFICACION</th>
      <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">MARCHAMO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
      <th scope="col">REPORTE</th>

    </tr>
  </thead>
  <tbody class="text-center text-wrap" >
  <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="tipo" style="width: 120px;" type="text"   value="${item.tipo}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="poliza" style="width: 100px;" type="text"  value="${item.poliza}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="inciso" style="width: 100px;" type="text"  value="${item.inciso}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ${user === "CVehicular" || user === "Mtto" ? "" : "disabled"}></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 150px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
      <option value="${item.circuito}">${item.circuito}</option>
      <option value="FUERA DE CIRCUITO">FUERA DE CIRCUITO</option>
      <option value="FORDC - HILEX">FORDC - HILEX</option>  
      <option value="FORDC - WINDSOR QRO">FORDC - WINDSOR QRO</option>
      <option value="FORDC - WINDSOR AEROPUERTO">FORDC - WINDSOR AEROPUERTO</option>
      <option value="FORDC - MUBEA">FORDC - MUBEA</option>
      <option value="FORDC - BROSE">FORDC - BROSE</option>
      <option value="FORDC - MEXAURIA">FORDC - MEXAURIA</option>
      <option value="FORDC - STANDAR">FORDC - STANDAR</option>
      <option value="FORDC - FLEX N GATE">FORDC - FLEX N GATE</option>
      <option value="FORDC - DHL">FORDC - DHL</option>
      <option value="FORDC - MARTIN REA">FORDC - MARTIN REA</option>
      <option value="FORDC - AUTOTEK">FORDC - AUTOTEK</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="FORDH - BROSE">FORDH - BROSE MX</option>
      <option value="FORDH - BROSE PUEBLA">FORDH - BROSE PUEBLA</option>
      <option value="FORDH - THYSSENKRUP">FORDH - THYSSENKRUP</option>
      <option value="FORDH - SA AUTOMOTIVE">FORDH - SA AUTOMOTIVE</option>
      <option value="FORDH - NTN BEARING">FORDH - NTN BEARING</option>
      <option value="FORDH - CARCOUSTIC">FORDH - CARCOUSTIC</option>
      <option value="AMAZON">AMAZON</option>
      <option value="BRP">BRP</option>
      <option value="GM">GM</option>
      <option value="ACTIVE ON D">ACTIVE ON D</option>
      <option value="FCA - NARMEX">FCA - NARMEX</option>
      <option value="FCA - TI GROUP">FCA - TI GROUP</option>
      <option value="FCA - WEBASTO">FCA - WEBASTO</option>
      <option value="FCA - TENNECO">FCA - TENNECO</option>
      </select>
  </td>
  <td><input name="fecha" style="width: 90px;" type="text"  value="${
    item.fecha
  }"></td>
  <td>
  <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${
    user === "Traffic" || user === "TrafficH"
      ? "background-color: #b9e1ff;"
      : ""
  }" name="ubicacion" id="ubicacion">
      <option value="${item.ubicacion}">${item.ubicacion}</option> 
      <option value=""></option>
      <option value="TALLER EXTERNO">TALLER EXTERNO</option>
      <option value="BP NORTE">BP NORTE</option>  
      <option value="BP SUR">BP SUR</option>
      <option value="BP CLOSURES">BP CLOSURES</option>
      <option value="BP TRIM">BP TRIM</option>
      <option value="BP CLC">BP CLC</option>
      <option value="BP FRAMING">BP FRAMING</option>
      <option value="PATIO RAMOS">PATIO RAMOS</option>
      <option value="PATIO MEXICO">PATIO MEXICO</option>
      <option value="PATIO HERMSILLO">PATIO HERMSILLO</option>
      <option value="PATIO PEDRO ESCOBEDO">PATIO PEDRO ESCOBEDO</option>
      <option value="PATIO SILAO">PATIO SILAO</option>
      <option value="EN TRANSITO">EN TRANSITO</option>
      </select>
  </td>
  <td>      
    <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${
      user === "Traffic" || user === "TrafficH"
        ? "background-color: #b9e1ff;"
        : ""
    }" name="comentarios" id="comentarios">
    <option value="${item.comentarios}">${item.comentarios}</option> 
    <option value="CARGADA CON MP">CARGADA CON MP</option> 
    <option value="CARGADA CON EV">CARGADA CON EV</option>  
    <option value="PARCIAL">PARCIAL</option>
    <option value="EV - SHIPPER EN CAJA">EV - SHIPPER EN CAJA</option>
    <option value="EV - FALTA SHIPPER">EV - FALTA SHIPPER</option>
    <option value="VACIA">VACIA</option>
    <option value="DAÑADA">DAÑADA</option>
    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
    <option value="DISPONIBLE">DISPONIBLE</option>
    </select>
  </td>
  <td><input name="reporte" style="width: 200px;" type="text"  value="${
    item.reporte
  }"></td>  
  </tbody>
  
</table>
</div>
                `;
                   });
                    
           }
           modal.style.display = "block"; 
          }
       });

       d.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (localStorage.tabConveyance === "true") {
        
          if (e.target.dataset.value) {
           let keyValue = e.target.dataset.value;
              const db = getDatabase();
            let body = {
                tipo: e.target.tipo.value.toUpperCase(),
                poliza: e.target.poliza.value.toUpperCase(),
                placa: e.target.placa.value.toUpperCase(),
                inciso: e.target.inciso.value.toUpperCase(),
                modelo: e.target.modelo.value.toUpperCase(),
                año: e.target.año.value.toUpperCase(),
                caja: e.target.caja.value.toUpperCase(),
                contacto: e.target.contacto.value.toUpperCase(),
                circuito: e.target.circuito.value.toUpperCase(),
                fecha: e.target.fecha.value.toUpperCase(),
                ubicacion: e.target.ubicacion.value.toUpperCase(),
                verificacion: e.target.verificacion.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase(),
                reporte: e.target.reporte.value.toUpperCase(),
              }
  
                update(ref(db), { ["/subitem1/" + keyValue]: body });        }
                 modal.style.display = "none";
              } 

       });

    }
        
}