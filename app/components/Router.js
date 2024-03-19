import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  push,
  update,
  remove,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { generar_xls } from "../helpers/generar_xls.js";
import { renderTable } from "./renderTable.js";
import { renderTableCV } from "./renderTableCV.js";
import { renderTableUnits } from "./renderTableUnits.js";
import { renderTableEV } from "./renderTableEV.js";
import { renderTableHistory } from "./renderTableHistory.js";
import { tabActive } from "./tabActive.js";
import dropAreaLabel from "../helpers/dropArea.js";
import { generatePDF } from "../helpers/generatePDF.js";

import { cargarVistaHistorial } from "../components/vistaHistorial.js";
import { cargarVistaProductiva } from "../components/vistaProductivos.js";
import { cargarVistaRemolques } from "../components/vistaRemolques.js";
import { cargarVistaEquipoV } from "../components/vistaRetornables.js";
import { cargarVistaUnidades } from "../components/vistaUnidades.js";
import { Login } from "./login.js";




export async function Router() {
  const d = document,
       db = getDatabase(); 
  let modal = document.getElementById("myModal"),
      span = document.getElementsByClassName("close")[0],
      dbXlsx, date = new Date();

  function cambiarVista(user, hash) {

        switch (hash) {
            case "#/":
                window.location.hash = "#/login";
                sessionStorage.login = false;
                localStorage.clear();
                Login();
                break;

            case "#/productivo":
    
                cargarVistaProductiva(user);
                break;
            case "#/equipov":
    
                cargarVistaEquipoV(user);
                break;
            case "#/history":
    
                cargarVistaHistorial(user);
                break;
            case "#/cajas":
    
                cargarVistaRemolques(user);
                break;
            case "#/unidades":
    
                cargarVistaUnidades(user);
                break;
    
            default:
                // Vista no válida
                console.error("Vista no válida");
        }
    }

  function handleFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Puedes acceder a las hojas del libro de trabajo
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir el contenido de la hoja a un objeto JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // console.log(jsonData);
        dbXlsx = jsonData;
      };

      reader.readAsArrayBuffer(file);
    }
  }


   let  user = localStorage.username,
  hash = window.location.hash;
    cambiarVista(user, hash);
 /*if (hash === "#/" + user + "/productivo") {
    tabActive("tablero"); 
    const refItems = ref(db, "items");
    onValue(refItems, (snapshot) => {
      let res = snapshot.val();
      renderTable(res);   
      childChange(refItems);
      updateItem(updateValue, keyUpdate);
      keyUpdate = "",
      updateValue = {};                
    });
  } else if (hash === "#/" + user + "/equipov") {
    tabActive("equipov");
    const refItems = ref(db, "items");
    onValue(refItems, (snapshot) => {
      let res = snapshot.val();
      renderTableEV(res);
      childChange(refItems);
      updateItem(updateValue, keyUpdate);
      keyUpdate = "",
      updateValue = {};
    });
  } else if (hash === "#/" + user + "/history") {
    tabActive("history");
    const refItems = ref(db, "items");
    onValue(refItems, (snapshot) => {
      let res = snapshot.val();
      renderTableHistory(res);
      childChange(refItems);
      updateItem(updateValue, keyUpdate);
      keyUpdate = "",
      updateValue = {};
    });
  } else if (hash === "#/" + user + "/cajas") {
    tabActive("cajas");
    const refItems = ref(db, "subitem1");
    onValue(refItems, (snapshot) => {
      let res = snapshot.val();
      renderTableCV(res);
      childChange(refItems);
      updateItem(updateValue, keyUpdate);
      keyUpdate = "",
      updateValue = {};
    });
  } else if (hash === "#/" + user + "/unidades") {
    tabActive("unidades");
    const refItems = ref(db, "subitem");
    onValue(refItems, (snapshot) => {
      let res = snapshot.val();
      renderTableUnits(res);
      childChange(refItems);
      updateItem(updateValue, keyUpdate);
      keyUpdate = "",
      updateValue = {};
    });
  } else return;*/

  
  d.addEventListener("click", async (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
    //Active-select TR
    if(e.target.parentNode.tagName === "TR" && e.target.parentNode.id && e.target.id !== "dropArea"){
      let tr = e.target.parentNode;
      //console.log(tr);
      if(tr.classList.contains("active-select")){
        tr.classList.remove("active-select");  
      }else{
        let trSelect = d.querySelectorAll("tr");
        trSelect.forEach((tr)=>{
            tr.classList.remove("active-select");
        })
        tr.classList.add("active-select");
      }
    }
    
    if (e.target.matches(".importXlsx")) {
      dbXlsx.forEach((item) => {
        // console.log(item);
        let hora = item[3].slice(11, 17),
          arrF = item[3].slice(1, -6).split("/"),
          concatF = "";
        item[3] = concatF.concat(
          arrF[1],
          "/0",
          arrF[0],
          "/",
          arrF[2],
          " ",
          hora
        );
      });

      // Mostrar el resultado en la consola o en la página //Manipulacion de los Datos
      dbXlsx.forEach(async (element) => {
        //  console.log(element[1]);

        if (element[1].match("24") || element[1].match("HS")) {
          //console.log(element[1]);

          let body = {
            unidad: "",
            caja: "",
            cporte: "",
            tracking: `${element[0]}`,
            bol: "",
            ruta: `${element[1]}`,
            operador: "",
            cliente: "FORD HERMOSILLO",
            proveedor: `${element[2]}`,
            citaprogramada: `${element[3]}`,
            llegadareal: "01/01/0001 00:00",
            salidareal: "01/01/0001 00:00",
            eta: "01/01/0001 00:00",
            llegadadestino: "01/01/0001 00:00",
            salidadestino: "01/01/0001 00:00",
            llegada: "A TIEMPO",
            status: "PENDIENTE",
            comentarios: "SIN COMENTARIOS",
          };
          push(ref(db, "items"), body);

          /* await ajax({
       url: `${api.ITEMS}.json`,
       options,
       cbSuccess: (res) => {
         json = res.json();
       },
     });
         */
        } else if (
          element[1].match("23") ||
          element[1].match("CU") ||
          element[1].match("DH")
        ) {
          //console.log(element[1]);

          let body = {
            unidad: "",
            caja: "",
            cporte: "",
            tracking: `${element[0]}`,
            bol: "",
            ruta: `${element[1]}`,
            operador: "",
            cliente: "FORD CUAUTITLAN",
            proveedor: `${element[2]}`,
            citaprogramada: `${element[3]}`,
            llegadareal: "01/01/0001 00:00",
            salidareal: "01/01/0001 00:00",
            eta: "01/01/0001 00:00",
            llegadadestino: "01/01/0001 00:00",
            salidadestino: "01/01/0001 00:00",
            llegada: "A TIEMPO",
            status: "PENDIENTE",
            comentarios: "SIN COMENTARIOS",
          };
          push(ref(db, "items"), body);
        } else if (element[1].match("GMMEX")) {
          //console.log(element[1]);

          let body = {
            unidad: "",
            caja: "",
            cporte: "",
            tracking: `${element[0]}`,
            bol: "",
            ruta: `${element[1]}`,
            operador: "",
            cliente: "GM",
            proveedor: `${element[2]}`,
            citaprogramada: `${element[3]}`,
            llegadareal: "01/01/0001 00:00",
            salidareal: "01/01/0001 00:00",
            eta: "01/01/0001 00:00",
            llegadadestino: "01/01/0001 00:00",
            salidadestino: "01/01/0001 00:00",
            llegada: "A TIEMPO",
            status: "PENDIENTE",
            comentarios: "SIN COMENTARIOS",
          };
          push(ref(db, "items"), body);
        } else if (element[2].match("MEX3")) {
          //console.log(element[1]);

          let body = {
            unidad: "",
            caja: "",
            cporte: "",
            tracking: `${element[0]}`,
            bol: "",
            ruta: `${element[1]}`,
            operador: "",
            cliente: "AMAZON",
            proveedor: `${element[2]}`,
            citaprogramada: `${element[3]}`,
            llegadareal: "01/01/0001 00:00",
            salidareal: "01/01/0001 00:00",
            eta: "01/01/0001 00:00",
            llegadadestino: "01/01/0001 00:00",
            salidadestino: "01/01/0001 00:00",
            llegada: "A TIEMPO",
            status: "PENDIENTE",
            comentarios: "SIN COMENTARIOS",
          };
          push(ref(db, "items"), body);
        } else if (element[1].match("BRP")) {
          //console.log(element[1]);

          let body = {
            unidad: "",
            caja: "",
            cporte: "",
            tracking: `${element[0]}`,
            bol: "",
            ruta: `${element[1]}`,
            operador: "",
            cliente: "BRP",
            proveedor: `${element[2]}`,
            citaprogramada: `${element[3]}`,
            llegadareal: "01/01/0001 00:00",
            salidareal: "01/01/0001 00:00",
            eta: "01/01/0001 00:00",
            llegadadestino: "01/01/0001 00:00",
            salidadestino: "01/01/0001 00:00",
            llegada: "A TIEMPO",
            status: "PENDIENTE",
            comentarios: "SIN COMENTARIOS",
          };
          push(ref(db, "items"), body);
        }
      });
    } else if (e.target.matches(".modal_xls")) {
      if (localStorage.tabViajes === "true") {
        d.querySelector(".export-modal-body").innerHTML = `
    <section id="thtable" class="thtable">
    <table class="table table-hover table-sm" id="table_xls">
    <thead class="table-dark text-center align-middle">
    <tr style="background-color:black; color:white;">
    <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString(
      "es-MX",
      { weekday: "long", year: "numeric", month: "short", day: "numeric" }
    )}</td>  
    </tr>
    <tr style="background-color:black; color:white;">
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
    <th scope="col">ETA</th>
    <th scope="col">LLEGADA A DESTINO</th>
    <th scope="col">SALIDA A DESTINO</th>
    <th scope="col">LLEGADA</th>
    <th scope="col">ESTATUS</th>
    <th scope="col">COMENTARIOS</th>  
    </tr>
    </thead>
    <tbody id="table_bodyX" class="body_table">
    </tbody>     
    </table>
    </section>
    `;

        //Helper de acceso a los items
        const $tr = d.querySelectorAll(".item");
        const lisTr = Array.from($tr);

        lisTr.forEach((e) => {
          if (e.classList[5] === "filter") {
            return;
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);
        });

        d.querySelectorAll(".btn-hid").forEach(
          (e) => (e.style.display = "none")
        );
      } else if (localStorage.tabConveyance === "true") {
        d.querySelector(".export-modal-body").innerHTML = `
      <section id="thtable" class="thtable">
      <table class="table table-hover table-sm" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr style="background-color:black; color:white;">
      <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString(
        "es-MX",
        { weekday: "long", year: "numeric", month: "short", day: "numeric" }
      )}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
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
      <th scope="col">DIAS DETENIDO</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>  
      <th scope="col">REPORTE</th> 
      </tr>
      </thead>
      <tbody id="table_bodyX" class="body_table">
      </tbody>     
      </table>
      </section>
      `;

        //Helper de acceso a los items
        const $tr = d.querySelectorAll(".item");
        const lisTr = Array.from($tr);

        lisTr.forEach((e) => {
          if (e.classList[5] === "filter") {
            return;
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);
        });

        d.querySelectorAll(".btn-hid").forEach(
          (e) => (e.style.display = "none")
        );
      } else if (localStorage.tabUnit === "true") {
        d.querySelector(".export-modal-body").innerHTML = `
        <section id="thtable" class="thtable">
        <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString(
          "es-MX",
          { weekday: "long", year: "numeric", month: "short", day: "numeric" }
        )}</td>  
        </tr>
        <tr style="background-color:black; color:white;">
        <th scope="col">UNIDAD</th>
        <th scope="col">MARCA</th>
        <th scope="col">PLACA</th>
        <th scope="col">AÑO</th>
        <th scope="col">NO. SERIE</th>
        <th scope="col">NO. POLIZA</th>
        <th scope="col">INCISO</th>
        <th scope="col">FECHA ÚLTIMO SERVICIO</th>
        <th scope="col">KM ÚLTIMO SERVICIO</th>
        <th scope="col">KM PRÓXIMO SERVICIO</th>
        <th scope="col">KM ODOMETRO</th>
        <th scope="col">KM PARA SERVICIO</th>
        <th scope="col">MTTO PREVENTIVO</th>
        <th scope="col">CIRCUITO</th>
        <th scope="col">FECHA</th>
        <th scope="col">UBICACION</th> 
        <th scope="col">ESTATUS</th>   
        </tr>
        </thead>
        <tbody id="table_bodyX" class="body_table">
        </tbody>     
        </table>
        </section>
        `;

        //Helper de acceso a los items
        const $tr = d.querySelectorAll(".item");
        const lisTr = Array.from($tr);

        lisTr.forEach((e) => {
          if (e.classList[5] === "filter") {
            return;
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);
        });

        d.querySelectorAll(".btn-hid").forEach(
          (e) => (e.style.display = "none")
        );
      }
    } else if (e.target.matches(".cancelXls") || e.target.matches(".report")) {
      location.reload();
    } else if (e.target.matches(".alert3") || e.target.matches(".fa-bell")) {
      if (localStorage.tabViajes === "true") {
        const db = getDatabase(),
        refItem = await ref(db, `items/${e.target.id}`);

        d.querySelector(".hidden").style.display = "block";
     
        onValue(refItem, (snapshot) => {
          let item = snapshot.val();
   
          d.querySelector(".modal").style.height= "90vh";
          d.querySelector(".modal").style.margin= "2%";
          d.getElementById("bt-save").innerHTML= `Generar PDF`;
          d.getElementById("formulario").classList.add("alert35");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Generar Alarma 3.5`;
          d.querySelector(".modal-body").style.width = "100%";
          d.querySelector(".modal-body").innerHTML = `
        <div class="container-fluid font" style="padding: 1rem 30rem 0rem 30rem;"> 
        <table class="tableAlarm">

          <thead>
          <tr class="trhead"><th>ALARMA 3.5</th><th></th></tr>
         </thead>

          <tbody class="tbody-alarm">          
          <tr>
          <th>Coordinador en turno:</th>
          <td><input id="coordinador" name="coordinador" type="text"  value=""></td>
          </tr>
          <tr>
          <th>Nomenclatura Ruta:</th>
          <td><input id="ruta" name="ruta" type="text"  value="${item.ruta}"></td>
          </tr>
          <tr>
          <th>Load ID:</th>
          <td><input id="load" name="tracking" type="text"  value="${item.tracking}" ></td>
          </tr>
          <tr>
          <th>Fecha/Hora recolección:</th>
          <td><input id="citaprogramada" name="citaprogramada" type="text"  value="${item.citaprogramada}"></td>
          </tr>
          <tr>
          <th>Carrier SCAC:</th>
          <td><input id="scac" name="scac" type="text"  value="${item.cliente.match("FORD") ? "ILOG" : "IVEY"}"></td>
          </tr>
          <tr>
          <th>Trailer #:</th>
          <td><input id="rem" name="unidad" type="text"  value="${item.caja}" ></td>
          </tr>
          <tr><th>Ubicación actual:</th><td><input id="ubicacion" name="ubicacion" type="text"  value=""></td></tr>
          <tr><th>Razón del retraso:</th><td><input id="razon" name="razon" type="text"  value="" ></td></tr>
          <tr><th>Código - Coordenadas:</th><td><input id="coordenadas" name="coordenadas" type="text"  value="" ></td></tr>
          <tr>
          <th>Recolección Dia/Hora:</th>
          <td><input id="recoleccion" name="recoleccion" type="text"  value="${item.llegadareal}" ></td>
          </tr>
          <tr>
          <th>Descarga Dia/Hora:</th>
          <td><input id="descarga" name="descarga" type="text"  value="${item.llegadadestino}" ></td>
          </tr>
          <tr><th>Nuevo ETA a Destino:</th><td><input id="etadestino" name="etadestino" type="text"  value="" ></td></tr>
          <tr><th>Plan de recuperación:</th><td><input id="planrecuperacion" name="planrecuperacion" type="text"  value="" ></td></tr>
          <tr><th>Distancia (KMS) a Destino:</th><td><input id="distanciakm" name="distanciakm" type="text"  value=""></td></tr>
          <tr>
          <th>Proveedor/Ciudad de origen:</th>
          <td><input id="proveedor" name="proveedor" type="text"  value="${item.proveedor}"></td>
          </tr>
          <tr>
          <th>Numero de planta/Nombre:</th>
          <td><input id="cliente" name="cliente" type="text"  value="${item.cliente}"></td>
          </tr>
          <tr><th>DOCK de Descarga:</th><td><input id="descargadock" name="descargadock" type="text"></td></tr>
          <tr id="imageDropArea"><td colspan="2" id="dropArea">Arrastra y suelta una imagen aquí</td></tr>
        
        </tbody>

        </table>
         </div>
        `;
        });
        dropAreaLabel();
      } else return;
    } else if (e.target.matches(".ordenServ") || e.target.matches(".fa-triangle-exclamation")) {
      if (localStorage.tabConveyance === "true") {
        const db = getDatabase(),
        refItem = await ref(db, `subitem1/${e.target.id}`);

        d.querySelector(".hidden").style.display = "block";
     
        onValue(refItem, (snapshot) => {
          let item = snapshot.val();
   
          d.querySelector(".modal").style.height= "90vh";
          d.querySelector(".modal").style.margin= "2%";
          d.getElementById("bt-save").innerHTML= `Generar Orden`;
          d.getElementById("formulario").classList.add("ordenS");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Orden de Trabajo`;
          d.querySelector(".modal-body").style.width = "100%";
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font" style="padding: 1rem 30rem 0rem 30rem;"> 
          <table class="tableAlarm">

          <thead>
          <tr class="trhead" style="font-size: 12px"><th>REPORTE DE CAJA DAÑADA</th><th style="text-align: end;">INTLOGIS MÉXICO</th></tr>
          </thead>
 
          <tbody class="tbody-alarm">          
             
          <tr>
          <th>FOLIO:</th>
          <td><input id="folio" name="folio" type="text"  value=""></td>
          </tr>

          <tr>
          <th>FECHA:</th>
          <td><input id="fecha" name="fecha" type="text"  value="${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}"></td>
          </tr>

          <tr>
          <th>CIRCUITO:</th>
          <td><input id="circuito" name="circuito" type="text"  value="${item.circuito}"></td>
          </tr>

          <tr>
          <th>REMOLQUE:</th>
          <td><input id="remolque" name="remolque" type="text"  value="${item.caja}" ></td>
          </tr>

          
          <tr>
          <th>CONTENIDO:</th>
          <td><input id="contenido" name="remolque" type="text"  value="${item.comentarios}" ></td>
          </tr>

          <tr>
          <th>SERVICIO A EFECTUAR:</th>
          <td><input id="servicio" name="servicio" type="text"  value="" ></td>
          </tr>

          <tr>
          <th>PERSONAL EN TURNO:</th>
          <td><input id="personal" name="personal" type="text"  value="" ></td>
          </tr>
         
          <tr>
          <th>RESPONSABLE.:</th>
          <td><input id="resMtto" name="resmtto" type="text" value="Andres Loperena"></td>
          </tr>

          <tr id="imageDropArea">
          <td colspan="2" id="dropArea">Arrastra y suelta imagen aquí</td>
          </tr>
        
          </tbody>

          </table>
           </div>
           `;
        });
        dropAreaLabel();
      } else if (localStorage.tabUnit === "true") {
        const db = getDatabase(),
        refItem = await ref(db, `subitem/${e.target.id}`);

        d.querySelector(".hidden").style.display = "block";
     
        onValue(refItem, (snapshot) => {
          let item = snapshot.val();
   
          d.querySelector(".modal").style.height= "90vh";
          d.querySelector(".modal").style.margin= "2%";
          d.getElementById("bt-save").innerHTML= `Generar Orden`;
          d.getElementById("formulario").classList.add("ordenSU");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Orden de Trabajo`;
          d.querySelector(".modal-body").style.width = "100%";
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font" style="padding: 1rem 30rem 0rem 30rem;"> 
          <table class="tableAlarm">

          <thead>
          <tr class="trhead"><th>Orden de Trabajo</th><th></th></tr>
          </thead>
 
          <tbody class="tbody-alarm">          
             
          <tr>
          <th>Folio:</th>
          <td><input id="folio" name="folio" type="text"  value=""></td>
          </tr>

          <tr>
          <th>Fecha:</th>
          <td><input id="fecha" name="fecha" type="text"  value="${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}"></td>
          </tr>

          <tr>
          <th>Unidad:</th>
          <td><input id="unidad" name="unidad" type="text"  value="${item.unidad}"></td>
          </tr>

          <tr>
          <th>Servicio a Efectuar:</th>
          <td><input id="servicio" name="servicio" type="text"  value="" ></td>
          </tr>

          <tr>
          <th>Operador:</th>
          <td><input id="operador" name="operador" type="text"  value="" ></td>
          </tr>
         
          <tr>
          <th>Responsable de Mtto.:</th>
          <td><input id="resMtto" name="resmtto" type="text" value="Andres Loperena"></td>
          </tr>

          <tr id="imageDropArea">
          <td colspan="2" id="dropArea">Arrastra y suelta una imagen aquí</td>
          </tr>
        
          </tbody>

          </table>
           </div>
           `;
        });
        dropAreaLabel();
      } else return;
    } else if (e.target.matches(".tablero")) {
      window.location.hash = "/productivo";
      
 
    } else if (e.target.matches(".equipov")) {
      window.location.hash = "/equipov";

    } else if (e.target.matches(".history")) {
      window.location.hash = "/history";

    } else if (e.target.matches(".cajas")) {
      window.location.hash = "/cajas";
  
    } else if (e.target.matches(".unidades")) {
      window.location.hash = "/unidades";

    } else if (e.target.matches(".remolque")) {
      //  console.log(e.target);

      const tabConv = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Remolque`;
      d.getElementById("exampleModalLabel").classList.add("convoy");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">CAJA</th>
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
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="caja" style="width: 35px;" type="text"></td>
    <td><input name="tipo" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="contacto" type="text" style="width: 80px;"></input></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };      

      tabConv();
      
    } else if (e.target.matches(".unidad")) {
      const tabUnit = ()=> {
        //MODAL
      d.querySelector(".hidden").style.display = "block";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.getElementById("exampleModalLabel").innerHTML = `Registrar Unidad`;
      d.getElementById("exampleModalLabel").classList.add("unit");
      d.getElementById("exampleModalLabel").classList.remove("convoy");
      d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid"> 
          <table class="table table-sm" >
      <thead class="table-dark text-center">
      <tr class="text-wrap">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MODELO</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
       <th scope="col">VERIFICACION</th>
       <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">CIRCUITO</th>
      <th scope="col">FECHA</th>
      <th scope="col">UBICACION</th> 
      <th scope="col">ESTATUS</th>
  
      </tr>
    </thead>
    <tbody class="text-center text-wrap">
    <td><input name="unidad" style="width: 35px;" type="text"></td>
    <td><input name="operador" style="width: 60px;" type="text"></td>
    <td><input name="modelo" style="width: 130px;" type="text"></td>
    <td><input name="placa" style="width: 70px;" type="text"></td>
    <td><input name="año" style="width: 80px;" type="text"></td>
    <td><input name="verificacion" style="width: 75px;" type="text"></td>
    <td><input name="poliza" style="width: 75px;" type="text"></td>
    <td><input name="inciso" style="width: 95px;" type="text"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
      };

      tabUnit();
    } else if (e.target.matches(".reg")) {
      //  console.log(e.target);
      //MODAL REGISTRO DE VIAJES
      d.querySelector(".hidden").style.display = "block";
      d.querySelector(".modal").style.height= "25vh";
      d.querySelector(".modal").style.margin= "2%";
      d.getElementById("formulario").classList.add("register");
      d.getElementById("formulario").classList.remove("edit");
      d.querySelector(".modal-header").style.padding = "3px 15px 6px 25px";
      d.querySelector(".modal-title").style.fontSize = "17px";
      d.querySelector(".modal-footer").style.padding = "0px 8px 1px 1px";
      d.getElementById("exampleModalLabel").innerHTML = `Programación de rutas`;
      d.querySelector(".modal-body").innerHTML = `
       <div class="container-fluid font"> 
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
   <tbody class="text-center text-wrap" >
   <td><input name="unidad" style="width: 35px;" type="text"></input></td>
   <td><input name="caja" style="width: 60px;" type="text"></input></td>
   <td><input name="operador" style="width: 130px;" type="text"></input></td>
   <td><input name="cporte" style="width: 70px;" type="text"></input></td>
   <td><input name="tracking" style="width: 80px;" type="text"></input></td>
   <td><input name="bol" style="width: 75px;" type="text"></input></td>
   <td><input id="ruta" name="ruta" style="width: 75px;" type="text"></input></td>
   <td>
   <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="cliente" id="cliente">
     <option value="FORD CUAUTITLAN">FORD CUAUTITLAN</option>
     <option value="FORD HERMOSILLO">FORD HERMOSILLO</option>
     <option value="MULTILOG">MULTILOG</option>
     <option value="GM">GM</option>
     <option value="STELLANTIS">STELLANTIS</option>
     <option value="ACTIVE">ACTIVE</option>
     <option value="BRP">BRP</option>
     <option value="AMAZON">AMAZON</option>
   </td>
   <td><input id="proveedor" name="proveedor" type="text" style="width: 80px;"></input></td>
   <td><input id="citaprogramada" name="citaprogramada" type="datetime-local" ></td>
   <td><input id="llegadareal" name="llegadareal" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
   <td><input id="salidareal" name="salidareal" style="width: 90px;" type="text" value="01/01/0001 00:00"disabled></td>
   <td><input id="eta" name="eta" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
   <td><input id="llegadadestino" name="llegadadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
   <td><input id="salidadestino" name="salidadestino" style="width: 90px;" type="text" value="01/01/0001 00:00" disabled></td>
   <td>
   <select class="form-select form-select-sm" name="llegada" id="arribo" style="width: 100px; height: 24px; font-size: 12px;">
    <option value="A TIEMPO" selected>A TIEMPO</option>
   <option value="TARDE" >TARDE</option>
   <option value="DESFASADA" >DESFASADA</option>
   <option value="CRITICA" >CRITICA</option>
   </select>
   </td>
   <td>
   <select class="form-select form-select-sm" style="width: 150px; height: 24px; font-size: 12px;" name="status" id="status">
     <option value="PENDIENTE">PENDIENTE</option>
     <option value="TRANSITO A PROVEEDOR">TRANSITO A PROVEEDOR</option>
     <option value="TRANSITO A FORD HMO">TRANSITO A FORD HMO</option>
     <option value="TRANSITO A FORD CSAP">TRANSITO A FORD CSAP</option>
     <option value="TRANSITO A FCA TOL">TRANSITO A FCA TOL</option>
     <option value="TRANSITO A FCA SAL">TRANSITO A FCA SAL</option>
     <option value="TRANSITO A FEMSA">TRANSITO A FEMSA</option>
     <option value="DETENIDO">DETENIDO</option>
     <option value="CARGANDO">CARGANDO</option>
     <option value="EN ESPERA">EN ESPERA</option>
     <option value="DRY RUN">DRY RUN</option>
     <option value="TONU">TONU</option>
     <option value="CANCELADO">CANCELADO</option>
     <option value="COMPLETO">COMPLETO</option>
   </td>
   <td>
   <input name="comentarios" style="width: 130px;" type="text"  value="SIN COMENTARIOS">
   </td>    
   </tbody>
   
 </table>
 </div>
       `;
    } else if (e.target.matches(".generar_xls")) {
      //let $dataTable = d.getElementById("table_xls");
      generar_xls("table_xls", "Reporte");
    }
    return;
  });
  d.getElementById("excelFileInput").addEventListener("change", (e) => {
    if (e.target.matches("#excelFileInput")) {
      //  console.log(e.target);
      handleFile(e);
    }
  });
  d.addEventListener("submit", async (e) => {
    e.preventDefault();
  // console.log(e.target);

    if (e.target.matches(".search-form") && localStorage.tabViajes === "true") {
      //console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();

      //console.log(query);

      let item = d.querySelectorAll(".item");
      item.forEach((e) => {
        //console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } else if (
          e.dataset.unit.includes(query) ||
          e.dataset.box.includes(query) ||
          e.dataset.operador.includes(query) ||
          e.dataset.cporte.includes(query) ||
          e.dataset.track.includes(query) ||
          e.dataset.ruta.includes(query) ||
          e.dataset.cliente.includes(query) ||
          e.dataset.proveedor.includes(query) ||
          e.dataset.citaprogramada.includes(query) ||
          e.dataset.status.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
      });
    } else if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
      //   console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();

      //  console.log(query);

      let item = d.querySelectorAll(".item");
      item.forEach((e) => {
        //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } else if (
          e.dataset.conv.includes(query) ||
          e.dataset.circuito.includes(query) ||
          e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
      });
    } else if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
      // console.log(e.target);
      let query = localStorage.getItem("apiSearch").toUpperCase();

      //console.log(query);

      let item = d.querySelectorAll(".item");
      item.forEach((e) => {
        //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
        if (!query) {
          e.classList.remove("filter");
          return false;
        } else if (
          e.dataset.unit.includes(query) ||
          e.dataset.circuito.includes(query) ||
          e.dataset.ubicacion.includes(query)
        ) {
          e.classList.remove("filter");
        } else {
          e.classList.add("filter");
        }
      });
    } else if (e.target.matches(".register")){
      //Create Register
      if (localStorage.tabUnit == "true") {
        if (!e.target.id.value) {
          let body = {
            verificacion: e.target.verificacion.value.toUpperCase(),
            poliza: e.target.poliza.value.toUpperCase(),
            inciso: e.target.inciso.value.toUpperCase(),
            placa: e.target.placa.value.toUpperCase(),
            operador: e.target.operador.value.toUpperCase(),
            modelo: e.target.modelo.value.toUpperCase(),
            año: e.target.año.value.toUpperCase(),
            unidad: e.target.unidad.value.toUpperCase(),
            contacto: "1",
            uservicio: "1",
            linker: "1",
            circuito: e.target.circuito.value.toUpperCase(),
            fecha: e.target.fecha.value.toUpperCase(),
            ubicacion: e.target.ubicacion.value.toUpperCase(),
            comentarios: e.target.comentarios.value.toUpperCase(),
          };
          await push(ref(db, "subitem"), body);
          /* await ajax({
        url: `${api.ITEMS}.json`,
        options,
        cbSuccess: (res) => {
          json = res.json();
        },
       });*/
        }
      }
      if (localStorage.tabViajes == "true") {
        if (!e.target.id.value) {
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

          let fecha = dateConvert(e.target.citaprogramada.value);

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
            citaprogramada: fecha,
            llegadareal: e.target.llegadareal.value,
            salidareal: e.target.salidareal.value,
            eta: e.target.eta.value,
            llegadadestino: e.target.llegadadestino.value,
            salidadestino: e.target.salidadestino.value,
            llegada: e.target.llegada.value.toUpperCase(),
            status: e.target.status.value.toUpperCase(),
            comentarios: e.target.comentarios.value.toUpperCase(),
          };
          await push(ref(db, "items"), body);
          /* await ajax({
         url: `${api.ITEMS}.json`,
         options,
         cbSuccess: (res) => {
           json = res.json();
         },
        });*/
        }
      }
      if (localStorage.tabConveyance === "true") {
        if (!e.target.id.value) {
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
            reporte: "SIN REPORTE",
          };
         await push(ref(db, "subitem1"), body);
        }
      }

      // console.log(e.target);
    
    } else if (e.target.matches(".alert35")){
     // console.log(e.target);
      const dataAlert = { $ruta: document.getElementById('ruta').value.toUpperCase(),
      $load: document.getElementById('load').value.toUpperCase(),
      $citaprogramada: document.getElementById('citaprogramada').value,
      $scac: document.getElementById('scac').value.toUpperCase(),
      $rem: document.getElementById('rem').value,
      $ubicacion: document.getElementById('ubicacion').value.toUpperCase(),
      $razon: document.getElementById('razon').value.toUpperCase(),
      $coordenadas: document.getElementById('coordenadas').value,
      $recoleccion: document.getElementById('recoleccion').value,
      $descarga: document.getElementById('descarga').value,
      $etadestino: document.getElementById('etadestino').value,
      $planrecuperacion: document.getElementById('planrecuperacion').value.toUpperCase(),
      $distanciakm: document.getElementById('distanciakm').value,
      $proveedor: document.getElementById('proveedor').value.toUpperCase(),
      $cliente: document.getElementById('cliente').value.toUpperCase(),
      $descargadock: document.getElementById('descargadock').value.toUpperCase(),
      $coordinador: document.getElementById('coordinador').value.toUpperCase()
      }

      generatePDF(dataAlert, "/app/assets/Alert35.jpg", date.toLocaleDateString('es-MX', { year:"numeric", month:"short", day:"numeric"}));



    } else if (e.target.matches(".ordenS")){
      // console.log(e.target);
    // Obtener los valores de los campos de entrada
    const folio = d.getElementById('folio').value;
    const fecha = d.getElementById('fecha').value;
    const remolque = d.getElementById('remolque').value;
    const servicio = d.getElementById('servicio').value;
    const personal = d.getElementById('personal').value;
    const resMtto = d.getElementById('resMtto').value;
    const circuito = d.getElementById('circuito').value;
    const contenido = d.getElementById('contenido').value;
    const coordinador = d.getElementById('coordinador').value;

    // Definir los datos de la tabla
    const data = [
      [`REMOLQUE: ${remolque}`,`CIRCUITO:`, `${circuito}`],
      [ `CONTENIDO:`, `${contenido}`, ''],
      [`PERSONAL EN TURNO: ${personal}`, `MANTENIMIENTO: ${resMtto}`],
      [`SERVICIO A REALIZAR: ${servicio}`]
    ];

      const margen = 10; // Ajusta el margen según sea necesario
      const grosorBorde = 1;
      
      // Agregar el margen al PDF
      const pdfWidth = 210; // Ancho del PDF
      const pdfHeight = 297; // Alto del PDF
      const contenidoWidth = pdfWidth - (margen * 2); // Ancho del área de contenido dentro del margen
      const contenidoHeight = pdfHeight - (margen * 2); // Alto del área de contenido dentro del margen
      const pdf = new jsPDF();
      
      // Agregar el título sobre la tabla
      const tituloX = margen + 50; // Ajusta la posición X del título según sea necesario
      const tituloY = margen + 10; // Ajusta la posición Y del título según sea necesario
      const titulo = "REPORTE DE CAJA DAÑADA"; // Establece el texto del título según sea necesario
      pdf.text(titulo, tituloX, tituloY); 
      // Agregar la tabla al PDF con margen
      pdf.autoTable({
          head: [['INTLOGIS MÉXICO',`${fecha}`, `FOLIO: ${folio}`]],
          body: data,
          startY: margen + 15, // Comenzar la tabla desde el margen superior
          margin: { top: margen }, // Establecer el margen superior de la tabla
          styles: {
              lineColor: [10, 10, 10], // Color de las líneas (RGB)
              lineWidth: 0.25 // Ancho de las líneas
          },
          headStyles: {
            lineWidth: 0, // Eliminar el borde del encabezado
            lineColor: [255, 255, 255], // Establecer el color de borde del encabezado como blanco para ocultarlo
            fontColor: [0, 0, 0] // Establecer el color de fuente del encabezado
        },
       didDrawPage: function (data) {
         // console.log(dropArea);
            // Agregar la primera imagen al PDF si está presente
            if (dropArea.childNodes[1] instanceof HTMLImageElement) {
                const imgData = dropArea.childNodes[1].src;
                const imgX = margen + 5; // Comenzar la imagen desde el margen izquierdo
                const imgY = data.cursor.y + margen; // Posicionar la imagen debajo de la tabla con un margen
                const imgWidth = 90; // Ancho de la imagen dentro del margen
                const imgHeight = 70; // Alto de la imagen dentro del margen
    
                // Agregar la primera imagen
                pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            }
    
            // Agregar la segunda imagen al PDF si está presente
            if (dropArea.childNodes[2] instanceof HTMLImageElement) {
                const segundaImgData = dropArea.childNodes[2].src;
                const segundaImgX = margen + 95; // Comenzar la segunda imagen desde el margen izquierdo
                const segundaImgY = data.cursor.y + margen; // Posicionar la segunda imagen debajo de la primera con un margen
                const segundaImgWidth = 90; // Ancho de la segunda imagen dentro del margen
                const segundaImgHeight = 70; // Alto de la segunda imagen dentro del margen
    
                // Agregar la segunda imagen
                pdf.addImage(segundaImgData, 'JPEG', segundaImgX, segundaImgY, segundaImgWidth, segundaImgHeight);
            }
    
             // Dibujar el borde alrededor del área de contenido con margen
            pdf.setLineWidth(grosorBorde);
            pdf.rect(margen, margen, contenidoWidth, contenidoHeight, 'stroke');
        }
      });
      
      // Guardar el PDF
      pdf.save('Orden_de_Trabajo.pdf');
      

    } else if (e.target.matches(".ordenSU")){
      // console.log(e.target);
    // Obtener los valores de los campos de entrada
    const folio = d.getElementById('folio').value;
    const fecha = d.getElementById('fecha').value;
    const unidad = d.getElementById('unidad').value;
    const servicio = d.getElementById('servicio').value;
    const operador = d.getElementById('operador').value;
    const resMtto = d.getElementById('resMtto').value;

    // Definir los datos de la tabla
    const data = [
      ['Folio:', folio],
      ['Fecha:', fecha],
      ['Unidad:', unidad],
      ['Servicio a Efectuar:', servicio],
      ['Operador:', operador],
      ['Responsable de Mtto.:', resMtto]
      ];

      const margen = 10; // Ajusta el margen según sea necesario
      const grosorBorde = 2;

      // Agregar el margen al PDF
      const pdfWidth = 210; // Ancho del PDF
      const pdfHeight = 297; // Alto del PDF
      const contenidoWidth = pdfWidth - (margen * 2); // Ancho del área de contenido dentro del margen
      const contenidoHeight = pdfHeight - (margen * 2); // Alto del área de contenido dentro del margen
      const pdf = new jsPDF();
      // Agregar la tabla al PDF con margen
      pdf.autoTable({
        head: [['ORDEN DE TRABAJO', ``, 'INTLOGIS MÉXICO']],
        body: data,
        startY: margen + 5, // Comenzar la tabla desde el margen superior
        margin: { top: margen }, // Establecer el margen superior de la tabla
        styles: {
            lineColor: [0, 0, 0], // Color de las líneas (RGB)
            lineWidth: 0.25 // Ancho de las líneas
        },
        headStyles: {
          lineWidth: 0, // Eliminar el borde del encabezado
          lineColor: [255, 255, 255], // Establecer el color de borde del encabezado como blanco para ocultarlo
          fontColor: [0, 0, 0] // Establecer el color de fuente del encabezado
      },
        didDrawPage: function (data) {
         // console.log(dropArea);
            // Agregar la primera imagen al PDF si está presente
            if (dropArea.childNodes[1] instanceof HTMLImageElement) {
                const imgData = dropArea.childNodes[1].src;
                const imgX = margen + 5; // Comenzar la imagen desde el margen izquierdo
                const imgY = data.cursor.y + margen; // Posicionar la imagen debajo de la tabla con un margen
                const imgWidth = 90; // Ancho de la imagen dentro del margen
                const imgHeight = 70; // Alto de la imagen dentro del margen
    
                // Agregar la primera imagen
                pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            }
    
            // Agregar la segunda imagen al PDF si está presente
            if (dropArea.childNodes[2] instanceof HTMLImageElement) {
                const segundaImgData = dropArea.childNodes[2].src;
                const segundaImgX = margen + 95; // Comenzar la segunda imagen desde el margen izquierdo
                const segundaImgY = data.cursor.y + margen; // Posicionar la segunda imagen debajo de la primera con un margen
                const segundaImgWidth = 90; // Ancho de la segunda imagen dentro del margen
                const segundaImgHeight = 70; // Alto de la segunda imagen dentro del margen
    
                // Agregar la segunda imagen
                pdf.addImage(segundaImgData, 'JPEG', segundaImgX, segundaImgY, segundaImgWidth, segundaImgHeight);
            }
    
            // Dibujar el borde alrededor del área de contenido con margen
            pdf.setLineWidth(grosorBorde);
            pdf.rect(margen, margen, contenidoWidth, contenidoHeight, 'stroke');
        }
    });

// Guardar el PDF
pdf.save('Orden_de_Trabajo.pdf');

    }

  });
  d.addEventListener("keyup", (e) => {
    //  console.log(d.getElementById("ruta"));
    //limpiar busqueda
    let query = localStorage.getItem("apiSearch");
    if (e.key === "Escape") localStorage.removeItem("apiSearch");
    let item = d.querySelectorAll(".item");
    item.forEach((e) => {
      if (!query) {
        e.classList.remove("filter");
        return false;
      }
    });
  });

  span.addEventListener("click", function() {
    modal.style.display = "none";
  });

  window.addEventListener("hashchange", (e) => {
    //console.log(e);
    let  user = localStorage.username,
    hash = window.location.hash;

    cambiarVista(user, hash);
  });
}
