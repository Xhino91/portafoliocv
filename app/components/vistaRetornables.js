import {
    getDatabase,
    ref,
    get,
    onValue,
    onChildChanged,
    update,
    remove
  } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
  import { tabActive } from "./tabActive.js";
import { renderTableEV } from "./renderTableEV.js";
import { itemEV } from "./ItemEV.js";
 // Función para cargar la vista productiva para el usuario dado
 export function cargarVistaEquipoV(user) {

  const db = getDatabase(), d = document;
  const refItems = ref(db, "items");
  let modal = document.getElementById("myModal");
  let keyUpdate = null,
  updateValue = {}; 
  tabActive("equipov"); 

  get(refItems)
 .then((snapshot) => {
     if (snapshot.exists()) {
     const data = snapshot.val();
     renderTableEV(data); 
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

        d.getElementById(`${keyUpdate}`).innerHTML = `${itemEV(updateValue, keyUpdate)}`;
        d.getElementById(`${keyUpdate}`).classList.add("parpadeo");
      setTimeout(function () {
        d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
      }, 1000); 
     
    }


  if(localStorage.tabViajes === "true"){      
     onChildChanged(refItems, (snapshot) => {
       updateValue = snapshot.val();
       keyUpdate = snapshot.key;

       updateItem(updateValue, keyUpdate);
      });

      d.addEventListener("dblclick", (e) => {
        if(e.target.parentNode.tagName === "TR"){
          if (localStorage.tabViajes === "true") {
           if(localStorage.username === "CVehicular" || localStorage.username === "Public") return null;
            const db = getDatabase(),
            refItem = ref(db, `items/${e.target.parentNode.id}`);
                   
           if(!e.target.parentNode.id) return;

           onValue(refItem, (snapshot) => {
                let item = snapshot.val();
                  // console.log(item);
                  const dateConvert = (date) => {
                  let hora = date.slice(11, 17),
                      arrF = date.slice(0, 10).split("/"),
                      concatF = "";
           
                   return concatF.concat(
                     arrF[2],
                     "-",
                      arrF[1],
                     "-",
                      arrF[0],
                      "T",
                     hora
                   );
                 };
                     
                     d.getElementById("formulario-tr").dataset.value = `${e.target.parentNode.id}`;
                     d.querySelector(".modal-body-tr").innerHTML = `
                   <div class="container-fluid font" style="padding: 0;"> 
                   <table class="table table-sm" >
               <thead class="table-dark text-center">
                 <tr class="text-wrap">
                 <th scope="col">UNIDAD</th>
                 <th scope="col">CAJA</th>
                 <th scope="col">OPERADOR</th>
                 <th scope="col">C.PORTE</th>
                 <th scope="col">TRACKING</th>
                 <th scope="col">BOL / SHIPPER</th>
                 <th scope="col">RUTA</th>
                 <th scope="col">CLIENTE</th>
                 <th scope="col">PROVEEDOR</th>
                 <th scope="col">CITA PROGRAMADA</th>
                 <th scope="col">LLEGADA REAL</th>
                 <th scope="col">SALIDA REAL</th>
                 <th scope="col">ETA A DESTINO</th>
                 <th scope="col">LLEGADA A DESTINO</th>
                 <th scope="col">SALIDA A DESTINO</th>
                 <th scope="col">LLEGADA</th>
                 <th scope="col">ESTATUS</th>
                 <th scope="col">COMENTARIOS</th>
                 
             
                 </tr>
               </thead>
               <tbody class="text-center text-wrap">
               <td><input name="unidad" style="width: 35px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text" value="${item.unidad}"></td>
               <td><input name="caja" style="width: 60px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"   value="${item.caja}"></td>
               <td>
               <select class="form-select form-select-sm" style="height: 24px; width: 130px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="operador" id="operador">
               <option value="${item.operador}">${item.operador}</option> 
               <option value="ASIGNAR">ASIGNAR</option>
               <option value="ANTONIO GLENN VASQUEZ LOPEZ">ANTONIO GLENN VASQUEZ LOPEZ</option> 
               <option value="JOSE TRINIDAD ANGELES VELAZQUEZ">JOSE TRINIDAD ANGELES VELAZQUEZ</option> 
               <option value="FERNANDO MENDOZA GUTIERREZ">FERNANDO MENDOZA GUTIERREZ</option> 
               <option value="SERGIO RUBEN CAMACHO SEGOVIANO">SERGIO RUBEN CAMACHO SEGOVIANO</option> 
               <option value="CARLOS MARTIN MARTINEZ LOZA">CARLOS MARTIN MARTINEZ LOZA</option> 
               <option value="JESUS EDUARDO VARGAS CRUZ">JESUS EDUARDO VARGAS CRUZ</option> 
               <option value="JOSE JUAN CHAVEZ GOMEZ">JOSE JUAN CHAVEZ GOMEZ</option> 
               <option value="CRISTIAN ANGEL CLETO CRUZ">CRISTIAN ANGEL CLETO CRUZ</option>
               <option value="GONZALO ARMANDO RASGADO SOMBRA">GONZALO ARMANDO RASGADO SOMBRA</option> 
               <option value="EDUARDO OSVALDO CHAVEZ RODRIGUEZ">EDUARDO OSVALDO CHAVEZ RODRIGUEZ</option> 
               <option value="DYLAN ROGELIO JUAREZ SANCHEZ">DYLAN ROGELIO JUAREZ SANCHEZ</option> 
               <option value="VICTOR GONZALEZ JUAREZ">VICTOR GONZALEZ JUAREZ</option> 
               <option value="FELIPE MEJIA NOVO">FELIPE MEJIA NOVO</option> 
               <option value="MIGUEL ANGEL BOLANOS ALCANTARA">MIGUEL ANGEL BOLANOS ALCANTARA</option> 
               <option value="ALEJANDRO ESPINOZA SANTAMARIA">ALEJANDRO ESPINOZA SANTAMARIA</option> 
               <option value="ANGEL REMIGIO JUAREZ ALVAREZ">ANGEL REMIGIO JUAREZ ALVAREZ</option> 
               <option value="MIGUEL ANGEL SOLIS VEGA">MIGUEL ANGEL SOLIS VEGA</option> 
               <option value="EFRAIN BARRETO DONIZ">EFRAIN BARRETO DONIZ</option> 
               <option value="FRANCISCO JULIAN TAPIA CASASOLA">FRANCISCO JULIAN TAPIA CASASOLA</option> 
               <option value="ROGELIO JUAREZ PEREZ">ROGELIO JUAREZ PEREZ</option> 
               <option value="EDGAR RENE LOPEZ CRUZ">EDGAR RENE LOPEZ CRUZ</option> 
               <option value="OSCAR RIOS ESPINOSA">OSCAR RIOS ESPINOSA</option> 
               <option value="JUAN GARCIA GUTIERREZ">JUAN GARCIA GUTIERREZ</option> 
               <option value="ERIC VAZQUEZ ARRATIA">ERIC VAZQUEZ ARRATIA</option> 
               <option value="FERNANDO BECERRIL ALCANTARA">FERNANDO BECERRIL ALCANTARA</option> 
               <option value="ROBERTO ANGELES LAGUNAS">ROBERTO ANGELES LAGUNAS</option> 
               <option value="JOSUE ARMANDO JIMENEZ ANGELES">JOSUE ARMANDO JIMENEZ ANGELES</option> 
               <option value="MIGUEL ANGEL JUAREZ ALVAREZ">MIGUEL ANGEL JUAREZ ALVAREZ</option> 
               <option value="ARMANDO FLORES VILLAFANA">ARMANDO FLORES VILLAFANA</option> 
               <option value="DAVID ALEJANDRO MENDEZ MATA">DAVID ALEJANDRO MENDEZ MATA</option> 
               <option value="MARCO URIEL HERNANDEZ FLORES">MARCO URIEL HERNANDEZ FLORES</option> 
               <option value="GUSTAVO HERNANDEZ FLORES">GUSTAVO HERNANDEZ FLORES</option> 
               <option value="TITO AGUSTIN CARRANZA ROMERO">TITO AGUSTIN CARRANZA ROMERO</option> 
               <option value="ROBERTO CARLOS JIMENEZ VELAZQUEZ">ROBERTO CARLOS JIMENEZ VELAZQUEZ</option> 
               <option value="VICTOR MANUEL TOVAR PEREZ">VICTOR MANUEL TOVAR PEREZ</option> 
               <option value="ANGEL VASQUEZ LOPEZ">ANGEL VASQUEZ LOPEZ</option> 
               <option value="MARTIN SERRANO CERVANTES">MARTIN SERRANO CERVANTES</option> 
               <option value="JUAN MANUEL LOPEZ RAMIREZ">JUAN MANUEL LOPEZ RAMIREZ</option> 
               <option value="ABRAHAM ESPINOSA RODRIGUEZ">ABRAHAM ESPINOSA RODRIGUEZ</option> 
               <option value="JUAN BECERRIL ALCANTARA">JUAN BECERRIL ALCANTARA</option> 
               <option value="CHRISTIAN UBALDO SOLIS SANCHEZ">CHRISTIAN UBALDO SOLIS SANCHEZ</option> 
               <option value="JESUS FRANCISCO SANCHEZ BECERRA">JESUS FRANCISCO SANCHEZ BECERRA</option> 
               <option value="FERNANDO GONZALO GIL TREJO">FERNANDO GONZALO GIL TREJO</option> 
               <option value="MARGARITO GARCIA ROSAS">ARGARITO GARCIA ROSAS</option> 
               <option value="ENRIQUE CALVILLO HERNANDEZ">ENRIQUE CALVILLO HERNANDEZ</option> 
               <option value="FERNANDO GARCIA ACOSTA">FERNANDO GARCIA ACOSTA</option> 
               <option value="ISAC BARRETO CUANDON">ISAC BARRETO CUANDON</option> 
               <option value="MARCOS QUIJADA QUIJADA">MARCOS QUIJADA QUIJADA</option> 
               <option value="CESAR BERNAL GOMEZTAGLE">CESAR BERNAL GOMEZTAGLE</option> 
               <option value="LORENZO MERCADO MALDONADO">LORENZO MERCADO MALDONADO</option> 
               <option value="MIGUEL ANGEL CALVILLO ESQUIVEL">MIGUEL ANGEL CALVILLO ESQUIVEL</option> 
               <option value="JAVIER RAFAEL ISLAS">JAVIER RAFAEL ISLAS</option> 
               <option value="GUILLERMO CRUZ FRAGOSO">GUILLERMO CRUZ FRAGOSO</option> 
               <option value="SAMUEL FRAGOSO GARCIA">SAMUEL FRAGOSO GARCIA</option> 
               <option value="ANGEL FRANCISCO MENDEZ LOPEZ">ANGEL FRANCISCO MENDEZ LOPEZ</option> 
               <option value="ARMANDO SOMBRA LAZCANO">ARMANDO SOMBRA LAZCANO</option> 
               <option value="ARTURO GARCIA DAVILA">ARTURO GARCIA DAVILA</option> 
               <option value="SANTOS JULIAN SANCHEZ BECERRA">SANTOS JULIAN SANCHEZ BECERRA</option> 
               <option value="HECTOR DONOVAN CASAS COYOI">HECTOR DONOVAN CASAS COYOI</option> 
               </select>
               </td>
               <td><input name="cporte" style="width: 70px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.cporte}"></td>
               <td><input name="tracking" style="width: 90px;" type="text"  value="${item.tracking}" disabled></td>
               <td><input name="bol" style="width: 75px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.bol}"></td>
               <td><input name="ruta" style="width: 75px;" type="text"  value="${item.ruta}" ${user === "Traffic" || user === "TrafficH" ? "disabled" : ""} required></td>
               <td><input name="cliente" style="width: 150px;" type="text"  value="${item.cliente}" disabled></td>
               <td><input name="proveedor" type="text" style="width: 150px;"  value="${item.proveedor}" ${user === "Traffic" ? "disabled" : ""}></td>
               <td><input name="llegadaprogramada" style="width: 150px;" type="text" name="hour" id="hour" ${user === "Traffic" ? "disabled" : ""} value="${item.citaprogramada}"></td>
               <td><input name="llegadareal" style="width: 150px; ${user === "TrafficH" || user === "Traffic" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
               <td><input name="salidareal" style="width: 150px; ${user === "TrafficH" || user === "Traffic" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
               <td><input name="eta" style="width: 150px; ${user === "TrafficH" || user === "Traffic" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
               <td><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" || user === "Traffic" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
               <td><input name="salidadestino" style="width: 150px; ${user === "TrafficH" || user === "Traffic" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
               <td>
               <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="llegada" id="arribo">
               <option value="${item.llegada}">${item.llegada}</option> 
               <option value="A TIEMPO">A TIEMPO</option>  
               <option value="TARDE">TARDE</option>
               <option value="DESFASADA">DESFASADA</option>
               <option value="CRITICA">CRITICA</option>
               </select>
               </td>
               <td>
               <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${
                 user === "Traffic" || user === "TrafficH"
                   ? "background-color: #b9e1ff;"
                   : ""
               }" name="status" id="status">
               <option value="${item.status}">${item.status}</option> 
               <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
               <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
               <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
               <option value="TRANSITO A FORD SUPPLIER CITY">TRANSITO A SUPPLIER CITY</option>
               <option value="TRANSITO A FORD DHL">TRANSITO A FORD DHL</option>
               <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
               <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
               <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
               <option value="TRANSITO A GM">TRANSITO A GM</option>
               <option value="TRANSITO A BRP">TRANSITO A BRP</option>
               <option value="EXPEDITADO EN TRANSITO">EXPEDITADO EN TRANSITO</option>
               <option value="EXPEDITADO CARGANDO">EXPEDITADO CARGANDO</option>
               <option value="EXPEDITADO DESCARGANDO">EXPEDITADO DESCARGANDO</option>
               <option value="EXPEDITADO COMPLETO">EXPEDITADO COMPLETO</option>
               <option value="DETENIDO">DETENIDO</option>
               <option value="PENDIENTE">PENDIENTE</option>
               <option value="CARGANDO">CARGANDO</option>
               <option value="DESCARGANDO">DESCARGANDO</option>
               <option value="EN ESPERA">EN ESPERA</option>
               <option value="DRY RUN">DRY RUN</option>
               <option value="BROKEREADO">BROKEREADO</option>
               <option value="TONU">TONU</option>
               <option value="CANCELADO">CANCELADO</option>
               <option value="COMPLETO">COMPLETO</option>
               </td>
               <td>
               <input name="comentarios" style="width: 150px; ${
                 user === "Traffic" || user === "TrafficH"
                   ? "background-color: #b9e1ff;"
                   : ""
               }" type="text"  value="${item.comentarios}">
               </td>    
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
    
        if (e.target.matches(".edit-tr")) {
          if (localStorage.tabViajes === "true") {
            if (e.target.dataset.value) {
              let keyValue = e.target.dataset.value;
              const db = getDatabase();
              const dateConvert = (date) => {
                let hora = date.slice(11, 17),
                  arrF = date.slice(0, 10).split("-"),
                  concatF = "";
    
                return concatF.concat(
                  arrF[2],
                  "/",
                  arrF[1],
                  "/",
                  arrF[0],
                  " ",
                  hora
                );
              };
    
              let body = {
                unidad: e.target.unidad.value.toUpperCase(),
                caja: e.target.caja.value.toUpperCase(),
                cporte: e.target.cporte.value.toUpperCase(),
                tracking: e.target.tracking.value.toUpperCase(),
                bol: e.target.bol.value.toUpperCase(),
                ruta: e.target.ruta.value.toUpperCase(),
                operador: e.target.operador.value.toUpperCase(),
                cliente: e.target.cliente.value.toUpperCase(),
                proveedor: e.target.proveedor.value.toUpperCase(),
                citaprogramada: e.target.llegadaprogramada.value,
                llegadareal: dateConvert(e.target.llegadareal.value),
                salidareal: dateConvert(e.target.salidareal.value),
                eta: dateConvert(e.target.eta.value),
                llegadadestino: dateConvert(e.target.llegadadestino.value),
                salidadestino: dateConvert(e.target.salidadestino.value),
                llegada: e.target.llegada.value.toUpperCase(),
                status: e.target.status.value.toUpperCase(),
                comentarios: e.target.comentarios.value.toUpperCase(),
              };
    
              update(ref(db), { ["/items/" + keyValue]: body });
              modal.style.display = "none";
            }
          }
        }
      });
    }    
    
    
}