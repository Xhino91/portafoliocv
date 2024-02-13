import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
  onChildAdded, onChildChanged, onChildRemoved
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { generar_xls } from "../helpers/generar_xls.js";
import { renderTable } from "./renderTable.js";
import { renderTableCV } from "./renderTableCV.js";
import { renderTableUnits } from "./renderTableUnits.js";
import { renderTableEV } from "./renderTableEV.js";
import { renderTableHistory } from "./renderTableHistory.js";
import { tabActive } from "./tabActive.js";
import { Item } from "./Item.js";


export async function Router() {
  
  const d = document,
       w = window;
   d.addEventListener("keyup", e => {
  //console.log(e);
  if(e.key === "Escape"){
    location.reload();
  }
   });

  let { hash } = w.location;   
  let dbXlsx;

  function handleFile(event) {

    const fileInput = event.target;
    const file = fileInput.files[0];
  
    if (file) {
        const reader = new FileReader();
  
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
  
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

 //console.log(localStorage.username);
 let user = localStorage.username;

 

  if (!hash || hash === "#" || hash === "#/" || hash === `#/${user}`) {
    if(localStorage.username === "Public") {
      window.location.hash = "/Public/productivo";
      location.reload();
    } else
    if(localStorage.username === "Tracking") {
      window.location.hash = "/Tracking/productivo";
      location.reload();
    }else
      if(localStorage.username === "InhouseHMO") {
        window.location.hash = "/InhouseHMO/productivo";
        location.reload();
      }else
      if(localStorage.username === "InhouseMX") {
        window.location.hash = "/InhouseMX/productivo";
        location.reload();
      }else
      if(localStorage.username === "InhouseTOL") {
        window.location.hash = "/InhouseTOL/productivo";
        location.reload();
      }else
      if(localStorage.username === "InhouseGTO") {
        window.location.hash = "/InhouseGTO/productivo";
        location.reload();
      }else
      if(localStorage.username === "Traffic") {
        window.location.hash = "/Traffic/productivo";
        location.reload();
      }else
      if(localStorage.username === "TrafficH") {
        window.location.hash = "/TrafficH/productivo";
        location.reload();
      }else 
      if(localStorage.username === "CVehicular") {
        window.location.hash = "/CVehicular/cajas";
        location.reload();
      }
    return;
  } else
  if (!user || user === "Public" || user === "Tracking" || user === "Traffic" || user === "TrafficH" || user === "InhouseTOL" || user === "InhouseHMO" || user === "InhouseMX" || user === "InhouseGTO" || user === "CVehicular") {
    
   if (hash === "#/" + user + "/productivo") {
         tabActive("tablero");
    localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;

    let keyUpdate="", updateValue={};   
     const db = getDatabase(),
     refItems = ref(db, "items");

     onValue(refItems, (snapshot) => {
      let res = snapshot.val(); 
      renderTable(res); 
     //console.log(res);
     onChildChanged(refItems, (snapshot) => {
      //console.log(snapshot.key);
      //console.log(snapshot.val());
      updateValue = snapshot.val();
      keyUpdate = snapshot.key;
       //console.log(d.getElementById(`${snapshot.key}`));     
     });
      //if (updateValue.ruta.matches("CU") || updateValue.ruta.matches("HS") || updateValue.ruta.matches("RT")):
         
      if(!updateValue.ruta){  return } else 
          
      {
        d.getElementById(`${keyUpdate}`).classList.add("parpadeo")
        setTimeout(function() {
        d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
        }, 1000); 
      };
         
     });
          
        
      d.getElementById('excelFileInput').addEventListener('change', e => {
   
        if(e.target.matches("#excelFileInput")){
        //  console.log(e.target); 
             handleFile(e);            
        }
         
     });
 
     d.addEventListener("click", async (e) => {    
      //console.log(e.target);
     //LEER CSV / XLS
     let date = new Date;
     if(e.target.matches(".importXlsx")){


       dbXlsx.forEach((item)=>{
         // console.log(item);
           let hora = item[3].slice(11, 17),
           arrF = item[3].slice(1,-6).split("/"),
            concatF ="";
            item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
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
             comentarios: "SIN COMENTARIOS"  
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

     } else 
     if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
       
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
             comentarios: "SIN COMENTARIOS"
         };
         push(ref(db, "items"), body);
             
     }  else 
     if (element[1].match("GMMEX")) {
       
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
             comentarios: "SIN COMENTARIOS"
         };     
         push(ref(db, "items"), body); 
             
     } else 
     if (element[2].match("MEX3")) {
       
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
             comentarios: "SIN COMENTARIOS"
         };
         push(ref(db, "items"), body);             
     }  else 
     if (element[1].match("BRP")) {
       
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
             comentarios: "SIN COMENTARIOS"
         };
         push(ref(db, "items"), body);         
     }
     });
          
      }else
      //GENERAR REPORTE XLS 
      if (e.target.matches(".modal_xls")){
       if(localStorage.tabViajes === "true"){

      d.querySelector(".export-modal-body").innerHTML = `
        <section id="thtable" class="thtable">
        <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
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
            if(e.classList[5] === "filter"){
             return
            }
            d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
           });
   
           d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
       }     
      
      }else
      if (e.target.matches(".cancelXls") || e.target.matches(".report")){
       location.reload();
     }else
      if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
       // console.log(e.target);

        let isConfirm = confirm("¿Eliminar Registro?");

        if (isConfirm){
          remove(ref(db, `/items/${e.target.id}`));
        }        
      }else
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
        if(localStorage.tabViajes === "true"){
          const db = getDatabase(),
            refItem = ref(db, `items/${e.target.id}`);

          d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;


         onValue(refItem, (snapshot) => {
          let item = snapshot.val();
         // console.log(item);
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("/"),
             concatF ="";
             
             return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
          };
  
          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
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
          <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
          <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
          <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
          <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
          <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
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
        <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
        <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
        <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
        <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
        <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
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
        <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
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
        <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
        </td>    
        </tbody>
        
      </table>
      </div>
            `;
         });
         
       }
        

      }else
     if (e.target.matches(".equipov")) {      
       window.location.hash = "/"+ user +"/equipov";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;
     }else
     if (e.target.matches(".history")) {
       window.location.hash = "/"+user+"/history";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;      
     }else
     if (e.target.matches(".cajas")) {
      window.location.hash = "/"+user+"/cajas";
       localStorage.tabConveyance = true;
       localStorage.tabViajes = false;
     localStorage.tabUnit = false;
     }else
     if (e.target.matches(".unidades")) {
       window.location.hash = "/"+user+"/unidades";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = false;
       localStorage.tabUnit = true;  
     }  else
     if (e.target.matches(".reg")) {
       //  console.log(e.target);
       //MODAL REGISTRO DE VIAJES
       d.querySelector(".hidden").style.display = "block";
       d.getElementById("formulario").classList.add("register");
       d.getElementById("formulario").classList.remove("edit");
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
     }else
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
      }
      return;
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
      } 
      else if (e.target.matches(".register")) {
         //Create Register
        

         if (!e.target.id.value) {

          
          const dateConvert = (date) => {
            let hora = date.slice(11, 17),
            arrF = date.slice(0,10).split("-"),
             concatF ="";
             
             return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
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
               comentarios: e.target.comentarios.value.toUpperCase()
           };
           push(ref(db, "items"), body); 
           /* await ajax({
             url: `${api.ITEMS}.json`,
             options,
             cbSuccess: (res) => {
               json = res.json();
             },
            });*/
         
         }
         // console.log(e.target);
      }     
      else if (e.target.matches(".edit")) {

            if(localStorage.tabViajes === "true") {
          if (!e.target.id.value) {
            const db = getDatabase();
            const dateConvert = (date) => {
              let hora = date.slice(11, 17),
              arrF = date.slice(0,10).split("-"),
               concatF ="";
               
               return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
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
               comentarios: e.target.comentarios.value.toUpperCase()  
            }, keyValue = d.getElementById("bt-save").dataset.value;

            update(ref(db), {
              ["/items/" + keyValue]: body,
            })
            .then(() => {
              //console.log(keyValue); 
              d.getElementById(`${keyValue}`).classList.add("parpadeo");
              setTimeout(function() {
                d.getElementById(`${keyValue}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
              }, 1000);
            })
            .catch((error) => {
              // The write failed...
            });
          }
               }
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

   }else
   if (hash === "#/" + user + "/equipov") {
    tabActive("equipov");
    localStorage.tabConveyance = false;
    localStorage.tabViajes = true;
     localStorage.tabUnit = false;

     let keyUpdate="", updateValue={};   
     const db = getDatabase(),
     refItems = ref(db, "items");
      
     onValue(refItems, (snapshot) => {
      let res = snapshot.val(); 
      renderTableEV(res); 
     //console.log(res);
     onChildChanged(refItems, (snapshot) => {
      //console.log(snapshot.key);
      //console.log(snapshot.val());
      updateValue = snapshot.val();
      keyUpdate = snapshot.key;
       //console.log(d.getElementById(`${snapshot.key}`));     
     });
     
     if(!updateValue.ruta){  return } else 
          
     {
       d.getElementById(`${keyUpdate}`).classList.add("parpadeo")
       setTimeout(function() {
       d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
       }, 1000); 
     };

     });

    d.getElementById('excelFileInput').addEventListener('change', e => {
   
      if(e.target.matches("#excelFileInput")){
      //  console.log(e.target); 
           handleFile(e);            
      }
       
   });

   d.addEventListener("click", async (e) => {    
    //console.log(e.target);
   //LEER CSV / XLS
   let date = new Date;
   if(e.target.matches(".importXlsx")){


    dbXlsx.forEach((item)=>{
      // console.log(item);
        let hora = item[3].slice(11, 17),
        arrF = item[3].slice(1,-6).split("/"),
         concatF ="";
         item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
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
          comentarios: "SIN COMENTARIOS"  
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

  } else 
  if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };
      push(ref(db, "items"), body);
          
  }  else 
  if (element[1].match("GMMEX")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };     
      push(ref(db, "items"), body); 
          
  } else 
  if (element[2].match("MEX3")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };
      push(ref(db, "items"), body);             
  }  else 
  if (element[1].match("BRP")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };
      push(ref(db, "items"), body);         
  }
  });
       
   }else
      //GENERAR REPORTE XLS 
      if (e.target.matches(".modal_xls")){
        if(localStorage.tabViajes === "true"){
 
       d.querySelector(".export-modal-body").innerHTML = `
         <section id="thtable" class="thtable">
         <table class="table table-hover table-sm" id="table_xls">
         <thead class="table-dark text-center align-middle">
         <tr style="background-color:black; color:white;">
         <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
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
             if(e.classList[5] === "filter"){
              return
             }
             d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
            });
    
            d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
        }     
       
       }else
       if (e.target.matches(".cancelXls") || e.target.matches(".report")){
        location.reload();
      }else
       if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
        // console.log(e.target);
 
        let isConfirm = confirm("¿Eliminar Registro?");

        if (isConfirm){
          remove(ref(db, `/items/${e.target.id}`));
        }
      
         
       }else
       if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
         if(localStorage.tabViajes === "true"){
           const db = getDatabase(),
             refItem = ref(db, `items/${e.target.id}`);
 
             
 
           d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
 
 
          onValue(refItem, (snapshot) => {
           let item = snapshot.val();
          // console.log(item);
           const dateConvert = (date) => {
             let hora = date.slice(11, 17),
             arrF = date.slice(0,10).split("/"),
              concatF ="";
              
              return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
           };
   
           d.getElementById("formulario").classList.add("edit");
           d.getElementById("formulario").classList.remove("register");
           d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
           d.querySelector(".modal-body").innerHTML = `
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
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
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
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
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
         <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
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
         <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
         </td>    
         </tbody>
         
       </table>
       </div>
             `;
          });
          
        }
         
 
       }else
      if (e.target.matches(".tablero")) {      
        window.location.hash = "/"+ user+"/productivo";
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;
      }else
      if (e.target.matches(".history")) {
        window.location.hash = "/"+user+"/history";
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;      
      }else
      if (e.target.matches(".cajas")) {
       window.location.hash = "/"+user+"/cajas";
        localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;
      }else
      if (e.target.matches(".unidades")) {
        window.location.hash = "/"+user+"/unidades";
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;  
      }  else
      if (e.target.matches(".reg")) {
        //  console.log(e.target);
        //MODAL REGISTRO DE VIAJES
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
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
      }else
       if(e.target.matches(".generar_xls")){
         //let $dataTable = d.getElementById("table_xls");
             generar_xls('table_xls', 'Reporte');
       }
       return;
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
   }  
   else if (e.target.matches(".register")) {
      //Create Register
     

      if (!e.target.id.value) {

       
       const dateConvert = (date) => {
         let hora = date.slice(11, 17),
         arrF = date.slice(0,10).split("-"),
          concatF ="";
          
          return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
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
            comentarios: e.target.comentarios.value.toUpperCase()
        };
        push(ref(db, "items"), body); 
        /* await ajax({
          url: `${api.ITEMS}.json`,
          options,
          cbSuccess: (res) => {
            json = res.json();
          },
         });*/
      
      }
      // console.log(e.target);
   }     
   else if (e.target.matches(".edit")) {

         if(localStorage.tabViajes === "true") {
       if (!e.target.id.value) {
         const db = getDatabase();
         const dateConvert = (date) => {
           let hora = date.slice(11, 17),
           arrF = date.slice(0,10).split("-"),
            concatF ="";
            
            return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
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
            comentarios: e.target.comentarios.value.toUpperCase()  
         }, keyValue = d.getElementById("bt-save").dataset.value;

         update(ref(db), {
          ["/items/" + keyValue]: body,
        })
        .then(() => {
          //console.log(keyValue); 
          d.getElementById(`${keyValue}`).classList.add("parpadeo");
          setTimeout(function() {
            d.getElementById(`${keyValue}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
          }, 1000);
        })
        .catch((error) => {
          // The write failed...
        });
       }
            }
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
   } else
   if (hash === "#/" + user + "/history") {
    tabActive("history");
    localStorage.tabConveyance = false;
    localStorage.tabViajes = true;
     localStorage.tabUnit = false;

     let keyUpdate="", updateValue={};  
     const db = getDatabase(),
     refItems = ref(db, "items");

     onValue(refItems, (snapshot) => {
      let res = snapshot.val();
      renderTableHistory(res);  
     //console.log(res);
     onChildChanged(refItems, (snapshot) => {
      //console.log(snapshot.key);
      //console.log(snapshot.val());
      keyUpdate = snapshot.key;
       //console.log(d.getElementById(`${snapshot.key}`));     
     });

    
      if(!updateValue.ruta){  return } else 
          
          {
            d.getElementById(`${keyUpdate}`).classList.add("parpadeo")
            setTimeout(function() {
            d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
            }, 1000); 
          };

     });

    
    d.getElementById('excelFileInput').addEventListener('change', e => {
   
      if(e.target.matches("#excelFileInput")){
      //  console.log(e.target); 
           handleFile(e);            
      }
       
   });

   d.addEventListener("click", async (e) => {    
    //console.log(e.target);
//LEER CSV / XLS
let date = new Date;

if(e.target.matches(".importXlsx")){


  dbXlsx.forEach((item)=>{
    // console.log(item);
      let hora = item[3].slice(11, 17),
      arrF = item[3].slice(1,-6).split("/"),
       concatF ="";
       item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
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
        comentarios: "SIN COMENTARIOS"  
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

} else 
if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
  
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
        comentarios: "SIN COMENTARIOS"
    };
    push(ref(db, "items"), body);
        
}  else 
if (element[1].match("GMMEX")) {
  
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
        comentarios: "SIN COMENTARIOS"
    };     
    push(ref(db, "items"), body); 
        
} else 
if (element[2].match("MEX3")) {
  
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
        comentarios: "SIN COMENTARIOS"
    };
    push(ref(db, "items"), body);             
}  else 
if (element[1].match("BRP")) {
  
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
        comentarios: "SIN COMENTARIOS"
    };
    push(ref(db, "items"), body);         
}
});
     
 }else
   //GENERAR REPORTE XLS 
   if (e.target.matches(".modal_xls")){
     if(localStorage.tabViajes === "true"){

    d.querySelector(".export-modal-body").innerHTML = `
      <section id="thtable" class="thtable">
      <table class="table table-hover table-sm" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr style="background-color:black; color:white;">
      <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
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
          if(e.classList[5] === "filter"){
           return
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
         });
 
         d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
     }     
    
    }else
    if (e.target.matches(".cancelXls") || e.target.matches(".report")){
     location.reload();
   }else
    if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
     // console.log(e.target);

     let isConfirm = confirm("¿Eliminar Registro?");

     if (isConfirm){
       remove(ref(db, `/items/${e.target.id}`));
     }
      
    }else 
    if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
         if(localStorage.tabViajes === "true"){
           const db = getDatabase(),
             refItem = ref(db, `items/${e.target.id}`);
 
             
 
           d.querySelector(".hidden").style.display = "block";
          d.getElementById("bt-save").dataset.value = `${e.target.id}`;
 
 
          onValue(refItem, (snapshot) => {
           let item = snapshot.val();
          // console.log(item);
           const dateConvert = (date) => {
             let hora = date.slice(11, 17),
             arrF = date.slice(0,10).split("/"),
              concatF ="";
              
              return concatF.concat(arrF[2], "-",arrF[1],"-",arrF[0], "T", hora);
           };
   
           d.getElementById("formulario").classList.add("edit");
           d.getElementById("formulario").classList.remove("register");
           d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
           d.querySelector(".modal-body").innerHTML = `
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
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA REAL</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA REAL</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">ETA A DESTINO</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">LLEGADA A DESTINO</th>
           <th scope="col" style="${user === "Traffic" ? "display: none;" : ""}">SALIDA A DESTINO</th>
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
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}"   name="hour" type="datetime-local" id="hour"  value="${dateConvert(item.llegadareal)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidareal" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidareal)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="eta" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.eta)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="llegadadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.llegadadestino)}"></td>
         <td style="${user === "Traffic" ? "display: none;" : ""}"><input name="salidadestino" style="width: 150px; ${user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="datetime-local" name="hour" id="hour"  value="${dateConvert(item.salidadestino)}"></td>
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
         <select class="form-select form-select-sm" style="height: 24px; width: 230px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="status" id="status">
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
         <input name="comentarios" style="width: 150px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" type="text"  value="${item.comentarios}">
         </td>    
         </tbody>
         
       </table>
       </div>
             `;
          });
          
        }
         
 
       }else
      if (e.target.matches(".tablero")) {      
        window.location.hash = "/"+ user+"/productivo";
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;
      }else
      if (e.target.matches(".equipov")) {      
        window.location.hash = "/"+ user +"/equipov";
        localStorage.tabConveyance = false;
        localStorage.tabViajes = true;
         localStorage.tabUnit = false;
      }else
      if (e.target.matches(".cajas")) {
       window.location.hash = "/"+user+"/cajas";
        localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;
      }else
      if (e.target.matches(".unidades")) {
        window.location.hash = "/"+user+"/unidades";
        localStorage.tabConveyance = false;
        localStorage.tabViajes = false;
        localStorage.tabUnit = true;  
      }  else
      if (e.target.matches(".reg")) {
        //  console.log(e.target);
        //MODAL REGISTRO DE VIAJES
        d.querySelector(".hidden").style.display = "block";
        d.getElementById("formulario").classList.add("register");
        d.getElementById("formulario").classList.remove("edit");
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
      }else
       if(e.target.matches(".generar_xls")){
         //let $dataTable = d.getElementById("table_xls");
             generar_xls('table_xls', 'Reporte');
       }
       return;
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
    }
    else if (e.target.matches(".edit")) {

      if(localStorage.tabViajes === "true") {
        if (!e.target.id.value) {
      const db = getDatabase();
      const dateConvert = (date) => {
        let hora = date.slice(11, 17),
        arrF = date.slice(0,10).split("-"),
         concatF ="";
         
         return concatF.concat(arrF[2], "/",arrF[1],"/",arrF[0], " ", hora);
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
         comentarios: e.target.comentarios.value.toUpperCase()  
      }, keyValue = d.getElementById("bt-save").dataset.value;

      update(ref(db), {
        ["/items/" + keyValue]: body,
      })
      .then(() => {
        //console.log(keyValue); 
        d.getElementById(`${keyValue}`).classList.add("parpadeo");
        setTimeout(function() {
          d.getElementById(`${keyValue}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
        }, 1000);
      })
      .catch((error) => {
        // The write failed...
      });

    }
         }
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
   }else
   if (hash === "#/" + user + "/cajas") { 
    tabActive("cajas");
    localStorage.tabConveyance = true;
        localStorage.tabViajes = false;
      localStorage.tabUnit = false;

      let keyUpdate="", updateValue={};  
      const db = getDatabase(),
     refItems = ref(db, "subitem1");
     onValue(refItems, (snapshot) => {
      let res = snapshot.val(); 
      renderTableCV(res); 
     //console.log(res);
     onChildChanged(refItems, (snapshot) => {
      //console.log(snapshot.key);
      //console.log(snapshot.val());
      updateValue = snapshot.val();
      keyUpdate = snapshot.key;
       //console.log(d.getElementById(`${snapshot.key}`));     
     });
      //if (updateValue.ruta.matches("CU") || updateValue.ruta.matches("HS") || updateValue.ruta.matches("RT")):
         
      if(!updateValue.caja){  return } else 
          
      {
        d.getElementById(`${keyUpdate}`).classList.add("parpadeo")
        setTimeout(function() {
        d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
        }, 1000); 
      };
         
     });

      d.getElementById('excelFileInput').addEventListener('change', e => {
   
        if(e.target.matches("#excelFileInput")){
        //  console.log(e.target); 
             handleFile(e);            
        }
         
     });
 
     d.addEventListener("click", async (e) => {    
      //console.log(e.target);
     //LEER CSV / XLS
     let date = new Date;
     
     if(e.target.matches(".importXlsx")){


      dbXlsx.forEach((item)=>{
        // console.log(item);
          let hora = item[3].slice(11, 17),
          arrF = item[3].slice(1,-6).split("/"),
           concatF ="";
           item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
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
            comentarios: "SIN COMENTARIOS"  
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

    } else 
    if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
      
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
            comentarios: "SIN COMENTARIOS"
        };
        push(ref(db, "items"), body);
            
    }  else 
    if (element[1].match("GMMEX")) {
      
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
            comentarios: "SIN COMENTARIOS"
        };     
        push(ref(db, "items"), body); 
            
    } else 
    if (element[2].match("MEX3")) {
      
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
            comentarios: "SIN COMENTARIOS"
        };
        push(ref(db, "items"), body);             
    }  else 
    if (element[1].match("BRP")) {
      
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
            comentarios: "SIN COMENTARIOS"
        };
        push(ref(db, "items"), body);         
    }
    });
         
     }else
      //GENERAR REPORTE XLS 
      if (e.target.matches(".modal_xls")){
       if(localStorage.tabConveyance === "true"){
         

      d.querySelector(".export-modal-body").innerHTML = `
        <section id="thtable" class="thtable">
        <table class="table table-hover table-sm" id="table_xls">
        <thead class="table-dark text-center align-middle">
        <tr style="background-color:black; color:white;">
        <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
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
            if(e.classList[5] === "filter"){
             return
            }
            d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
           });
   
           d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
       }       
      
      }else
      if (e.target.matches(".cancelXls") || e.target.matches(".report")){
       location.reload();
     }else
      if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
      // console.log(e.target);

       let isConfirm = confirm("¿Eliminar Registro?");

       if (isConfirm) remove(ref(db, `/subitem1/${e.target.id}`));
     
     /*  await ajax({
           url: `${api.ITEMS}/${e.target.id}.json`,
           options: {
             method: "DELETE",
             headers: {
               "Content-type": "application/json; charset=utf-8",
             },
           },
           cbSuccess: (res) => {
             //console.log(res);
            
           },
         });
         location.reload();*/
       
     }else
      if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {
       
        if(localStorage.tabConveyance === "true"){
        const db = getDatabase(),
            refRem = ref(db, `subitem1/${e.target.id}`);

         d.querySelector(".hidden").style.display = "block";
         d.getElementById("bt-save").dataset.value = `${e.target.id}`;

         onValue(refRem, (snapshot) => {
          let item = snapshot.val();

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
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
      <td><input name="caja" style="width: 60px;" type="text" value="${item.caja}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="tipo" style="width: 120px;" type="text"   value="${item.tipo}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="año" style="width: 45px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="poliza" style="width: 100px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="inciso" style="width: 100px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="contacto" type="text" style="width: 150px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
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
      <td><input name="fecha" style="width: 90px;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
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
        <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="comentarios" id="comentarios">
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
      <td><input name="reporte" style="width: 200px;" type="text"  value="${item.reporte}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
         });

        }
    

      }else
      if (e.target.matches(".remolque")) {
        //  console.log(e.target);

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
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;
      
  
        
      }else
      if (e.target.matches(".unidad")) {
      
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
        <th scope="col">CONTACTO DEL SEGURO</th>
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
      <td><input name="contacto" type="text" style="width: 80px;"></td>
      <td><input name="circuito" type="text"></td>
      <td><input name="fecha" type="date"></td>
      <td><input name="ubicacion" type="text"></td>
      <td><input name="comentarios" type="text"></td>  
      </tbody>
        
      </table>
      </div>
            `;

  
      } else
      if (e.target.matches(".tablero")) {
       window.location.hash = "/"+ user+"/productivo";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;
     }else
     if (e.target.matches(".equipov")) {
       window.location.hash = "/"+ user +"/equipov";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;
     }else
     if (e.target.matches(".history")) {
       window.location.hash = "/"+user+"/history";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = true;
        localStorage.tabUnit = false;
     }else
     if (e.target.matches(".unidades")) {
       window.location.hash = "/"+user+"/unidades";
       localStorage.tabConveyance = false;
       localStorage.tabViajes = false;
       localStorage.tabUnit = true;       
     }  else
      if(e.target.matches(".generar_xls")){
        //let $dataTable = d.getElementById("table_xls");
            generar_xls('table_xls', 'Reporte');
      }
      return;
    });
 
     d.addEventListener("submit", async (e) => {
       e.preventDefault();
    // console.log(e.target);
     
      if (e.target.matches(".search-form") && localStorage.tabConveyance === "true") {
       //   console.log(e.target);
     let query = localStorage.getItem("apiSearch").toUpperCase();

       //  console.log(query);

     let item = d.querySelectorAll(".item");
         item.forEach((e) => {
       //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
       if (!query) {
         e.classList.remove("filter");
         return false;
       } 
       else if (e.dataset.conv.includes(query) ||
       e.dataset.circuito.includes(query) ||
       e.dataset.ubicacion.includes(query)
       ) {
         e.classList.remove("filter");
       } 
       else {
         e.classList.add("filter");
       }
                     });
      } 
      else if (e.target.matches(".edit")) {

        if(localStorage.tabConveyance === "true" && localStorage.tabUnit == "false"){
             if (!e.target.id.value) {
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
              reporte: e.target.reporte.value.toUpperCase()
            }, keyValue = d.getElementById("bt-save").dataset.value;

            update(ref(db), {["/subitem1/" + keyValue]: body,
              })
            .then(() => {
             // console.log("asignado"); 
              d.getElementById(`${keyValue}`).classList.add("parpadeo");
              setTimeout(function() {
                d.getElementById(`${keyValue}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
              }, 2000);
            })
            .catch((error) => {
              // The write failed...
            });

          }
             }    

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
   }else
   if (hash === "#/" + user + "/unidades") {
    tabActive("unidades");
    localStorage.tabConveyance = false;
    localStorage.tabViajes = false;
    localStorage.tabUnit = true;

    let keyUpdate="", updateValue={};
    const db = getDatabase(),
     refItems = ref(db, "subitem");

     onValue(refItems, (snapshot) => {
      let res = snapshot.val(); 
      renderTableUnits(res); 
     //console.log(res);
     onChildChanged(refItems, (snapshot) => {
      //console.log(snapshot.key);
      //console.log(snapshot.val());
      updateValue = snapshot.val();
      keyUpdate = snapshot.key;
       //console.log(d.getElementById(`${snapshot.key}`));     
     });
      //if (updateValue.ruta.matches("CU") || updateValue.ruta.matches("HS") || updateValue.ruta.matches("RT")):
         
      if(!updateValue.unidad){  return } else 
          
      {
        d.getElementById(`${keyUpdate}`).classList.add("parpadeo")
        setTimeout(function() {
        d.getElementById(`${keyUpdate}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
        }, 1000); 
      };
         
     });
        
    d.getElementById('excelFileInput').addEventListener('change', e => {
   
      if(e.target.matches("#excelFileInput")){
      //  console.log(e.target); 
           handleFile(e);            
      }
       
   });

   d.addEventListener("click", async (e) => {    
    //console.log(e.target);
   //LEER CSV / XLS
   let date = new Date;
   if(e.target.matches(".importXlsx")){


    dbXlsx.forEach((item)=>{
      // console.log(item);
        let hora = item[3].slice(11, 17),
        arrF = item[3].slice(1,-6).split("/"),
         concatF ="";
         item[3] = concatF.concat(arrF[1], "/0",arrF[0],"/",arrF[2], " ", hora);
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
          comentarios: "SIN COMENTARIOS"  
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

  } else 
  if (element[1].match("23") || element[1].match("CU") ||element[1].match("DH")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };
      push(ref(db, "items"), body);
          
  }  else 
  if (element[1].match("GMMEX")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };     
      push(ref(db, "items"), body); 
          
  } else 
  if (element[2].match("MEX3")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };
      push(ref(db, "items"), body);             
  }  else 
  if (element[1].match("BRP")) {
    
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
          comentarios: "SIN COMENTARIOS"
      };
      push(ref(db, "items"), body);         
  }
  });
       
   }else
    //GENERAR REPORTE XLS 
    if (e.target.matches(".modal_xls")){
     if(localStorage.tabUnit === "true"){

    d.querySelector(".export-modal-body").innerHTML = `
      <section id="thtable" class="thtable">
      <table class="table table-hover table-sm" id="table_xls">
      <thead class="table-dark text-center align-middle">
      <tr style="background-color:black; color:white;">
      <td colspan="" scope="row" style="font-weight: bold;" class="tableDate">${date.toLocaleDateString('es-MX', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</td>  
      </tr>
      <tr style="background-color:black; color:white;">
      <th scope="col">UNIDAD</th>
      <th scope="col">OPERADOR</th>
      <th scope="col">MARCA</th>
      <th scope="col">PLACA</th>
      <th scope="col">AÑO</th>
      <th scope="col">NO. SERIE</th>
      <th scope="col">NO. POLIZA</th>
      <th scope="col">INCISO</th>
      <th scope="col">KILOMETRAJE</th>
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
          if(e.classList[5] === "filter"){
           return
          }
          d.getElementById("table_bodyX").insertAdjacentElement("beforeend", e);          
         });
 
         d.querySelectorAll(".btn-hid").forEach(e => e.style.display = "none");
     }     
    
    }else
    if (e.target.matches(".cancelXls") || e.target.matches(".report")){
     location.reload();
   }else
   if (e.target.matches(".delete") || e.target.matches(".fa-trash")) {
    // console.log(e.target);

     let isConfirm = confirm("¿Eliminar Registro?");

     if (isConfirm) remove(ref(db, `/subitem/${e.target.id}`));
   
   /*  await ajax({
         url: `${api.ITEMS}/${e.target.id}.json`,
         options: {
           method: "DELETE",
           headers: {
             "Content-type": "application/json; charset=utf-8",
           },
         },
         cbSuccess: (res) => {
           //console.log(res);
          
         },
       });
       location.reload();*/
     
   }else
    if (e.target.matches(".edit") || e.target.matches(".fa-pencil")) {

      if(localStorage.tabUnit === "true"){
        const db = getDatabase(),
            refUnit = ref(db, `subitem/${e.target.id}`);

        d.querySelector(".hidden").style.display = "block";
        d.getElementById("bt-save").dataset.value = `${e.target.id}`;

      onValue(refUnit, (snapshot) => {
        let item = snapshot.val();

          d.getElementById("formulario").classList.add("edit");
          d.getElementById("formulario").classList.remove("register");
          d.getElementById("exampleModalLabel").innerHTML = `Actualizar Datos`;
          d.querySelector(".modal-body").innerHTML = `
          <div class="container-fluid font"> 
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
    <th scope="col">KILOMETRAJE</th>
    <th scope="col">CIRCUITO</th>
    <th scope="col">FECHA</th>
    <th scope="col">UBICACION</th> 
    <th scope="col">ESTATUS</th>

        </tr>
      </thead>
      <tbody class="text-center text-wrap" >
      <td><input name="unidad" style="width: 35px;" type="text" value="${item.unidad}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="operador" style="width: 150px;" type="text"   value="${item.operador}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="modelo" style="width: 100px;" type="text"  value="${item.modelo}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="placa" style="width: 70px;" type="text"  value="${item.placa}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="año" style="width: 50px;" type="text"  value="${item.año}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="verificacion" style="width: 150px;" type="text"  value="${item.verificacion}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="poliza" style="width: 100px;" type="text"  value="${item.poliza}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="inciso" style="width: 100px;" type="text"  value="${item.inciso}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td><input name="contacto" type="text" style="width: 100px;"  value="${item.contacto}" ${user === "CVehicular" ? "" : "disabled"}></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="circuito" id="circuito">
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
      <td><input name="fecha" style="width: 100px;" type="text"  value="${item.fecha}"></td>
      <td>
      <select class="form-select form-select-sm" style="height: 24px; width: 120px; font-size: 12px; ${user === "Traffic" || user === "TrafficH" ? "background-color: #b9e1ff;" : ""}" name="ubicacion" id="ubicacion">
          <option value="${item.ubicacion}">${item.ubicacion}</option> 
          <option value="TALLER MX">TALLER MX</option>
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
          <option value="EN TRANSITO">EN TRANSITO</option>
          </select>
      </td>
      <td><input name="comentarios" style="width: 250px;" type="text""  value="${item.comentarios}"></td>  
      </tbody>
      
    </table>
    </div>
          `;
    });

      }

    } else
    if (e.target.matches(".remolque")) {
      //  console.log(e.target);

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
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;
    

      
    }else
    if (e.target.matches(".unidad")) {
    
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
      <th scope="col">CONTACTO DEL SEGURO</th>
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
    <td><input name="contacto" type="text" style="width: 80px;"></td>
    <td><input name="circuito" type="text"></td>
    <td><input name="fecha" type="date"></td>
    <td><input name="ubicacion" type="text"></td>
    <td><input name="comentarios" type="text"></td>  
    </tbody>
      
    </table>
    </div>
          `;


    }  else
    if (e.target.matches(".tablero")) {
     window.location.hash = "/"+ user+"/productivo";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;
   }else
   if (e.target.matches(".equipov")) {
     window.location.hash = "/"+ user +"/equipov";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;
   }else
   if (e.target.matches(".history")) {
     window.location.hash = "/"+user+"/history";
     localStorage.tabConveyance = false;
     localStorage.tabViajes = true;
      localStorage.tabUnit = false;
   }else
   if (e.target.matches(".cajas")) {
     window.location.hash = "/"+user+"/cajas";
     localStorage.tabConveyance = true;
     localStorage.tabViajes = false;
   localStorage.tabUnit = false;
     
   }else
    if(e.target.matches(".generar_xls")){
      //let $dataTable = d.getElementById("table_xls");
          generar_xls('table_xls', 'Reporte');

    } else
    
    return;
  });

   d.addEventListener("submit", async (e) => {
     e.preventDefault();
  // console.log(e.target);
   
  if (e.target.matches(".search-form") && localStorage.tabUnit === "true") {
 // console.log(e.target);
  let query = localStorage.getItem("apiSearch").toUpperCase();

  //console.log(query);

  let item = d.querySelectorAll(".item");
      item.forEach((e) => {
  //  console.log(e.dataset.unit, e.dataset.box, e.dataset.track);
    if (!query) {
      e.classList.remove("filter");
      return false;
    } 
    else if (e.dataset.unit.includes(query) ||
    e.dataset.circuito.includes(query) ||
    e.dataset.ubicacion.includes(query)
    ) {
      e.classList.remove("filter");
    } 
    else {
      e.classList.add("filter");
    }
                  });
    }  
    else if (e.target.matches(".edit")) {
   
      if(localStorage.tabConveyance === "false" && localStorage.tabUnit == "true"){
        
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
              contacto: e.target.contacto.value.toUpperCase(),
             circuito: e.target.circuito.value.toUpperCase(),
             fecha: e.target.fecha.value.toUpperCase(),
             ubicacion: e.target.ubicacion.value.toUpperCase(),
             comentarios: e.target.comentarios.value.toUpperCase()

          }, keyValue = d.getElementById("bt-save").dataset.value;

          update(ref(db), {
            ["/subitem/" + d.getElementById("bt-save").dataset.value]: body,
          })
          .then(() => {
            // console.log("asignado"); 
             d.getElementById(`${keyValue}`).classList.add("parpadeo");
             setTimeout(function() {
               d.getElementById(`${keyValue}`).classList.remove("parpadeo"); // Elimina la clase de parpadeo después de 1 segundo
             }, 1000);
           })
           .catch((error) => {
             // The write failed...
           });

        }
  
  
      }
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
   }   


   
  } else {
        return 
   }
  

}

